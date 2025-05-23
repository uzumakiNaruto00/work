import { NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-900" : ""}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/spareparts"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-900" : ""}`
          }
        >
          Spare Parts
        </NavLink>
        <NavLink
          to="/stockin"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-900" : ""}`
          }
        >
          Stock In
        </NavLink>
        <NavLink
          to="/stockout"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-900" : ""}`
          }
        >
          Stock Out
        </NavLink>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar; 