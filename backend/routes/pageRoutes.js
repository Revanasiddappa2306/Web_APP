const express = require("express");
const fs = require("fs");
const path = require("path");
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
  
      // Step 2: Delete from PageDataTables and drop corresponding PageName_table
      for (const page of pageInfos) {
        const { PageID, PageName } = page;
  
        // Delete related entries from PageDataTables
        await pool.request()
          .input("PageID", sql.VarChar, PageID)
          .query(`DELETE FROM PageDataTables WHERE PageID = @PageID`);
  
        // Drop the dynamic page table (e.g., Siddu2306_table)
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
 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function generateComponentCode(fieldConfigs, pageName) {
    let stateDeclarations = '';
    let inputsCode = '';
    const usedComponents = new Set();

    Object.entries(fieldConfigs).forEach(([key, config], index) => {
      const label = config.label || `Field${index + 1}`;
      const stateKey = `field_${index}`;
      const type = config.type || key.split("-")[0];

      stateDeclarations += `const [${stateKey}, set${stateKey}] = React.useState("");\n`;

      if (type === "Dropdown") {
        usedComponents.add("Dropdown");
        inputsCode += `
          <Dropdown
            label="${label}"
            value={${stateKey}}
            onChange={set${stateKey}}
            options={${JSON.stringify(config.options || [])}}
          />
        `;
      } else if (type === "Checkbox") {
        usedComponents.add("Checkbox");
        inputsCode += `
          <Checkbox
            label="${label}${config.condition ? ` (${config.condition})` : ""}"
            checked={${stateKey}}
            onChange={set${stateKey}}
          />
        `;
      } else if (type === "DatePicker" || type === "Date") {
        usedComponents.add("DatePicker");
        inputsCode += `
          <DatePicker
            label="${label}"
            value={${stateKey}}
            onChange={set${stateKey}}
          />
        `;
      } else if (type === "NumberInput" || type === "Number") {
        usedComponents.add("NumberInput");
        inputsCode += `
          <NumberInput
            label="${label}"
            value={${stateKey}}
            onChange={set${stateKey}}
          />
        `;
      } else if (type === "TextField" || type === "Text") {
        usedComponents.add("TextField");
        inputsCode += `
          <TextField
            label="${label}"
            value={${stateKey}}
            onChange={set${stateKey}}
          />
        `;
      } else {
        // Default: text input
        inputsCode += `
          <input
            type="text"
            className="p-2 border rounded mb-2"
            placeholder="${label}"
            value={${stateKey}}
            onChange={(e) => set${stateKey}(e.target.value)}
          />
        `;
      }
    });

    // Generate import statements
    const importMap = {
      DatePicker: 'import DatePicker from "../../components/DatePicker";',
      NumberInput: 'import NumberInput from "../../components/NumberInput";',
      Checkbox: 'import Checkbox from "../../components/Checkbox";',
      Dropdown: 'import Dropdown from "../../components/Dropdown";',
      TextField: 'import TextField from "../../components/TextField";',
    };
    const imports = Array.from(usedComponents).map(c => importMap[c]).join("\n");

    const dataObject = Object.entries(fieldConfigs)
      .map(([_, config], index) => {
        const fieldName = config.dbFieldName || config.label || `Field${index + 1}`;
        const stateKey = `field_${index}`;
        return `"${fieldName}": ${stateKey}`;
      })
      .join(",\n      ");

    return `import React from "react";
${imports}
import { useState } from "react";
import AboutPopup from "../../components/popups/AboutPopup";
import ContactPopup from "../../components/popups/ContactPopup";
import { useNavigate } from "react-router-dom";

const GeneratedForm = () => {
  ${stateDeclarations}
  
  const [tableData, setTableData] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
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
    ${Object.entries(fieldConfigs).map(([_, config], index) => {
      const fieldName = config.dbFieldName || config.label || `Field${index + 1}`;
      return `setfield_${index}(row["${fieldName}"] ?? "");`;
    }).join("\n    ")}
    setEditingIndex(idx);
  };

  // Row select (checkbox)
  const handleSelectRow = id => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

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
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6 text-center">${pageName.replace(/_/g, " ")}</h1>
        <form className="flex flex-col gap-4 w-full max-w-2xl" onSubmit={e => e.preventDefault()}>
          ${inputsCode}
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" onClick={handleEnter} className="bg-blue-500 text-white py-2 px-6 rounded text-sm shadow-lg" >
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
        </form>
        <hr className="my-6 w-full max-w-2xl border-t-2 border-gray-300" />
        {/* Data Table */}
        <div className="w-full max-w-2xl">
          <table className="min-w-full bg-white border border-gray-300 shadow">
            <thead>
              <tr>
                <th className="p-2 border-b"></th>
                ${Object.entries(fieldConfigs).map(([_, config]) =>
                  `<th className="p-2 border-b">${config.label}</th>`
                ).join("")}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr
                  key={row.ID}
                  className="hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleRowClick(idx)}
                >
                  <td className="p-2 border-b text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.ID)}
                      onChange={e => {
                        e.stopPropagation();
                        handleSelectRow(row.ID);
                      }}
                    />
                  </td>
                  ${Object.entries(fieldConfigs).map(([_, config]) => {
                    const fieldName = config.dbFieldName || config.label || `Field${index + 1}`;
                    // If this is a Date field, format it
                    if ((config.type || "").toLowerCase().includes("date")) {
                      return `<td className="p-2 border-b">{row["${fieldName}"] ? new Date(row["${fieldName}"]).toLocaleDateString() : ""}</td>`;
                    }
                    return `<td className="p-2 border-b">{row["${fieldName}"]}</td>`;
                  }).join("")}
                </tr>
              ))}
            </tbody>
          </table>
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

