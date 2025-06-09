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
      body: JSON.stringify({ tableName: "CONV_Pass_Down_Table" })
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
          tableName: "CONV_Pass_Down_Table",
          data: {
            "Select_Date": field_0,
      "Select_Shift": field_1,
      "ML_headcount_Total": field_2,
      "PACE_Headcount": field_3,
      "CBASS_PArts_Built": field_4,
      "ML_Headcount_Alcon_only": field_5,
      "PREP_Headcount": field_6,
      "CBASS_Scrap": field_7,
      "ALCON_LOA": field_8,
      "Japan_Headcount": field_9,
      "HrsDay": field_10,
      "Alcon_Absence": field_11,
      "Total_PACE_DowntimeMinutes": field_12,
      "OT_Headcount": field_13,
      "Total_PREP_DowntimeMinutes": field_14,
      "WareHouse_Headcount": field_15,
      "Mainline_Issue_DowntimeMinutes": field_16,
      "MAINLINESCOMMENT": field_17,
      "SPB_PREPComment": field_18,
      "SPB_PACEComment": field_19,
      "PATcomment": field_20,
      "WHSComment": field_21,
      "JapanComment": field_22,
      "CBASSComment": field_23,
      "EmployeeComment": field_24
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
          tableName: "CONV_Pass_Down_Table",
          id: row.ID,
          data: {
            "Select_Date": field_0,
      "Select_Shift": field_1,
      "ML_headcount_Total": field_2,
      "PACE_Headcount": field_3,
      "CBASS_PArts_Built": field_4,
      "ML_Headcount_Alcon_only": field_5,
      "PREP_Headcount": field_6,
      "CBASS_Scrap": field_7,
      "ALCON_LOA": field_8,
      "Japan_Headcount": field_9,
      "HrsDay": field_10,
      "Alcon_Absence": field_11,
      "Total_PACE_DowntimeMinutes": field_12,
      "OT_Headcount": field_13,
      "Total_PREP_DowntimeMinutes": field_14,
      "WareHouse_Headcount": field_15,
      "Mainline_Issue_DowntimeMinutes": field_16,
      "MAINLINESCOMMENT": field_17,
      "SPB_PREPComment": field_18,
      "SPB_PACEComment": field_19,
      "PATcomment": field_20,
      "WHSComment": field_21,
      "JapanComment": field_22,
      "CBASSComment": field_23,
      "EmployeeComment": field_24
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
          tableName: "CONV_Pass_Down_Table",
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
    setfield_1(row["Select_Shift"] ?? "");
    setfield_2(row["ML_headcount_Total"] ?? "");
    setfield_3(row["PACE_Headcount"] ?? "");
    setfield_4(row["CBASS_PArts_Built"] ?? "");
    setfield_5(row["ML_Headcount_Alcon_only"] ?? "");
    setfield_6(row["PREP_Headcount"] ?? "");
    setfield_7(row["CBASS_Scrap"] ?? "");
    setfield_8(row["ALCON_LOA"] ?? "");
    setfield_9(row["Japan_Headcount"] ?? "");
    setfield_10(row["HrsDay"] ?? "");
    setfield_11(row["Alcon_Absence"] ?? "");
    setfield_12(row["Total_PACE_DowntimeMinutes"] ?? "");
    setfield_13(row["OT_Headcount"] ?? "");
    setfield_14(row["Total_PREP_DowntimeMinutes"] ?? "");
    setfield_15(row["WareHouse_Headcount"] ?? "");
    setfield_16(row["Mainline_Issue_DowntimeMinutes"] ?? "");
    setfield_17(row["MAINLINESCOMMENT"] ?? "");
    setfield_18(row["SPB_PREPComment"] ?? "");
    setfield_19(row["SPB_PACEComment"] ?? "");
    setfield_20(row["PATcomment"] ?? "");
    setfield_21(row["WHSComment"] ?? "");
    setfield_22(row["JapanComment"] ?? "");
    setfield_23(row["CBASSComment"] ?? "");
    setfield_24(row["EmployeeComment"] ?? "");
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
        <h1 className="text-2xl font-bold mb-6 text-center">CONV Pass Down</h1>
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
              label="Select Shift"
              value={field_1}
              onChange={setfield_1}
              options={["CONV A","CONV B"]}
            />
          </div>
        
          <div key="NumberInput-0-2">
            <NumberInput
              label="ML headcount Total"
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
              label="CBASS PArts Built"
              value={field_4}
              onChange={setfield_4}
            />
          </div>
        
          <div key="NumberInput-3-5">
            <NumberInput
              label="ML Headcount Alcon only"
              value={field_5}
              onChange={setfield_5}
            />
          </div>
        
          <div key="NumberInput-4-6">
            <NumberInput
              label="PREP Headcount"
              value={field_6}
              onChange={setfield_6}
            />
          </div>
        
          <div key="NumberInput-5-7">
            <NumberInput
              label="CBASS Scrap"
              value={field_7}
              onChange={setfield_7}
            />
          </div>
        
          <div key="NumberInput-6-8">
            <NumberInput
              label="ALCON LOA"
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
              label="Alcon Absence"
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
              label="WareHouse Headcount"
              value={field_15}
              onChange={setfield_15}
            />
          </div>
        
          <div key="NumberInput-14-16">
            <NumberInput
              label="Mainline Issue Downtime(Minutes)"
              value={field_16}
              onChange={setfield_16}
            />
          </div>
        
          <div key="TextField-0-17">
            <TextField
              label="MAINLINES-COMMENT"
              value={field_17}
              onChange={setfield_17}
            />
          </div>
        
          <div key="TextField-1-18">
            <TextField
              label="SPB PREP-Comment"
              value={field_18}
              onChange={setfield_18}
            />
          </div>
        
          <div key="TextField-2-19">
            <TextField
              label="SPB PACE-Comment"
              value={field_19}
              onChange={setfield_19}
            />
          </div>
        
          <div key="TextField-3-20">
            <TextField
              label="PAT-comment"
              value={field_20}
              onChange={setfield_20}
            />
          </div>
        
          <div key="TextField-4-21">
            <TextField
              label="WHS-Comment"
              value={field_21}
              onChange={setfield_21}
            />
          </div>
        
          <div key="TextField-5-22">
            <TextField
              label="Japan-Comment"
              value={field_22}
              onChange={setfield_22}
            />
          </div>
        
          <div key="TextField-6-23">
            <TextField
              label="CBASS-Comment"
              value={field_23}
              onChange={setfield_23}
            />
          </div>
        
          <div key="TextField-7-24">
            <TextField
              label="Employee-Comment"
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
          <div className="w-full overflow-x-auto">
            <table className="table-auto bg-white border border-gray-300 shadow mx-auto">
              <thead>
                <tr>
                  <th className="p-2 border-b border-r min-w-[60px]"></th>
                  <th className="p-2 border-b border-r min-w-[120px] w-[120px]">Select Date</th><th className="p-2 border-b border-r min-w-[100px] w-[100px]">Select Shift</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">ML headcount Total</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">PACE Headcount</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">CBASS PArts Built</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">ML Headcount Alcon only</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">PREP Headcount</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">CBASS Scrap</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">ALCON LOA</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">Japan Headcount</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">Hrs\Day</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">Alcon Absence</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">Total PACE Downtime(Minutes)</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">OT Headcount</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">Total PREP Downtime(Minutes)</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">WareHouse Headcount</th><th className="p-2 border-b border-r min-w-[80px] w-[80px]">Mainline Issue Downtime(Minutes)</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">MAINLINES-COMMENT</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">SPB PREP-Comment</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">SPB PACE-Comment</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">PAT-comment</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">WHS-Comment</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">Japan-Comment</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">CBASS-Comment</th><th className="p-2 border-b border-r min-w-[160px] w-[160px]">Employee-Comment</th>
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
                    <td className="p-2 border-b border-r min-w-[120px] w-[120px]">{row["Select_Date"] ? new Date(row["Select_Date"]).toLocaleDateString() : ""}</td><td className="p-2 border-b border-r min-w-[100px] w-[100px]">{row["Select_Shift"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["ML_headcount_Total"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["PACE_Headcount"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["CBASS_PArts_Built"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["ML_Headcount_Alcon_only"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["PREP_Headcount"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["CBASS_Scrap"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["ALCON_LOA"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["Japan_Headcount"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["HrsDay"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["Alcon_Absence"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["Total_PACE_DowntimeMinutes"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["OT_Headcount"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["Total_PREP_DowntimeMinutes"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["WareHouse_Headcount"]}</td><td className="p-2 border-b border-r min-w-[80px] w-[80px]">{row["Mainline_Issue_DowntimeMinutes"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["MAINLINESCOMMENT"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["SPB_PREPComment"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["SPB_PACEComment"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["PATcomment"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["WHSComment"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["JapanComment"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["CBASSComment"]}</td><td className="p-2 border-b border-r min-w-[160px] w-[160px]">{row["EmployeeComment"]}</td>
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
