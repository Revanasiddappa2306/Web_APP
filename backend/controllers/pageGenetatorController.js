const fs = require('fs');
const path = require('path');

exports.generatePage = async (req, res) => {
  const { fields } = req.body;

  let content = `export default function GeneratedPage() {\n  return (\n    <div className="p-4">\n`;

  Object.entries(fields).forEach(([type, names]) => {
    names.forEach((name, index) => {
      switch (type) {
        case 'textbox':
          content += `      <input type="text" placeholder="${name}" className="block mb-2 border p-1"/>\n`;
          break;
        case 'button':
          content += `      <button className="block mb-2 bg-blue-500 text-white p-2 rounded">${name}</button>\n`;
          break;
        case 'checkbox':
          content += `      <label><input type="checkbox" /> ${name}</label>\n`;
          break;
        case 'radio':
          content += `      <label><input type="radio" name="${type}" /> ${name}</label>\n`;
          break;
        case 'dropdown':
          content += `      <select className="block mb-2 border p-1"><option>${name}</option></select>\n`;
          break;
      }
    });
  });

  content += `    </div>\n  );\n}`;

  const filePath = path.join(__dirname, '../../frontend/src/pages/generated/GeneratedPage.jsx');
  fs.writeFileSync(filePath, content);

  res.status(200).json({ message: 'Page generated successfully!' });
};
