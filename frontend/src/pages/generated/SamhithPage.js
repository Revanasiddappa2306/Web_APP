import React from "react";
  
  const GeneratedForm = () => {
    const [field_0, setfield_0] = React.useState("");
const [field_1, setfield_1] = React.useState("");
const [field_2, setfield_2] = React.useState("");

  
    const handleSubmit = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/insert-into-table", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tableName: "SamhithPage_Table",
            data: {
              "Name": field_0,
      "Dept": field_1,
      "Shift": field_2
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
        <h1 className="text-2xl font-bold mb-6">SamhithPage</h1>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          
          <label>Name</label>
          <input type="text" className="p-2 border rounded mb-2" value={field_0} onChange={(e) => setfield_0(e.target.value)} />
        
          <label>Dept</label>
          <input type="text" className="p-2 border rounded mb-2" value={field_1} onChange={(e) => setfield_1(e.target.value)} />
        
          <label>Shift</label>
          <select className="p-2 border rounded mb-2" value={field_2} onChange={(e) => setfield_2(e.target.value)}>
            <option value="">Select</option>
            <option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
          </select>
        
  
          <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">
            Enter
          </button>
        </form>
      </div>
    );
  };
  
  export default GeneratedForm;
  