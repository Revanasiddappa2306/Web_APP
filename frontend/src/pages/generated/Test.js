import React from "react";
  
  const GeneratedForm = () => {
    const [field_0, setfield_0] = React.useState("");

  
    const handleSubmit = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tables/insert-into-table", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tableName: "Test_Table",
            data: {
              "name": field_0
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
        <h1 className="text-2xl font-bold mb-6">Test</h1>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          
          <label>name</label>
          <input type="text" className="p-2 border rounded mb-2" value={field_0} onChange={(e) => setfield_0(e.target.value)} />
        
  
          <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">
            Enter
          </button>
        </form>
      </div>
    );
  };
  
  export default GeneratedForm;
  