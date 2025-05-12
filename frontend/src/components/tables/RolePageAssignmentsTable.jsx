import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RolePageAssignmentsTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rolePage/role-page-assignments");
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error("❌ Error fetching assignments:", err);
    }
  };

  const toggleSelection = (assignment) => {
    const key = `${assignment.PageID}-${assignment.RoleID}`;
    setSelectedAssignments((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const handleRemoveSelected = async () => {
    const confirmDelete = window.confirm(`Remove ${selectedAssignments.length} assignment(s)?`);
    if (!confirmDelete) return;

    try {
      for (const key of selectedAssignments) {
        const [pageID, roleID] = key.split("-");
        await fetch(`http://localhost:5000/api/rolePage/role-page-assignments/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ PageID: pageID, RoleID: roleID }),
        });
      }

      toast.success("Selected assignments removed successfully");
      setAssignments((prev) =>
        prev.filter(
          (item) => !selectedAssignments.includes(`${item.PageID}-${item.RoleID}`)
        )
      );
      setSelectedAssignments([]);
    } catch (err) {
      console.error("❌ Error deleting assignments:", err);
      toast.error("Error removing assignments");
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 w-[40%] mr-[5%]">
      <h2 className="text-center font-semibold text-gray-700 mb-4">
        Role-Page Assignments
      </h2>
      <div className="h-64 overflow-y-auto border rounded mb-4">
        <table className="table-auto w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Page ID</th>
              <th className="px-4 py-2">Role ID</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item, index) => {
              const key = `${item.PageID}-${item.RoleID}`;
              return (
                <tr key={key} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedAssignments.includes(key)}
                      onChange={() => toggleSelection(item)}
                    />
                  </td>
                  <td className="px-4 py-2">{item.PageID}</td>
                  <td className="px-4 py-2">{item.RoleID}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleRemoveSelected}
          disabled={selectedAssignments.length === 0}
          className={`px-6 py-2 text-white rounded ${
            selectedAssignments.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default RolePageAssignmentsTable;
