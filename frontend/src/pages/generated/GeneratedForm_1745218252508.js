import React from "react";

const GeneratedForm = () => {
  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Generated Form</h1>
      <form className="flex flex-col gap-4">
        
        <label>name</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

        <label>dep</label>
        <input type="text" className="p-2 border rounded mb-2" />
      

          <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
            sub
          </button>
        
      </form>
    </div>
  );
};

export default GeneratedForm;
