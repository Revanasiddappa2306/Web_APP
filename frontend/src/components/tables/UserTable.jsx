import React, { useEffect, useState } from "react";
import UserAssignPopup from "../popups/UserAssignPopup";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/userTable/get-users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Error fetching pages:", error);
    }
  };

  const toggleUserSelection = (userID) => {
    setSelectedUsers((prev) =>
      prev.includes(userID)
        ? prev.filter((id) => id !== userID)
        : [...prev, userID]
    );
  };

  return (
    <div className="bg-white rounded shadow p-4 w-[45%] ml-[2%]">
      <h2 className="text-center font-semibold text-gray-700 mb-4 bg-slate-200 p-2 rounded">Users</h2>
      <div className="h-64 overflow-y-auto border rounded mb-4">
        <table className="table-auto w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.UserID} className="border-t">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.UserID)}
                    onChange={() => toggleUserSelection(user.UserID)}
                  />
                </td>
                <td className="px-4 py-2">{user.UserID}</td>
                <td className="px-4 py-2">{user.FirstName} {user.LastName}</td>
                <td className="px-4 py-2">{user.MobileNum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowAssignPopup(true)}
          disabled={selectedUsers.length === 0}
          className={`mt-2 px-6 py-2 text-white rounded ${
            selectedUsers.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Assign
        </button>
      </div>
          {showAssignPopup && ( <UserAssignPopup userIDs={selectedUsers} onClose={() => setShowAssignPopup(false)}/>)}
    </div>
  );
};

export default UserTable;
