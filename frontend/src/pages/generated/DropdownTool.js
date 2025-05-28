import React from "react";
import DatePicker from "../../components/DatePicker";
import Dropdown from "../../components/Dropdown";
import NumberInput from "../../components/NumberInput";
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
const [field_10, setfield_10] = React.useState("");
const [field_11, setfield_11] = React.useState("");
const [field_12, setfield_12] = React.useState("");
const [field_13, setfield_13] = React.useState("");
const [field_14, setfield_14] = React.useState("");
const [field_15, setfield_15] = React.useState("");
const [field_16, setfield_16] = React.useState("");
const [field_17, setfield_17] = React.useState("");
const [field_18, setfield_18] = React.useState("");
const [field_19, setfield_19] = React.useState("");
const [field_20, setfield_20] = React.useState("");
const [field_21, setfield_21] = React.useState("");
const [field_22, setfield_22] = React.useState("");
const [field_23, setfield_23] = React.useState("");
const [field_24, setfield_24] = React.useState("");

  
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
      body: JSON.stringify({ tableName: "DropdownTool_Table" })
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
    setfield_10("");
    setfield_11("");
    setfield_12("");
    setfield_13("");
    setfield_14("");
    setfield_15("");
    setfield_16("");
    setfield_17("");
    setfield_18("");
    setfield_19("");
    setfield_20("");
    setfield_21("");
    setfield_22("");
    setfield_23("");
    setfield_24("");
    setEditingIndex(null);
  };

  // Enter (Insert)
  const handleEnter = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: "DropdownTool_Table",
          data: {
            "Select_Date": field_0,
      "Select_shift": field_1,
      "ML_Headcount_Total": field_2,
      "PACE_Headcount": field_3,
      "CBASS_Parts_Built": field_4,
      "MI_headcount_Alcon_only": field_5,
      "PPEP_Headcount": field_6,
      "CBASS_Scrap_": field_7,
      "Alcon_LOA": field_8,
      "Japan_Headcount": field_9,
      "HrsDay": field_10,
      "Alcon_Absense": field_11,
      "Total_PACE_DowntimeMinutes": field_12,
      "OT_Headcount": field_13,
      "Total_PREP_DowntimeMinutes": field_14,
      "WareHouse_headcount": field_15,
      "Mainline_Issue_Downtimemnutes": field_16,
      "MainlinesCOMMENT": field_17,
      "SPB_PREPCOMMENT": field_18,
      "SPB_PACECOMMENT": field_19,
      "PATCOMMENT": field_20,
      "WHSCOMMENT": field_21,
      "JAPANCOMMENT": field_22,
      "CBASSCOMMENT": field_23,
      "EmployeeCOMMENT": field_24
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
          tableName: "DropdownTool_Table",
          id: row.ID,
          data: {
            "Select_Date": field_0,
      "Select_shift": field_1,
      "ML_Headcount_Total": field_2,
      "PACE_Headcount": field_3,
      "CBASS_Parts_Built": field_4,
      "MI_headcount_Alcon_only": field_5,
      "PPEP_Headcount": field_6,
      "CBASS_Scrap_": field_7,
      "Alcon_LOA": field_8,
      "Japan_Headcount": field_9,
      "HrsDay": field_10,
      "Alcon_Absense": field_11,
      "Total_PACE_DowntimeMinutes": field_12,
      "OT_Headcount": field_13,
      "Total_PREP_DowntimeMinutes": field_14,
      "WareHouse_headcount": field_15,
      "Mainline_Issue_Downtimemnutes": field_16,
      "MainlinesCOMMENT": field_17,
      "SPB_PREPCOMMENT": field_18,
      "SPB_PACECOMMENT": field_19,
      "PATCOMMENT": field_20,
      "WHSCOMMENT": field_21,
      "JAPANCOMMENT": field_22,
      "CBASSCOMMENT": field_23,
      "EmployeeCOMMENT": field_24
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
          tableName: "DropdownTool_Table",
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
    setfield_0(row["Select_Date"] ?? "");
    setfield_1(row["Select_shift"] ?? "");
    setfield_2(row["ML_Headcount_Total"] ?? "");
    setfield_3(row["PACE_Headcount"] ?? "");
    setfield_4(row["CBASS_Parts_Built"] ?? "");
    setfield_5(row["MI_headcount_Alcon_only"] ?? "");
    setfield_6(row["PPEP_Headcount"] ?? "");
    setfield_7(row["CBASS_Scrap_"] ?? "");
    setfield_8(row["Alcon_LOA"] ?? "");
    setfield_9(row["Japan_Headcount"] ?? "");
    setfield_10(row["HrsDay"] ?? "");
    setfield_11(row["Alcon_Absense"] ?? "");
    setfield_12(row["Total_PACE_DowntimeMinutes"] ?? "");
    setfield_13(row["OT_Headcount"] ?? "");
    setfield_14(row["Total_PREP_DowntimeMinutes"] ?? "");
    setfield_15(row["WareHouse_headcount"] ?? "");
    setfield_16(row["Mainline_Issue_Downtimemnutes"] ?? "");
    setfield_17(row["MainlinesCOMMENT"] ?? "");
    setfield_18(row["SPB_PREPCOMMENT"] ?? "");
    setfield_19(row["SPB_PACECOMMENT"] ?? "");
    setfield_20(row["PATCOMMENT"] ?? "");
    setfield_21(row["WHSCOMMENT"] ?? "");
    setfield_22(row["JAPANCOMMENT"] ?? "");
    setfield_23(row["CBASSCOMMENT"] ?? "");
    setfield_24(row["EmployeeCOMMENT"] ?? "");
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
        <h1 className="text-2xl font-bold mb-6 text-center">DropdownTool</h1>
        <form className="flex flex-col gap-4 w-full max-w-full" onSubmit={e => e.preventDefault()}>
          
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
          <div key="DatePicker-0-0">
            <DatePicker
              label="Select Date"
              value={field_0}
              onChange={setfield_0}
            />
          </div>
        
          <div key="Dropdown-0-1">
            <Dropdown
              label="Select shift"
              value={field_1}
              onChange={setfield_1}
              options={["Conv A","Conv B"]}
            />
          </div>
        
          <div key="NumberInput-0-2">
            <NumberInput
              label="ML Headcount Total"
              value={field_2}
              onChange={setfield_2}
            />
          </div>
        
          <div key="NumberInput-1-3">
            <NumberInput
              label="PACE Headcount"
              value={field_3}
              onChange={setfield_3}
            />
          </div>
        
          <div key="NumberInput-2-4">
            <NumberInput
              label="CBASS Parts Built"
              value={field_4}
              onChange={setfield_4}
            />
          </div>
        
          <div key="NumberInput-3-5">
            <NumberInput
              label="MI headcount Alcon only"
              value={field_5}
              onChange={setfield_5}
            />
          </div>
        
          <div key="NumberInput-4-6">
            <NumberInput
              label="PPEP Headcount"
              value={field_6}
              onChange={setfield_6}
            />
          </div>
        
          <div key="NumberInput-5-7">
            <NumberInput
              label="CBASS Scrap "
              value={field_7}
              onChange={setfield_7}
            />
          </div>
        
          <div key="NumberInput-6-8">
            <NumberInput
              label="Alcon LOA"
              value={field_8}
              onChange={setfield_8}
            />
          </div>
        
          <div key="NumberInput-7-9">
            <NumberInput
              label="Japan Headcount"
              value={field_9}
              onChange={setfield_9}
            />
          </div>
        
          <div key="NumberInput-8-10">
            <NumberInput
              label="Hrs\Day"
              value={field_10}
              onChange={setfield_10}
            />
          </div>
        
          <div key="NumberInput-9-11">
            <NumberInput
              label="Alcon Absense"
              value={field_11}
              onChange={setfield_11}
            />
          </div>
        
          <div key="NumberInput-10-12">
            <NumberInput
              label="Total PACE Downtime(Minutes)"
              value={field_12}
              onChange={setfield_12}
            />
          </div>
        
          <div key="NumberInput-11-13">
            <NumberInput
              label="OT Headcount"
              value={field_13}
              onChange={setfield_13}
            />
          </div>
        
          <div key="NumberInput-12-14">
            <NumberInput
              label="Total PREP Downtime(Minutes)"
              value={field_14}
              onChange={setfield_14}
            />
          </div>
        
          <div key="NumberInput-13-15">
            <NumberInput
              label="WareHouse headcount"
              value={field_15}
              onChange={setfield_15}
            />
          </div>
        
          <div key="NumberInput-14-16">
            <NumberInput
              label="Mainline Issue Downtime(mnutes)"
              value={field_16}
              onChange={setfield_16}
            />
          </div>
        
          <div key="TextField-0-17">
            <TextField
              label="Mainlines-COMMENT"
              value={field_17}
              onChange={setfield_17}
            />
          </div>
        
          <div key="TextField-1-18">
            <TextField
              label="SPB PREP-COMMENT"
              value={field_18}
              onChange={setfield_18}
            />
          </div>
        
          <div key="TextField-2-19">
            <TextField
              label="SPB PACE-COMMENT"
              value={field_19}
              onChange={setfield_19}
            />
          </div>
        
          <div key="TextField-3-20">
            <TextField
              label="PAT-COMMENT"
              value={field_20}
              onChange={setfield_20}
            />
          </div>
        
          <div key="TextField-4-21">
            <TextField
              label="WHS-COMMENT"
              value={field_21}
              onChange={setfield_21}
            />
          </div>
        
          <div key="TextField-5-22">
            <TextField
              label="JAPAN-COMMENT"
              value={field_22}
              onChange={setfield_22}
            />
          </div>
        
          <div key="TextField-6-23">
            <TextField
              label="CBASS-COMMENT"
              value={field_23}
              onChange={setfield_23}
            />
          </div>
        
          <div key="TextField-7-24">
            <TextField
              label="Employee-COMMENT"
              value={field_24}
              onChange={setfield_24}
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
          <div className="w-full max-w-5xl overflow-x-auto">
            <table className="max-w-full bg-white border border-gray-300 shadow mx-auto" style={{ minWidth: "4560px" }}>
              <thead>
                <tr>
                  <th className="p-2 border-b min-w-[60px]"></th>
                  <th className="p-2 border-b min-w-[120px]">Select Date</th><th className="p-2 border-b min-w-[120px]">Select shift</th><th className="p-2 border-b min-w-[120px]">ML Headcount Total</th><th className="p-2 border-b min-w-[120px]">PACE Headcount</th><th className="p-2 border-b min-w-[120px]">CBASS Parts Built</th><th className="p-2 border-b min-w-[120px]">MI headcount Alcon only</th><th className="p-2 border-b min-w-[120px]">PPEP Headcount</th><th className="p-2 border-b min-w-[120px]">CBASS Scrap </th><th className="p-2 border-b min-w-[120px]">Alcon LOA</th><th className="p-2 border-b min-w-[120px]">Japan Headcount</th><th className="p-2 border-b min-w-[120px]">Hrs\Day</th><th className="p-2 border-b min-w-[120px]">Alcon Absense</th><th className="p-2 border-b min-w-[120px]">Total PACE Downtime(Minutes)</th><th className="p-2 border-b min-w-[120px]">OT Headcount</th><th className="p-2 border-b min-w-[120px]">Total PREP Downtime(Minutes)</th><th className="p-2 border-b min-w-[120px]">WareHouse headcount</th><th className="p-2 border-b min-w-[120px]">Mainline Issue Downtime(mnutes)</th><th className="p-2 border-b min-w-[120px]">Mainlines-COMMENT</th><th className="p-2 border-b min-w-[120px]">SPB PREP-COMMENT</th><th className="p-2 border-b min-w-[120px]">SPB PACE-COMMENT</th><th className="p-2 border-b min-w-[120px]">PAT-COMMENT</th><th className="p-2 border-b min-w-[120px]">WHS-COMMENT</th><th className="p-2 border-b min-w-[120px]">JAPAN-COMMENT</th><th className="p-2 border-b min-w-[120px]">CBASS-COMMENT</th><th className="p-2 border-b min-w-[120px]">Employee-COMMENT</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableData.map((row, idx) => (
                  <tr
                    key={row.ID}
                    className="hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleRowClick(idx)}
                  >
                    <td className="p-2 border-b text-center min-w-[60px]">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.ID)}
                        onChange={e => {
                          e.stopPropagation();
                          handleSelectRow(row.ID);
                        }}
                      />
                    </td>
                    <td className="p-2 border-b min-w-[120px]">{row["Select_Date"] ? new Date(row["Select_Date"]).toLocaleDateString() : ""}</td><td className="p-2 border-b min-w-[120px]">{row["Select_shift"]}</td><td className="p-2 border-b min-w-[120px]">{row["ML_Headcount_Total"]}</td><td className="p-2 border-b min-w-[120px]">{row["PACE_Headcount"]}</td><td className="p-2 border-b min-w-[120px]">{row["CBASS_Parts_Built"]}</td><td className="p-2 border-b min-w-[120px]">{row["MI_headcount_Alcon_only"]}</td><td className="p-2 border-b min-w-[120px]">{row["PPEP_Headcount"]}</td><td className="p-2 border-b min-w-[120px]">{row["CBASS_Scrap_"]}</td><td className="p-2 border-b min-w-[120px]">{row["Alcon_LOA"]}</td><td className="p-2 border-b min-w-[120px]">{row["Japan_Headcount"]}</td><td className="p-2 border-b min-w-[120px]">{row["HrsDay"]}</td><td className="p-2 border-b min-w-[120px]">{row["Alcon_Absense"]}</td><td className="p-2 border-b min-w-[120px]">{row["Total_PACE_DowntimeMinutes"]}</td><td className="p-2 border-b min-w-[120px]">{row["OT_Headcount"]}</td><td className="p-2 border-b min-w-[120px]">{row["Total_PREP_DowntimeMinutes"]}</td><td className="p-2 border-b min-w-[120px]">{row["WareHouse_headcount"]}</td><td className="p-2 border-b min-w-[120px]">{row["Mainline_Issue_Downtimemnutes"]}</td><td className="p-2 border-b min-w-[120px]">{row["MainlinesCOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["SPB_PREPCOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["SPB_PACECOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["PATCOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["WHSCOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["JAPANCOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["CBASSCOMMENT"]}</td><td className="p-2 border-b min-w-[120px]">{row["EmployeeCOMMENT"]}</td>
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
