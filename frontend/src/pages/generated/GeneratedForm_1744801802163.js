import React from "react";

const GeneratedForm = () => {
  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Generated Form</h1>
      <form className="flex flex-col gap-4">
        
        <label>Employee_name</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

        <label>Department</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

        <label>ID</label>
        <input type="number" className="p-2 border rounded mb-2" />
      

          <label>Shift</label>
          <select className="p-2 border rounded mb-2">
            <option value="Shift A">Shift A</option>
<option value="Shift B">Shift B</option>
<option value="Shift C">Shift C</option>
          </select>
        

          <label className="inline-flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            Terms and Conditions (Agree terms and conditions)
          </label>
        

          <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
            submit
          </button>
        
      </form>
    </div>
  );
};

export default GeneratedForm;
