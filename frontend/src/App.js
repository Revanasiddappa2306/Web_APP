import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserRegister from "./pages/UserRegister";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Import Dashboard
import UserDashboard from "./pages/UserDashboard"; // ✅ Import Dashboard
import ComponentSelector from "./pages/ComponentSelector";
import ConfigureFields from "./pages/ConfigureFields";
import YourPages from "./pages/YourPages";
import Home from "./pages/Home";
import DynamicGeneratedPageLoader from "./components/DynamicGeneratedPageLoader";






export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/user-dashboard" element={<UserDashboard />} />

        <Route path="/component-selector" element={<ComponentSelector />} />
        <Route path="/configure-fields" element={<ConfigureFields />} />
        <Route path="/your-pages" element={<YourPages />} />
        <Route path="/generated/:pageName" element={<DynamicGeneratedPageLoader />} />
        
      </Routes>
    </Router>
  );
}
