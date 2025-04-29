import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button1"; 


const ConfigureFields = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedComponents = location.state?.selectedComponents || {};
  const [fieldConfigs, setFieldConfigs] = useState({});
  
  const handleChange = (key, field, value) => {
    setFieldConfigs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleYourPagesClick = () => {
    navigate("/your-pages");
  };

  const handleFinish = async () => {
    console.log("Final Field Configurations:", fieldConfigs);

    
  
    try {
      const response = await fetch("http://localhost:5000/api/pages/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldConfigs ),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("✅ Page generated successfully!");
        console.log("Generated Page Info:", result);
        navigate(`/generated/${result.fileName.replace(".js", "")}`);
  
        // Optional: navigate to the generated page if you have its route
        // navigate(`/generated/${result.pageName}`);
      } else {
        console.error("❌ Page generation failed.");
        alert("Failed to generate the page.");
      }
    } catch (error) {
      console.error("❌ Error sending config:", error);
      alert("Error occurred while generating page.");
    }
  };
  
  return (
    <div className="p-6 text-white bg-cyan-300 min-h-screen">
      
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Configure Fields</h1>
        <>
        <Button text="Your Pages" onClick={handleYourPagesClick} className="bg-green-500" />
        <Button text="Back to Dashboard" onClick={() => navigate("/dashboard")} className="bg-yellow-500" />
        </>
        
      </div>
      
      {/* <input
        type="text"
        placeholder="Enter custom page name"
        className="text-black w-full p-2 rounded mb-4"
        value={pageName}
        onChange={(e) => setPageName(e.target.value.trim())} /> */}


      {Object.entries(selectedComponents).map(([key, value]) => {
        const quantity = value.quantity || 0;

        return Array.from({ length: quantity }, (_, index) => (
          <div key={`${key}-${index}`} className="bg-cyan-400 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">
              {key} {quantity > 1 ? `#${index + 1}` : ""}
            </h2>

            {/* Field label */}
            <input
              type="text"
              placeholder="Field Label"
              className="text-black w-full p-2 rounded mb-2"
              onChange={(e) =>
                handleChange(`${key}-${index}`, "label", e.target.value)
              }
            />

            {/* Dropdown Options (if Dropdown) */}
            {key === "Dropdown" && (
              <input
                type="text"
                placeholder="Comma separated options (e.g. One,Two,Three)"
                className="text-black w-full p-2 rounded mb-2"
                onChange={(e) =>
                  handleChange(
                    `${key}-${index}`,
                    "options",
                    e.target.value.split(",").map((opt) => opt.trim())
                  )
                }
              />
            )}

            {/* Checkbox condition (if Checkbox) */}
            {key === "Checkbox" && (
              <input
                type="text"
                placeholder="Checkbox condition (e.g. must be ticked)"
                className="text-black w-full p-2 rounded mb-2"
                onChange={(e) =>
                  handleChange(
                    `${key}-${index}`,
                    "condition",
                    e.target.value
                  )
                }
              />
            )}
          </div>
           
        ));
      })}

      <button
        onClick={handleFinish}
        className="bg-green-500 py-2 px-6 rounded mt-4 text-sm"
      >
        Submit Config
      </button>

      <button onClick={() => navigate("/component-selector")} className="bg-yellow-500 py-2 px-6 rounded mt-4 text-sm ml-4"> Back to Component Selector</button>
    </div>

  );
};

export default ConfigureFields;







