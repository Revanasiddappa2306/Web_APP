const express = require("express");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const router = express.Router();
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

/////////////// Generate Form route ///////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/generate-form", (req, res) => {
  const { pageName, fieldConfigs } = req.body;

  if (!pageName || typeof pageName !== "string") {
    return res.status(400).send("Page name is required and must be a string.");
  }
  const sanitizedPageName = pageName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  const fileName = `${sanitizedPageName}.js`;

  const componentCode = generateComponentCode(fieldConfigs, sanitizedPageName);
  const filePath = path.join(__dirname, "../../frontend/src/pages/generated", fileName);

  fs.writeFile(filePath, componentCode, (err) => {
    if (err) {
      console.error("❌ Error writing file:", err);
      return res.status(500).send("Failed to write file.");
    }
    console.log(`✅ Form generated: ${fileName}`);
    res.send({ message: "Form generated!", fileName });
  });
});

/////////////////////// list pages route ///////////////////////////////////////////////////////////////////////////////////////////////////////
  router.get("/list-pages", (req, res) => {
    const generatedDir = path.join(__dirname, "../../frontend/src/pages/generated");
  
    fs.readdir(generatedDir, (err, files) => {
      if (err) {
        console.error("❌ Failed to read generated folder:", err);
        return res.status(500).json({ message: "Failed to list pages." });
      }
  
      const pageFiles = files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));
      res.json({ pages: pageFiles });
    });
  });

  ///////// Delete Pages ///////////////////////////////////////////////////////////////////////////////////////////////////////
  router.post("/delete-pages", async (req, res) => {
    const { pages } = req.body;
  
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ message: "Pages must be a non-empty array" });
    }
  
    const generatedDir = path.join(__dirname, "../../frontend/src/pages/generated");
  
    try {
      const pool = await poolPromise;
      const request = pool.request();
  
      // Step 1: Get PageIDs and PageNames from Pages table
      const placeholders = pages.map((_, i) => `@name${i}`).join(", ");
      pages.forEach((name, i) => {
        request.input(`name${i}`, sql.VarChar, name);
      });
  
      const result = await request.query(`
        SELECT PageID, PageName FROM Pages
        WHERE PageName IN (${placeholders})
      `);
  
      const pageInfos = result.recordset;
  
      // Step 1.5: Check for assignments in RolePageAssignments
      const assignedPages = [];
      for (const page of pageInfos) {
        const { PageID, PageName } = page;
        const assignResult = await pool.request()
          .input("PageID", sql.VarChar, PageID)
          .query(`SELECT COUNT(*) as count FROM RolePageAssignments WHERE PageID = @PageID`);
        if (assignResult.recordset[0].count > 0) {
          assignedPages.push(PageName);
        }
      }
  
      if (assignedPages.length > 0) {
        return res.status(400).json({
          message: "Some pages are assigned to roles.",
          assignedPages
        });
      }
  
      // Step 2: Delete from PageDataTables and drop corresponding PageName_table
      for (const page of pageInfos) {
        const { PageID, PageName } = page;
  
        // Delete related entries from PageDataTables
        await pool.request()
          .input("PageID", sql.VarChar, PageID)
          .query(`DELETE FROM PageDataTables WHERE PageID = @PageID`);
  
        // Drop the dynamic page table
        const tableName = `[${PageName}_table]`;
        await pool.request().query(`IF OBJECT_ID('${tableName}', 'U') IS NOT NULL DROP TABLE ${tableName}`);
      }
  
      // Step 3: Delete from Pages table
      const delRequest = pool.request();
      pages.forEach((name, i) => {
        delRequest.input(`name${i}`, sql.VarChar, name);
      });
      await delRequest.query(`
        DELETE FROM Pages WHERE PageName IN (${placeholders})
      `);
  
      // Step 4: Delete JS files from frontend
      pages.forEach((page) => {
        const filePath = path.join(generatedDir, `${page}.js`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Deleted file: ${filePath}`);
        }
      });
  
      res.status(200).json({ message: "Pages and related data deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting pages:", err);
      res.status(500).json({ message: "Error deleting pages", error: err.message });
    }
  });


  ////////////////////  export table data route ///////////////////////////////////////////////////////////////////////////////////////////////////////
  router.post("/export-table", async (req, res) => {
    const { tableName } = req.body;
  
    if (!tableName) {
      return res.status(400).json({ message: "Table name is required" });
    }
  
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`SELECT * FROM [${tableName}]`);
  
      const rows = result.recordset;
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "No data found in the table" });
      }
  
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(rows);
      xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
  
      // Convert workbook to a buffer
      const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
  
      // Set headers and send the buffer as a response
      res.setHeader("Content-Disposition", `attachment; filename=${tableName}.xlsx`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buffer);
    } catch (err) {
      console.error("Error exporting table:", err);
      res.status(500).json({ message: "Failed to export table data" });
    }
  });
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function generateComponentCode(fieldConfigs, pageName) {
    let stateDeclarations = '';
    const usedComponents = new Set();

    // First loop: only for state and usedComponents
    Object.entries(fieldConfigs).forEach(([key, config], index) => {
      // Always sanitize field name for DB and data keys
      const safeFieldName = (config.label || `Field${index + 1}`)
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      const stateKey = `field_${index}`;
      const type = config.type || key.split("-")[0];

      stateDeclarations += `const [${stateKey}, set${stateKey}] = React.useState("");\n`;

      if (type === "Dropdown") usedComponents.add("Dropdown");
      else if (type === "Checkbox") usedComponents.add("Checkbox");
      else if (type === "DatePicker" || type === "Date") usedComponents.add("DatePicker");
      else if (type === "NumberInput" || type === "Number") usedComponents.add("NumberInput");
      else if (type === "TextField" || type === "Text") usedComponents.add("TextField");
    });

    // Second loop: build formFields string
    let formFields = "";
    Object.entries(fieldConfigs).forEach(([key, config], index) => {
      const safeFieldName = (config.label || `Field${index + 1}`)
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      const stateKey = `field_${index}`;
      const type = config.type || key.split("-")[0];

      const displayLabel = (config.label || '').replace(/_/g, " ");

      if (type === "Dropdown") {
        formFields += `
          <div key="${key}-${index}">
            <Dropdown
              label="${displayLabel}"
              value={${stateKey}}
              onChange={set${stateKey}}
              options={${JSON.stringify(config.options || [])}}
            />
          </div>
        `;
      } else if (type === "Checkbox") {
        formFields += `
          <div key="${key}-${index}">
            <Checkbox
              label="${displayLabel}${config.condition ? ` (${config.condition})` : ""}"
              checked={${stateKey}}
              onChange={set${stateKey}}
            />
          </div>
        `;
      } else if (type === "DatePicker" || type === "Date") {
        formFields += `
          <div key="${key}-${index}">
            <DatePicker
              label="${displayLabel}"
              value={${stateKey}}
              onChange={set${stateKey}}
            />
          </div>
        `;
      } else if (type === "NumberInput" || type === "Number") {
        formFields += `
          <div key="${key}-${index}">
            <NumberInput
              label="${displayLabel}"
              value={${stateKey}}
              onChange={set${stateKey}}
            />
          </div>
        `;
      } else if (type === "TextField" || type === "Text") {
        formFields += `
          <div key="${key}-${index}">
            <TextField
              label="${displayLabel}"
              value={${stateKey}}
              onChange={set${stateKey}}
            />
          </div>
        `;
      } else {
        formFields += `
          <div key="${key}-${index}">
            <input
              type="text"
              className="p-2 border rounded mb-2 w-full"
              placeholder="${displayLabel}"
              value={${stateKey}}
              onChange={(e) => set${stateKey}(e.target.value)}
            />
          </div>
        `;
      }
    });

    // Now wrap in grid
    const inputsCode = `
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        ${formFields}
      </div>
    `;

    // Generate import statements
    const importMap = {
      DatePicker: 'import DatePicker from "../../components/DatePicker";',
      NumberInput: 'import NumberInput from "../../components/NumberInput";',
      Checkbox: 'import Checkbox from "../../components/Checkbox";',
      Dropdown: 'import Dropdown from "../../components/Dropdown";',
      TextField: 'import TextField from "../../components/TextField";',
    };
    const imports = Array.from(usedComponents).map(c => importMap[c]).join("\n");

    const adminCheck = `
    const admin = localStorage.getItem("admin");
    const isAdmin = admin && admin !== "undefined" && admin !== "{}";
  `;

      // Export functionality
  const exportButton = `
  {isAdmin && (
    <div className="relative group flex items-center">
      <span
        className="cursor-pointer"
        onClick={async () => {
          try {
            const response = await fetch("http://localhost:5000/api/pages/export-table", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tableName: "${pageName}_Table" }),
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "${pageName}_Table.xlsx";
              link.click();
            } else {
              alert("❌ Failed to export data");
            }
          } catch (err) {
            alert("❌ Unexpected error");
          }
        }}
      >
        <ArrowUpIcon className="h-5 w-5 text-black" />
      </span>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Export Data to Excel
      </div>
    </div>
  )}
`;

    // Data object for insert/update
    const dataObject = Object.entries(fieldConfigs)
      .map(([_, config], index) => {
        const safeFieldName = (config.label || `Field${index + 1}`)
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");
        const stateKey = `field_${index}`;
        return `"${safeFieldName}": ${stateKey}`;
      })
      .join(",\n      ");

    // Row click: load data into fields
    const rowClickSetters = Object.entries(fieldConfigs).map(([_, config], index) => {
      const safeFieldName = (config.label || `Field${index + 1}`)
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      return `setfield_${index}(row["${safeFieldName}"] ?? "");`;
    }).join("\n    ");

    // Helper for column width
function getColWidth(type) {
  if (!type) return "min-w-[120px]";
  type = type.toLowerCase();
  if (type.includes("number") || type.includes("int") || type.includes("float")) return "min-w-[80px] w-[80px]";
  if (type.includes("date")) return "min-w-[120px] w-[120px]";
  if (type.includes("checkbox") || type.includes("bit")) return "min-w-[60px] w-[60px]";
  if (type.includes("dropdown")) return "min-w-[100px] w-[100px]";
  if (type.includes("comment") || type.includes("text")) return "min-w-[160px] w-[160px]";
  return "min-w-[120px] w-[120px]";
}

const tableHeaders = Object.entries(fieldConfigs)
  .map(([_, config]) => {
    const type = config.type || "";
    return `<th className="p-2 border-b border-r ${getColWidth(type)}">${(config.label || '').replace(/_/g, " ")}</th>`;
  })
  .join("");

const tableCells = Object.entries(fieldConfigs).map(([_, config], index) => {
  const safeFieldName = (config.label || `Field${index + 1}`)
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  const type = config.type || "";
  if (type.toLowerCase().includes("date")) {
    return `<td className="p-2 border-b border-r ${getColWidth(type)}">{row["${safeFieldName}"] ? new Date(row["${safeFieldName}"]).toLocaleDateString() : ""}</td>`;
  }
  return `<td className="p-2 border-b border-r ${getColWidth(type)}">{row["${safeFieldName}"]}</td>`;
}).join("");

   

return `
  import React from "react";
  ${imports}
  import { useState } from "react";
  import AboutPopup from "../../components/popups/AboutPopup";
  import ContactPopup from "../../components/popups/ContactPopup";
  import { useNavigate } from "react-router-dom";
  import { ArrowUpIcon } from '@heroicons/react/24/solid';

  const GeneratedForm = () => {
    ${stateDeclarations}
    ${adminCheck}

    const [tableData, setTableData] = React.useState([]);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [editingIndex, setEditingIndex] = React.useState(null);
    const [showAbout, setShowAbout] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [search, setSearch] = React.useState("");
    const navigate = useNavigate();

    const goHome = () => {
      const admin = localStorage.getItem("admin");
      const user = localStorage.getItem("user");
      if (admin && admin !== "undefined" && admin !== "{}") {
        navigate("/admin-dashboard");
      } else if (user && user !== "undefined" && user !== "{}") {
        navigate("/user-dashboard");
      } else {
        navigate("/home");
      }
    };

    // Fetch table data
    React.useEffect(() => {
      fetch("http://localhost:5000/api/tables/get-table-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableName: "${pageName}_Table" })
      })
        .then(res => res.json())
        .then(data => setTableData(data.rows || []));
    }, []);

    // Helper: clear form fields
    const clearFields = () => {
      ${Object.entries(fieldConfigs).map(([_, config], index) => `setfield_${index}("");`).join("\n    ")}
      setEditingIndex(null);
    };

    // Enter (Insert)
    const handleEnter = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableName: "${pageName}_Table",
            data: {
              ${dataObject}
            }
          })
        });
        if (response.ok) window.location.reload();
        else alert("❌ Failed to insert data");
      } catch (err) {
        alert("❌ Unexpected error");
      }
    };

    // Update
    const handleUpdate = async () => {
      if (editingIndex === null) return;
      const row = tableData[editingIndex];
      try {
        const response = await fetch("http://localhost:5000/api/tables/update-row", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableName: "${pageName}_Table",
            id: row.ID,
            data: {
              ${dataObject}
            }
          })
        });
        if (response.ok) window.location.reload();
        else alert("❌ Failed to update data");
      } catch (err) {
        alert("❌ Unexpected error");
      }
    };

    // Delete
    const handleDelete = async () => {
      if (selectedRows.length === 0) return;
      if (!window.confirm("Are you sure you want to delete the selected row(s)?")) return;
      try {
        const response = await fetch("http://localhost:5000/api/tables/delete-rows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableName: "${pageName}_Table",
            ids: selectedRows
          })
        });
        if (response.ok) window.location.reload();
        else alert("❌ Failed to delete data");
      } catch (err) {
        alert("❌ Unexpected error");
      }
    };

    // Row click: load data into fields
    const handleRowClick = idx => {
      const row = tableData[idx];
      ${rowClickSetters}
      setEditingIndex(idx);
    };

    // Row select (checkbox)
    const handleSelectRow = id => {
      setSelectedRows(prev =>
        prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
      );
    };

    const filteredTableData = tableData.filter(row =>
      Object.values(row).some(
        val => val && val.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    return (
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        {/* Navbar */}
        <header className="bg-blue-900 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1
              className="text-3xl font-bold cursor-pointer"
              onClick={goHome}
            >
              Alcon
            </h1>
            <nav className="flex items-center gap-8 text-lg font-medium">
              <button onClick={goHome} className="hover:text-yellow-300">Home</button>
              <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
              <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col items-center justify-start w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">${pageName.replace(/_/g, " ")}</h1>
          
          <form className="flex flex-col gap-4 w-full max-w-full" onSubmit={e => e.preventDefault()}>
            ${inputsCode}
            <div className="flex justify-between items-center mt-4 mb-4 w-full">
    {/* Left: Empty */}
    <div className="w-1/3"></div>
    {/* Center: Buttons */}
    <div className="flex gap-10 justify-center w-1/3">
      <button type="button" onClick={handleEnter} className="bg-blue-500 text-white py-2 px-6 rounded text-sm shadow-lg">
        Enter
      </button>
      <button type="button" onClick={handleUpdate} className="bg-yellow-500 text-white py-2 px-6 rounded text-sm shadow-lg" disabled={editingIndex === null}>
        Update
      </button>
      <button type="button" onClick={handleDelete} className="bg-red-600 text-white py-2 px-6 rounded text-sm shadow-lg" disabled={selectedRows.length === 0}>
        Delete
      </button>
      <button type="button" onClick={clearFields} className="bg-gray-400 text-white py-2 px-6 rounded text-sm shadow-lg">
        Clear
      </button>
    </div>
    {/* Right: Search */}
    <div className="w-1/3 flex justify-end">
      <input
        type="text"
        placeholder="Search..."
        className="p-2 border rounded w-56"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      ${exportButton}
    </div>
  </div>
          </form>
          <hr className="my-6 w-full border-t-2 border-gray-300" />
          {/* Data Table */}
          <div className="w-full flex justify-center mb-6">
            <div className="w-full overflow-x-auto">
              <table className="table-auto bg-white border border-gray-300 shadow mx-auto">
                <thead>
                  <tr>
                    <th className="p-2 border-b border-r min-w-[60px]"></th>
                    ${tableHeaders}
                  </tr>
                </thead>
                <tbody>
                  {filteredTableData.map((row, idx) => (
                    <tr
                      key={row.ID}
                      className="hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleRowClick(idx)}
                    >
                      <td className="p-2 border-b border-r text-center min-w-[60px]">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.ID)}
                          onChange={e => {
                            e.stopPropagation();
                            handleSelectRow(row.ID);
                          }}
                        />
                      </td>
                      ${tableCells}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
        {showContact && <ContactPopup onClose={() => setShowContact(false)} />}

        {/* Footer */}
        <footer className="bg-blue-900 text-white text-center p-4 mt-auto shadow-inner">
          <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
        </footer>
      </div>
    );
  };

  export default GeneratedForm;
`;
  }
  
  
module.exports = router;




