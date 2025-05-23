import React from "react";
import TextField from "../../components/TextField";
import { useState } from "react";
import AboutPopup from "../../components/popups/AboutPopup";
import ContactPopup from "../../components/popups/ContactPopup";
import { useNavigate } from "react-router-dom";

const GeneratedForm = () => {
  const [field_0, setfield_0] = React.useState("");
const [field_1, setfield_1] = React.useState("");
const [field_2, setfield_2] = React.useState("");
const [field_3, setfield_3] = React.useState("");
const [field_4, setfield_4] = React.useState("");
const [field_5, setfield_5] = React.useState("");
const [field_6, setfield_6] = React.useState("");
const [field_7, setfield_7] = React.useState("");
const [field_8, setfield_8] = React.useState("");
const [field_9, setfield_9] = React.useState("");

  
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
      body: JSON.stringify({ tableName: "fields10_Table" })
    })
      .then(res => res.json())
      .then(data => setTableData(data.rows || []));
  }, []);

  // Helper: clear form fields
  const clearFields = () => {
    setfield_0("");
    setfield_1("");
    setfield_2("");
    setfield_3("");
    setfield_4("");
    setfield_5("");
    setfield_6("");
    setfield_7("");
    setfield_8("");
    setfield_9("");
    setEditingIndex(null);
  };

  // Enter (Insert)
  const handleEnter = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: "fields10_Table",
          data: {
            "f1": field_0,
      "f2": field_1,
      "f3": field_2,
      "f4": field_3,
      "f5": field_4,
      "f6f": field_5,
      "f7": field_6,
      "f8": field_7,
      "f9": field_8,
      "f10": field_9
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
          tableName: "fields10_Table",
          id: row.ID,
          data: {
            "f1": field_0,
      "f2": field_1,
      "f3": field_2,
      "f4": field_3,
      "f5": field_4,
      "f6f": field_5,
      "f7": field_6,
      "f8": field_7,
      "f9": field_8,
      "f10": field_9
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
          tableName: "fields10_Table",
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
    setfield_0(row["f1"] ?? "");
    setfield_1(row["f2"] ?? "");
    setfield_2(row["f3"] ?? "");
    setfield_3(row["f4"] ?? "");
    setfield_4(row["f5"] ?? "");
    setfield_5(row["f6f"] ?? "");
    setfield_6(row["f7"] ?? "");
    setfield_7(row["f8"] ?? "");
    setfield_8(row["f9"] ?? "");
    setfield_9(row["f10"] ?? "");
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
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6 text-center">fields10</h1>
        <form className="flex flex-col gap-4 w-full max-w-2xl" onSubmit={e => e.preventDefault()}>
          
          <TextField
            label="f1"
            value={field_0}
            onChange={setfield_0}
          />
        
          <TextField
            label="f2"
            value={field_1}
            onChange={setfield_1}
          />
        
          <TextField
            label="f3"
            value={field_2}
            onChange={setfield_2}
          />
        
          <TextField
            label="f4"
            value={field_3}
            onChange={setfield_3}
          />
        
          <TextField
            label="f5"
            value={field_4}
            onChange={setfield_4}
          />
        
          <TextField
            label="f6f"
            value={field_5}
            onChange={setfield_5}
          />
        
          <TextField
            label="f7"
            value={field_6}
            onChange={setfield_6}
          />
        
          <TextField
            label="f8"
            value={field_7}
            onChange={setfield_7}
          />
        
          <TextField
            label="f9"
            value={field_8}
            onChange={setfield_8}
          />
        
          <TextField
            label="f10"
            value={field_9}
            onChange={setfield_9}
          />
        
          <div className="flex justify-between items-center mt-4 mb-4 w-full max-w-2xl">
  <div className="flex gap-2">
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
  <input
    type="text"
    placeholder="Search..."
    className="p-2 border rounded w-56"
    value={search}
    onChange={e => setSearch(e.target.value)}
  />
</div>
        </form>
        <hr className="my-6 w-full max-w-2xl border-t-2 border-gray-300" />
        {/* Data Table */}
        <div className="w-full max-w-2xl">
          
          <table className="min-w-full bg-white border border-gray-300 shadow">
            <thead>
              <tr>
                <th className="p-2 border-b"></th>
                <th className="p-2 border-b">f1</th><th className="p-2 border-b">f2</th><th className="p-2 border-b">f3</th><th className="p-2 border-b">f4</th><th className="p-2 border-b">f5</th><th className="p-2 border-b">f6f</th><th className="p-2 border-b">f7</th><th className="p-2 border-b">f8</th><th className="p-2 border-b">f9</th><th className="p-2 border-b">f10</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableData.map((row, idx) => (
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
                  <td className="p-2 border-b">{row["f1"]}</td><td className="p-2 border-b">{row["f2"]}</td><td className="p-2 border-b">{row["f3"]}</td><td className="p-2 border-b">{row["f4"]}</td><td className="p-2 border-b">{row["f5"]}</td><td className="p-2 border-b">{row["f6f"]}</td><td className="p-2 border-b">{row["f7"]}</td><td className="p-2 border-b">{row["f8"]}</td><td className="p-2 border-b">{row["f9"]}</td><td className="p-2 border-b">{row["f10"]}</td>
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
