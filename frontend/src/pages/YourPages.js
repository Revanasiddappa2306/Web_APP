// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const YourPages = () => {
//   const [pages, setPages] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPages = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/pages/list-pages");
//         const data = await res.json();
//         setPages(data.pages);
//       } catch (err) {
//         console.error("❌ Error fetching pages:", err);
//       }
//     };

//     fetchPages();
//   }, []);

//   return (
//     <div className="p-6 bg-white min-h-screen text-black relative">
//       {/* Back button */}
//       <button
//         onClick={() => navigate("/dashboard")}
//         className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
//       >
//         Back to Dashboard
//       </button>

//       <h1 className="text-2xl font-bold mb-4">Your Generated Pages</h1>
//       {pages.length === 0 ? (
//         <p>No pages found.</p>
//       ) : (
//         <ul className="space-y-2">
//           {pages.map((page) => (
//             <li
//               key={page}
//               className="cursor-pointer text-blue-600 hover:underline"
//               onClick={() => navigate(`/generated/${page}`)}
//             >
//               {page}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default YourPages;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YourPages = () => {
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pages/list-pages");
      const data = await res.json();
      setPages(data.pages);
    } catch (err) {
      console.error("❌ Error fetching pages:", err);
    }
  };

  const togglePage = (page) => {
    setSelectedPages((prev) =>
      prev.includes(page)
        ? prev.filter((p) => p !== page)
        : [...prev, page]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedPages.length === 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/pages/delete-pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pages: selectedPages }),
      });

      if (res.ok) {
        setPages((prev) => prev.filter((p) => !selectedPages.includes(p)));
        setSelectedPages([]);
      } else {
        console.error("❌ Failed to delete pages");
      }
    } catch (err) {
      console.error("❌ Error deleting pages:", err);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black relative">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
      >
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">Your Generated Pages</h1>

      {pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
        <>
          <button
            onClick={handleDeleteSelected}
            className={`mb-4 px-4 py-2 rounded ${
              selectedPages.length > 0
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={selectedPages.length === 0}
          >
            Delete Selected
          </button>

          <ul className="space-y-2">
            {pages.map((page) => (
              <li key={page} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedPages.includes(page)}
                  onChange={() => togglePage(page)}
                />
                <span
                  onClick={() => navigate(`/generated/${page}`)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {page}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default YourPages;

