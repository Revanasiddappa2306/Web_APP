import  { useState} from "react";
import {
  MdTextFields,
  MdArrowDropDownCircle,
  MdCheckBox,
  MdDateRange,
  MdRadioButtonChecked,
  MdAttachFile,
  MdLooksOne ,
} from "react-icons/md";
import { componentsLibrary } from "../componentsLibrary"; // Adjust path if needed


const COMPONENT_ICONS = {
  TextField: <MdTextFields className="inline-block mr-1 text-blue-700" />,
  Dropdown: <MdArrowDropDownCircle className="inline-block mr-1 text-blue-700" />,
  Checkbox: <MdCheckBox className="inline-block mr-1 text-blue-700" />,
  DatePicker: <MdDateRange className="inline-block mr-1 text-blue-700" />,
  RadioButton: <MdRadioButtonChecked className="inline-block mr-1 text-blue-700" />,
  FileUpload: <MdAttachFile className="inline-block mr-1 text-blue-700" />,
  NumberInput: <MdLooksOne className="inline-block mr-1 text-blue-700" />,
};

const COMPONENT_OPTIONS = Object.keys(componentsLibrary);

// Helper to get placeholder and example for each component type
const getFieldPlaceholder = (comp) => {
  switch (comp) {
    case "Dropdown":
      return {
        placeholder: "Enter name and options (e.g. Country [India, USA, UK])",
        example: "Example: Country [India, USA, UK]",
      };
    case "Checkbox":
      return {
        placeholder: "Enter label (e.g. Accept Terms)",
        example: "Example: Accept Terms",
      };
    case "RadioButton":
      return {
        placeholder: "Enter name and options (e.g. Gender [Male, Female])",
        example: "Example: Gender [Male, Female]",
      };
    case "DatePicker":
      return {
        placeholder: "Enter label (e.g. Select Date)",
        example: "Example: Select Date",
      };
    case "FileUpload":
      return {
        placeholder: "Enter label (e.g. Upload Resume)",
        example: "Example: Upload Resume",
      };
    default:
      return {
        placeholder: "Field Name",
        example: "",
      };
  }
};

const RequirementPopup = ({ onClose, onSubmit, user }) => {
  // user: { name, id, email }
  const [department, setDepartment] = useState("");
  const [pageName, setPageName] = useState("");
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [componentDetails, setComponentDetails] = useState({});
  const [justification, setJustification] = useState("");

  // Handle component selection
  const handleComponentChange = (e) => {
    const { value, checked } = e.target;
    let updated = [...selectedComponents];
    if (checked) {
      updated.push(value);
      setComponentDetails((prev) => ({
        ...prev,
        [value]: { quantity: 1, fields: [""] },
      }));
    } else {
      updated = updated.filter((c) => c !== value);
      setComponentDetails((prev) => {
        const copy = { ...prev };
        delete copy[value];
        return copy;
      });
    }
    setSelectedComponents(updated);
  };

  // Handle quantity change
  const handleQuantityChange = (component, qty) => {
    setComponentDetails((prev) => {
      const fields = Array.from(
        { length: Number(qty) },
        (_, i) => prev[component]?.fields[i] || ""
      );
      return {
        ...prev,
        [component]: { quantity: qty, fields },
      };
    });
  };

  // Handle field name change
  const handleFieldNameChange = (component, idx, value) => {
    setComponentDetails((prev) => {
      const fields = [...(prev[component]?.fields || [])];
      fields[idx] = value;
      return {
        ...prev,
        [component]: { ...prev[component], fields },
      };
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare requirements object for DB
    const requirementsObj = {
      pageName,
      components: selectedComponents.map((comp) => ({
        name: comp,
        quantity: componentDetails[comp]?.quantity || 1,
        fields: componentDetails[comp]?.fields || [],
      })),
      justification,
    };

    // Prepare email body with your requested format
    let emailBody = `Hi admin,\nmyself ${user.name} from ${department} department. We have a new requirements as follows:\n\n`;

    emailBody += `Components and Quantities:\n`;
    requirementsObj.components.forEach((c) => {
      emailBody += `- ${c.name}: ${c.quantity}\n`;
    });
    emailBody += `\nComponent Fields:\n`;
    requirementsObj.components.forEach((c) => {
      c.fields.forEach((f, idx) => {
        emailBody += `${c.name} Field${idx + 1}: ${f}\n`;
      });
    });
    emailBody += `\nJustification:\n${justification}\n\nThanks & Regards\n${user.name}`;

    // Compose mailto
    const adminEmail = "revanasiddappa.malkood@alcon.com";
    const subject = encodeURIComponent("New Requirement Submitted");
    const body = encodeURIComponent(emailBody);

    // Save to DB
    if (onSubmit) {
      await onSubmit({
        name: user.name,
        id: user.id,
        email: user.email,
        department,
        requirements: JSON.stringify(requirementsObj),
      });
    }

    // Open email
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded shadow-md relative overflow-y-auto"
        style={{ width: "98vw", maxWidth: "900px", maxHeight: "95vh" }} // Increased width
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-alconBlue text-center">
          Submit Requirement
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex gap-4 mb-2">
            <input
              className="w-1/2 p-2 border rounded bg-gray-100"
              value={user.name}
              disabled
              readOnly
            />
            <input
              className="w-1/2 p-2 border rounded bg-gray-100"
              value={user.id}
              disabled
              readOnly
            />
          </div>
          <div className="mb-2">
            <input
              className="w-full p-2 border rounded bg-gray-100"
              value={user.email}
              disabled
              readOnly
            />
          </div>
          {/* Department */}
          <div className="mb-2">
            <input
              className="w-full p-2 border rounded"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          {/* Page Name */}
          <div className="mb-2">
            <input
              className="w-full p-2 border rounded"
              placeholder="Page Name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              required
            />
          </div>
          {/* Components */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Select Components:</label>
            <div className="flex flex-wrap gap-3">
              {COMPONENT_OPTIONS.map((comp) => (
                <label key={comp} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={comp}
                    checked={selectedComponents.includes(comp)}
                    onChange={handleComponentChange}
                  />
                  {COMPONENT_ICONS[comp] || null}
                  {comp}
                </label>
              ))}
            </div>
          </div>
          {/* For each selected component: quantity and fields */}
          {selectedComponents.map((comp) => {
            const { placeholder, example } = getFieldPlaceholder(comp);
            return (
              <div key={comp} className="border rounded p-3 mb-2 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{comp}</span>
                  <input
                    type="number"
                    min={1}
                    className="w-20 p-1 border rounded"
                    value={componentDetails[comp]?.quantity || 1}
                    onChange={(e) =>
                      handleQuantityChange(comp, e.target.value)
                    }
                    required
                  />
                  <span className="text-sm text-gray-500">Quantity</span>
                </div>
                <div>
                  <label className="block text-sm mb-1">Field Names:</label>
                  {Array.from(
                    { length: Number(componentDetails[comp]?.quantity || 1) }
                  ).map((_, idx) => (
                    <div key={idx} className="mb-2">
                      <input
                        className="w-full p-1 border rounded"
                        placeholder={
                          comp === "TextField"
                            ? `Field Name ${idx + 1}`
                            : placeholder
                        }
                        value={componentDetails[comp]?.fields[idx] || ""}
                        onChange={(e) =>
                          handleFieldNameChange(comp, idx, e.target.value)
                        }
                        required
                      />
                      {example && (
                        <div className="text-xs text-gray-500 pl-1 pt-1">
                          {example}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Justification */}
          <div>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Justify your requirements"
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequirementPopup;