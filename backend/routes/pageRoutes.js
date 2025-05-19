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

const GeneratedForm = () => {
  ${stateDeclarations}

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tableName: "${pageName}_Table",
          data: {
            ${dataObject}
          }
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Data inserted successfully");
      } else {
        alert("❌ Failed to insert data: " + result.message);
      }
    } catch (err) {
      console.error("Error inserting data", err);
      alert("❌ Unexpected error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-3xl font-bold cursor-pointer"
            onClick={() => window.location.href = "/admin-dashboard"}
          >
            Alcon
          </h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
            <button onClick={() => window.location.href = "/admin-dashboard"} className="hover:text-yellow-300">Home</button>
            <button onClick={() => window.location.href = "/your-pages"} className="hover:text-yellow-300">Pages</button>
            <button onClick={() => alert('About')} className="hover:underline">About</button>
            <button onClick={() => alert('Contact')} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6 text-center">${pageName.replace(/_/g, " ")}</h1>
        <form className="flex flex-col gap-4 w-full max-w-2xl" onSubmit={e => e.preventDefault()}>
          ${inputsCode}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-6 rounded text-sm shadow-lg"
            >
              Enter
            </button>
          </div>
        </form>
      </main>

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

