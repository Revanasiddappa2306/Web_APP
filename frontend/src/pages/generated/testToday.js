import React from "react";
import TextField from "../../components/TextField";
import { useState } from "react";
import AboutPopup from "../../components/popups/AboutPopup";
import ContactPopup from "../../components/popups/ContactPopup";
import { useNavigate } from "react-router-dom";

const GeneratedForm = () => {
  const [field_0, setfield_0] = React.useState("");
const [field_1, setfield_1] = React.useState("");

  
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
      body: JSON.stringify({ tableName: "testToday_Table" })
    })
      .then(res => res.json())
      .then(data => setTableData(data.rows || []));
  }, []);

  // Helper: clear form fields
  const clearFields = () => {
    setfield_0("");
    setfield_1("");
    setEditingIndex(null);
  };

  // Enter (Insert)
  const handleEnter = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: "testToday_Table",
          data: {
            "Name": field_0,
      "Department": field_1
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
          tableName: "testToday_Table",
          id: row.ID,
          data: {
            "Name": field_0,
      "Department": field_1
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
          tableName: "testToday_Table",
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
    setfield_0(row["Name"] ?? "");
    setfield_1(row["Department"] ?? "");
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
        <h1 className="text-2xl font-bold mb-6 text-center">testToday</h1>
        <form className="flex flex-col gap-4 w-full max-w-full" onSubmit={e => e.preventDefault()}>
          
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
          <div key="TextField-0-0">
            <TextField
              label="Name"
              value={field_0}
              onChange={setfield_0}
            />
          </div>
        
          <div key="TextField-1-1">
            <TextField
              label="Department"
              value={field_1}
              onChange={setfield_1}
            />
          </div>
        
      </div>
    
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
                  <th className="p-2 border-b border-r min-w-[160px] w-[160px]">Name</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">Department</th>
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
                    <td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["Name"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["Department"]}</td>
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
