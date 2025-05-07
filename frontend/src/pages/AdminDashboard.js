import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleYourPagesClick = () => {
    navigate("/your-pages");
  };

  const handleCreatePage = () => {
    navigate("/component-selector");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully!", { autoClose: 1500 });
    setTimeout(() => {
      navigate("/home");
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-alconBlue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Alcon</h1>
          <nav className="flex items-center gap-8 text-lg font-medium">
  {/* Actions Dropdown */}
  <div className="relative group">
    <button className="hover:text-yellow-300">Actions</button>
    <div className="absolute top-full left-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform scale-95 group-hover:scale-100 transition-all duration-200 z-10">
      <button
        onClick={handleCreatePage}
        className="px-4 py-2 hover:bg-gray-100 text-left w-full"
      >
        Create Page
      </button>
      <button
        onClick={handleYourPagesClick}
        className="px-4 py-2 hover:bg-gray-100 text-left w-full"
      >
        Pages Created
      </button>
    </div>
  </div>

  {/* Static Links */}
  <button className="hover:text-yellow-300">About</button>
  <button className="hover:text-yellow-300">Contact</button>
  <button
    onClick={handleLogout}
    className="hover:text-yellow-300"
  >
    Logout
  </button>
</nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Hello Admin, welcome back...!
        </h2>
        <h3 className="text-lg font-medium text-gray-600 mt-4">
          Select "Create Page" to begin new page creation or see your pages
        </h3>
      </main>

      {/* Footer */}
      <footer className="bg-alconBlue text-white text-center p-4 mt-auto shadow-inner">
        <p>&copy; {new Date().getFullYear()} Alcon. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
