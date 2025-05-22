import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Import Dashboard
import UserDashboard from "./pages/UserDashboard"; // ✅ Import Dashboard
import ComponentSelector from "./pages/ComponentSelector";
import ConfigureFields from "./pages/ConfigureFields";
import YourPages from "./pages/YourPages";
import Home from "./pages/Home";
import DynamicGeneratedPageLoader from "./components/DynamicGeneratedPageLoader";
import RequestsPage from "./pages/RequestsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/component-selector" element={<ComponentSelector />} />
        <Route path="/configure-fields" element={<ConfigureFields />} />
        <Route path="/your-pages" element={<YourPages />} />
        <Route path="/generated/:pageName" element={<DynamicGeneratedPageLoader />}/>
        <Route path="/requests" element={<RequestsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
