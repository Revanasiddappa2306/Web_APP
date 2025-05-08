import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutPopup from "../components/AboutPopup";
import ContactPopup from "../components/ContactPopup";



const YourPages = () => {
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin-dashboard")}>
            {/* <img src={AlconLogo} alt="Alcon Logo" className="h-10 w-10 rounded-full" /> */}
            <span className="text-2xl font-bold">Alcon</span>
          </div>

          <nav className="flex gap-6 text-lg">
            <button onClick={() => navigate("/admin-dashboard")}  className="hover:text-yellow-300" > Home </button>
            <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
            <button onClick={() => setShowContact(true)} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Your Generated Pages</h1>

        {pages.length === 0 ? (
          <p>No pages found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div
                  key={page}
                  className={`p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${
                    selectedPages.includes(page) ? "border-blue-500" : ""
                  }`}
                  onClick={() => togglePage(page)}
                >
                  {/* Page Preview */}
                  <div className="w-full h-64 bg-gray-200 mb-4 flex justify-center items-center">
                    <iframe  src={`/generated/${page}`} title={page} className="w-4/5 h-4/5 border border-gray-300 rounded" > </iframe>
                  </div>

                  {/* Page Name */}
                  <div className="text-center mb-2">
                    <span
                      onClick={() => navigate(`/generated/${page}`)}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {page}
                    </span>
                  </div>

                  {/* Checkbox to select */}
                  <div className="flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(page)}
                      onChange={() => togglePage(page)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Delete Selected Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDeleteSelected}
                className={`px-6 py-3 rounded-lg text-white ${
                  selectedPages.length > 0
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={selectedPages.length === 0}
              >
                Delete Selected Pages
              </button>
            </div>
          </>
        )}
      </main>
      { /* About and Contact Popups */}
      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default YourPages;
