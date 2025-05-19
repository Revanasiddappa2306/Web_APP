import React from "react";
import TextField from "../../components/TextField";
import Dropdown from "../../components/Dropdown";
import NumberInput from "../../components/NumberInput";
import DatePicker from "../../components/DatePicker";

const GeneratedForm = () => {
  const [field_0, setfield_0] = React.useState("");
const [field_1, setfield_1] = React.useState("");
const [field_2, setfield_2] = React.useState("");
const [field_3, setfield_3] = React.useState("");


  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tableName: "SidduNewPage_Table",
          data: {
            "Name": field_0,
      "Shift": field_1,
      "Age": field_2,
      "Date": field_3
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
        <h1 className="text-2xl font-bold mb-6 text-center">SidduNewPage</h1>
        <form className="flex flex-col gap-4 w-full max-w-2xl" onSubmit={e => e.preventDefault()}>
          
          <TextField
            label="Name"
            value={field_0}
            onChange={setfield_0}
          />
        
          <Dropdown
            label="Shift"
            value={field_1}
            onChange={setfield_1}
            options={["Morning","Afternoon","Night"]}
          />
        
          <NumberInput
            label="Age"
            value={field_2}
            onChange={setfield_2}
          />
        
          <DatePicker
            label="Date"
            value={field_3}
            onChange={setfield_3}
          />
        
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
