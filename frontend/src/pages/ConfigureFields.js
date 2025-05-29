import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AboutPopup from "../components/popups/AboutPopup";
import ContactPopup from "../components/popups/ContactPopup";
import PreviewPage from "../pages/PreviewPage";

const ConfigureFields = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const selectedComponents = location.state?.selectedComponents || {};

  // Build initial field order
  const initialFieldOrder = [];
  Object.entries(selectedComponents).forEach(([key, value]) => {
    const quantity = value.quantity || 0;
    for (let i = 0; i < quantity; i++) {
      initialFieldOrder.push(`${key}-${i}`);
    }
  });
  const [fieldOrder] = useState(initialFieldOrder);
  const [fieldConfigs, setFieldConfigs] = useState({});
  const [customPageName, setCustomPageName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewFieldOrder, setPreviewFieldOrder] = useState(fieldOrder); // or initial order

  const admin = JSON.parse(localStorage.getItem("admin")); // <-- Add this line

  const handleChange = (key, field, value) => {
    // Extract type from key (e.g., "Number-0" => "Number")
    const type = key.split("-")[0];
    setFieldConfigs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        type, // Always set the type
        [field]: value,
      },
    }));
  };

  const handlePreview = () => {
    // First, check page name
    if (!customPageName.trim()) {
      alert("Please enter a custom page name.");
      return;
    }
    // Then, check all fields are configured
    const allConfigured = fieldOrder.every(
      (key) => fieldConfigs[key] && fieldConfigs[key].label && fieldConfigs[key].label.trim() !== ""
    );
    if (!allConfigured) {
      alert("Please configure all fields");
      return;
    }
    setPreviewFieldOrder(fieldOrder);
    setShowPreview(true);
  };

  const handleFinish = async (finalOrder) => {
    const orderedFieldConfigs = {};
    finalOrder.forEach((key) => {
      orderedFieldConfigs[key] = fieldConfigs[key];
    });

    // Check if all fields are configured (label is required for each field)
    const allConfigured = finalOrder.every(
      (key) => fieldConfigs[key] && fieldConfigs[key].label && fieldConfigs[key].label.trim() !== ""
    );
    if (!allConfigured) {
      alert("Please configure all fields");
      return;
    }

    if (!customPageName.trim()) {
      alert("Please enter a custom page name.");
      return;
    }
    const cleanPageName = customPageName.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const payload = {
      pageName: cleanPageName,
      fieldConfigs: orderedFieldConfigs,
    };

    try {
      const response = await fetch("http://localhost:5000/api/pages/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert("✅ Page generated successfully!");

        const saveDetails = await fetch("http://localhost:5000/api/tables/save-page-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PageName: customPageName,
            StoragePath: `frontend\\src\\pages\\generated\\${result.fileName}`,
            CreatedByAdminID: admin?.id, // <-- Use admin id from localStorage
          }),
        });

        const saveResult = await saveDetails.json();

        if (!saveDetails.ok) {
          alert("⚠️ Page generated, but failed to save page info in DB.");
          console.error("DB Save Error:", saveResult.message);
          return;
        }

        const confirmTable = window.confirm("🎉 Do you want to create a data table for this page now?");
        if (confirmTable) {
          const createTableResponse = await fetch("http://localhost:5000/api/tables/create-data-table", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pageName: customPageName,
              pageId: saveResult.PageID,
              fieldConfigs: orderedFieldConfigs,
            }),
          });

          const tableResult = await createTableResponse.json();

          if (createTableResponse.ok) {
            alert("✅ Data table created successfully!");
            setIsCompiling(true);
            setTimeout(() => {
              navigate(`/generated/${result.fileName.replace(".js", "")}`);
              setIsCompiling(false);
            }, 2500); // 2.5 seconds, adjust as needed
          } else {
            alert("⚠️ Failed to create data table.");
            console.error("Table Creation Error:", tableResult.message);
          }
        }

        navigate(`/generated/${result.fileName.replace(".js", "")}`);
      } else {
        alert("❌ Failed to generate the page.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error occurred while generating and saving the page.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-3xl font-bold cursor-pointer"
            onClick={() => navigate("/admin-dashboard")}
          >
            Alcon
          </h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
            <button onClick={() => navigate("/admin-dashboard")} className="hover:text-yellow-300">Home</button>
            <button onClick={() => navigate("/your-pages")} className="hover:text-yellow-300">Pages</button>
            <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
            <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Configure Fields</h1>

        {/* Page name input */}
        <input
          type="text"
          placeholder="Enter custom page name"
          className="text-black w-full p-3 rounded mb-6 border"
          value={customPageName}
          onChange={(e) => setCustomPageName(e.target.value)}
        />

        {/* Render field configs */}
        {Object.entries(selectedComponents).map(([key, value]) => {
        const quantity = value.quantity || 0;
        return Array.from({ length: quantity }, (_, index) => (
          <div key={`${key}-${index}`} className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {key} {quantity > 1 ? `#${index + 1}` : ""}
            </h2>

            {/* Label input */}
            <input
              type="text"
              placeholder="Field Label"
              className="text-black w-full p-2 rounded mb-3 border"
              onChange={(e) =>
                handleChange(`${key}-${index}`, "label", e.target.value)
              }
            />

            {/* Dropdown options */}
            {key === "Dropdown" && (
              <input
                type="text"
                placeholder="Comma separated options (e.g. One,Two,Three)"
                className="text-black w-full p-2 rounded mb-3 border"
                onChange={(e) =>
                  handleChange(
                    `${key}-${index}`,
                    "options",
                    e.target.value.split(",").map((opt) => opt.trim())
                  )
                }
              />
            )}

            {/* Checkbox condition */}
            {key === "Checkbox" && (
              <input
                type="text"
                placeholder="Checkbox condition (e.g. must be ticked)"
                className="text-black w-full p-2 rounded mb-3 border"
                onChange={(e) =>
                  handleChange(`${key}-${index}`, "condition", e.target.value)
                }
              />
            )}

            {/* Number-specific attributes */}
            {key === "Number" && (
              <>
                <input
                  type="number"
                  placeholder="Min value (optional)"
                  className="text-black w-full p-2 rounded mb-3 border"
                  onChange={(e) =>
                    handleChange(`${key}-${index}`, "min", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Max value (optional)"
                  className="text-black w-full p-2 rounded mb-3 border"
                  onChange={(e) =>
                    handleChange(`${key}-${index}`, "max", e.target.value)
                  }
                />
              </>
            )}

            {/* Date-specific attributes */}
            {key === "Date" && (
              <>
                <input
                  type="date"
                  placeholder="Default Date (optional)"
                  className="text-black w-full p-2 rounded mb-3 border"
                  onChange={(e) =>
                    handleChange(`${key}-${index}`, "defaultDate", e.target.value)
                  }
                />
              </>
            )}

            {/* Primary Key Checkbox */}
            <input
              type="checkbox"
              className="mr-2"
              checked={!!fieldConfigs[`${key}-${index}`]?.isPrimaryKey}
              onChange={e =>
                handleChange(`${key}-${index}`, "isPrimaryKey", e.target.checked)
              }
            />
            <label className="mr-4">Is Primary Key?</label>
          </div>
        ));
      })}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!showPreview ? (
            <button
              onClick={handlePreview}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded text-sm"
            >
              Submit Config
            </button>
          ) : (
            <PreviewPage
              fieldConfigs={fieldConfigs}
              fieldOrder={previewFieldOrder}
              setFieldOrder={setPreviewFieldOrder}
              onGenerate={handleFinish}
              customPageName={customPageName}
            />
          )}
        </div>
      </main>

      {/* Modal */}
      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}

      {/* Compiling Overlay */}
      {isCompiling && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <div className="text-lg font-semibold text-blue-700">Compiling your page...</div>
            <div className="text-gray-500 mt-2 text-sm">This may take a few seconds.</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ConfigureFields;
