import React from "react";

const PageCreationGuidePopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div  className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
      style={{ width: "70vw", maxHeight: "80vh" }}>
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
        onClick={onClose}
        aria-label="Close"
        style={{ lineHeight: 1 }}
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-4 text-center text-alconBlue">Page Creation Guide</h2>
      <ol className="list-decimal pl-4 space-y-2 text-left">
        <li>
          In this component selection page, select components you needed and specify quantity you want. <br />
        </li>
        <li>
          Click the <span className="font-semibold">Next Configure Fields</span> button. This will navigate to the configuration page.
        </li>
        <li>
          Give a name to the page and to each field you have selected. <br />
          <span className="font-semibold">
            <ul className="list-disc pl-6">
              <li>Names should start with a letter (not with a number or special character).</li>
            </ul>
          </span>
        </li>
        <li>
          After giving names (configuring fields), click the <span className="font-semibold">Submit Config</span> button. 
        </li>
        <li>
          Below the page a preview of the page will be shown. You can drag and drop the fields to rearrange them. <br />
          <span className="font-semibold">
            Note: The preview is not editable. It is just a preview of the page.  
            </span>  
        </li>
        <li>
          Click the <span className="font-semibold">Generate Page</span> button to generate the page. <br />
        </li>
        <li>
        A new page will be created and a popup will appear asking "Do you want to create a table for this page?" If yes, a table is created in the backend and stored in the database. Then the new page will be loaded.
        </li>
      </ol>
      <div className="mt-4 font-bold text-red-700">
        If it says 'Page not found', wait for sometime because the page is being compiled.
      </div>
    </div>
  </div>
);

export default PageCreationGuidePopup;