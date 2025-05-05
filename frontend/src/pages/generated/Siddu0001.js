import React from "react";

const GeneratedForm = () => {
  return (
    <div className="p-6 bg-white text-black min-h-screen">
     <h1 className="text-2xl font-bold mb-6">Siddu0001</h1>
      <form className="flex flex-col gap-4">
        
        <label>Name</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

        <label>Age</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

          <label>Shift</label>
          <select className="p-2 border rounded mb-2">
            <option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
          </select>
        

        <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded">
          Enter
        </button>
      </form>
    </div>
  );
};

export default GeneratedForm;
