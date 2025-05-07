
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
  
    Object.entries(fieldConfigs).forEach(([key, config], index) => {
      const label = config.label || `Field${index + 1}`;
      const stateKey = `field_${index}`;
      const safeLabel = label.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  
      stateDeclarations += `const [${stateKey}, set${stateKey}] = React.useState("");\n`;
  
      if (key.startsWith("Dropdown")) {
        const options = (config.options || [])
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join("\n");
        inputsCode += `
          <label>${label}</label>
          <select className="p-2 border rounded mb-2" value={${stateKey}} onChange={(e) => set${stateKey}(e.target.value)}>
            <option value="">Select</option>
            ${options}
          </select>
        `;
      } else if (key.startsWith("Checkbox") || key.startsWith("Toggle Switch")) {
        inputsCode += `
          <label className="inline-flex items-center mb-2">
            <input type="checkbox" checked={${stateKey}} onChange={(e) => set${stateKey}(e.target.checked)} className="mr-2" />
            ${label} ${config.condition ? `(${config.condition})` : ""}
          </label>
        `;
      } else if (key.startsWith("Radio Group")) {
        inputsCode += `
          <label>${label}</label>
          <div className="mb-2">
            <label className="mr-4">
              <input type="radio" name="${safeLabel}" value="Option 1" checked={${stateKey} === "Option 1"} onChange={() => set${stateKey}("Option 1")} className="mr-1" /> Option 1
            </label>
            <label>
              <input type="radio" name="${safeLabel}" value="Option 2" checked={${stateKey} === "Option 2"} onChange={() => set${stateKey}("Option 2")} className="mr-1" /> Option 2
            </label>
          </div>
        `;
      } else if (key === "Date") {
        inputsCode += `
          <label>${label}</label>
          <input type="date" className="p-2 border rounded mb-2" value={${stateKey}} onChange={(e) => set${stateKey}(e.target.value)} />
        `;
      } else if (key.startsWith("Textarea")) {
        inputsCode += `
          <label>${label}</label>
          <textarea className="p-2 border rounded mb-2" rows="4" value={${stateKey}} onChange={(e) => set${stateKey}(e.target.value)} />
        `;
      } else if (key === "Number") {
        inputsCode += `
          <label>${label}</label>
          <input type="number" className="p-2 border rounded mb-2" value={${stateKey}} onChange={(e) => set${stateKey}(e.target.value)} />
        `;
      } else if (key.startsWith("Button")) {
        // Skip rendering internal buttons
      } else {
        // Default: text input
        inputsCode += `
          <label>${label}</label>
          <input type="text" className="p-2 border rounded mb-2" value={${stateKey}} onChange={(e) => set${stateKey}(e.target.value)} />
        `;
      }
    });
  
  

    const dataObject = Object.entries(fieldConfigs)
      .map(([_, config], index) => {
       const fieldName = config.dbFieldName || config.label || `Field${index + 1}`;
       const stateKey = `field_${index}`;
       return `"${fieldName}": ${stateKey}`;
     })
   .join(",\n      ");

  
    return `import React from "react";
  
  const GeneratedForm = () => {
    ${stateDeclarations}
  
    const handleSubmit = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/insert-into-table", {
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
      <div className="p-6 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6">${pageName.replace(/_/g, " ")}</h1>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          ${inputsCode}
  
          <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">
            Enter
          </button>
        </form>
      </div>
    );
  };
  
  export default GeneratedForm;
  `;
  }
  
  
module.exports = router;

