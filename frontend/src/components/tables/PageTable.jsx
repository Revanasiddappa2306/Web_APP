import React, { useEffect, useState } from "react";

const PageTable = () => {
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pageTable/get-pages");
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error("❌ Error fetching pages:", error);
    }
  };

  const togglePageSelection = (pageID) => {
    setSelectedPages((prev) =>
      prev.includes(pageID)
        ? prev.filter((id) => id !== pageID)
        : [...prev, pageID]
    );
  };

  return (
    <div className="bg-white rounded shadow p-4 w-[45%] ml-[3%]">
      <h2 className="text-center font-semibold text-gray-700 mb-4">Pages</h2>
      <div className="h-64 overflow-y-auto border rounded mb-4">
        <table className="table-auto w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Page ID</th>
              <th className="px-4 py-2">Page Name</th>
              <th className="px-4 py-2">Created By</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.PageID} className="border-t">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page.PageID)}
                    onChange={() => togglePageSelection(page.PageID)}
                  />
                </td>
                <td className="px-4 py-2">{page.PageID}</td>
                <td className="px-4 py-2">{page.PageName}</td>
                <td className="px-4 py-2">{page.CreatedByAdminID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <button
          // onClick={handleAssign}
          disabled={selectedPages.length === 0}
          className={`mt-2 px-6 py-2 text-white rounded ${
            selectedPages.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default PageTable;
