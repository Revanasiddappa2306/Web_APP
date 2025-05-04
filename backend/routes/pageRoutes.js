
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();


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


  // router.post("/delete-pages", (req, res) => {
  //   const { pages } = req.body;
  //   if (!Array.isArray(pages)) {
  //     return res.status(400).json({ message: "Pages must be an array" });
  //   }
  
  //   const generatedDir = path.join(__dirname, "../../frontend/src/pages/generated");
  
  //   pages.forEach((page) => {
  //     const filePath = path.join(generatedDir, `${page}.js`);
  //     if (fs.existsSync(filePath)) {
  //       fs.unlinkSync(filePath);
  //     }
  //   });
  
  //   res.json({ message: "Selected pages deleted successfully" });
  // });




  router.post("/delete-pages", async (req, res) => {
    const { pages } = req.body;
  
    if (!Array.isArray(pages)) {
      return res.status(400).json({ message: "Pages must be an array" });
    }
  
    const generatedDir = path.join(__dirname, "../../frontend/src/pages/generated");
  
    // Delete files
    pages.forEach((page) => {
      const filePath = path.join(generatedDir, `${page}.js`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted file: ${filePath}`);
      }
    });
  
    try {
      // Build SQL placeholders dynamically
      const placeholders = pages.map((_, i) => `@page${i}`).join(", ");
      const request = db.request();
  
      pages.forEach((page, i) => {
        request.input(`page${i}`, db.sql.VarChar, page);
      });
  
      await request.query(
        `DELETE FROM Pages WHERE PageName IN (${placeholders})`
      );
  
      res.json({ message: "Selected pages deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting from DB:", err);
      res.status(500).json({ message: "Error deleting pages from database" });
    }
  });


function generateComponentCode(fieldConfigs, pageName) {
  let fields = Object.entries(fieldConfigs)
    .map(([key, config]) => {
      const label = config.label || "Field";

      if (key.startsWith("Dropdown")) {
        const options = (config.options || [])
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join("\n");
        return `
          <label>${label}</label>
          <select className="p-2 border rounded mb-2">
            ${options}
          </select>
        `;
      }

      if (key.startsWith("Checkbox")) {
        return `
          <label className="inline-flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            ${label} ${config.condition ? `(${config.condition})` : ""}
          </label>
        `;
      }

      if (key.startsWith("Radio Group")) {
        return `
          <label>${label}</label>
          <div className="mb-2">
            <label className="mr-4">
              <input type="radio" name="${key}" value="Option 1" className="mr-1" /> Option 1
            </label>
            <label>
              <input type="radio" name="${key}" value="Option 2" className="mr-1" /> Option 2
            </label>
          </div>
        `;
      }

      if (key.startsWith("Date Picker")) {
        return `
          <label>${label}</label>
          <input type="date" className="p-2 border rounded mb-2" />
        `;
      }

      if (key.startsWith("Textarea")) {
        return `
          <label>${label}</label>
          <textarea className="p-2 border rounded mb-2" rows="4" />
        `;
      }

      if (key.startsWith("Number Input")) {
        return `
          <label>${label}</label>
          <input type="number" className="p-2 border rounded mb-2" />
        `;
      }

      if (key.startsWith("Toggle Switch")) {
        return `
          <label className="inline-flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            ${label} (Toggle)
          </label>
        `;
      }

      if (key.startsWith("Button")) {
        return `
          <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
            ${label}
          </button>
        `;
      }

      // Default fallback: text field
      return `
        <label>${label}</label>
        <input type="text" className="p-2 border rounded mb-2" />
      `;
    })
    .join("\n");

  // Escape backticks or problematic quotes if needed
  return `import React from "react";

const GeneratedForm = () => {
  return (
    <div className="p-6 bg-white text-black min-h-screen">
     <h1 className="text-2xl font-bold mb-6">${pageName.replace(/_/g, " ")}</h1>
      <form className="flex flex-col gap-4">
        ${fields}

        <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded">
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

