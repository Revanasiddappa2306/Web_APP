import React from "react";

const GeneratedForm = () => {
  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Generated Form</h1>
      <form className="flex flex-col gap-4">
        
        <label>Company</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

        <label>Department</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

          <label>Shifts</label>
          <select className="p-2 border rounded mb-2">
            <option value="Morning">Morning</option>
<option value="Afternoon">Afternoon</option>
<option value="Evening">Evening</option>
          </select>
        

          <label className="inline-flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            Terms (Agree terms and condition)
          </label>
        

          <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
            Submit
          </button>
        
      </form>
    </div>
  );
};

export default GeneratedForm;
