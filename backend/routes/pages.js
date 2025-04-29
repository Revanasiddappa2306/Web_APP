const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// API to generate a form component dynamically
router.post('/generate-form', (req, res) => {
  const fieldConfigs = req.body;

  if (!fieldConfigs || Object.keys(fieldConfigs).length === 0) {
    return res.status(400).json({ message: 'No field configuration provided' });
  }

  const timestamp = Date.now();
  const pageName = `GeneratedForm_${timestamp}.js`;

  // Adjust path for your folder structure
  const filePath = path.join(__dirname, '../../frontend/src/pages/generated', pageName);

  const formCode = generateReactForm(fieldConfigs);

  // Make sure directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFile(filePath, formCode, (err) => {
    if (err) {
      console.error("❌ Error writing file:", err);
      return res.status(500).json({ message: 'Failed to write file' });
    }

    return res.status(200).json({ message: 'Page generated successfully', pageName });
  });
});

const generateReactForm = (configs) => {
  const fields = Object.entries(configs)
    .map(([key, conf]) => {
      const { label = "", options = [], condition = "" } = conf;

      if (key.startsWith("Text")) {
        return `<label>${label}</label><input type="text" className="border p-2 w-full mb-4 rounded" />`;
      }
      if (key.startsWith("Dropdown")) {
        return `
<label>${label}</label>
<select className="border p-2 w-full mb-4 rounded">
  ${options.map((opt) => `<option>${opt}</option>`).join("\n  ")}
</select>`;
      }
      if (key.startsWith("Checkbox")) {
        return `<label><input type="checkbox" /> ${label} (${condition})</label>`;
      }

      return '';
    })
    .join('\n');

  return `
import React from "react";

const GeneratedForm = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generated Form</h2>
      <form className="space-y-4">
        ${fields}
      </form>
    </div>
  );
};

export default GeneratedForm;
`;
};

module.exports = router;
