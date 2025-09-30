import React from "react";
import UserEditForm from "./UserEditForm";

const UserTable = ({
  paginatedUsers,
  handleEditUser,
  handleDeleteUser,
  handleSaveUser,
  editingUser,
  setUserData,
  userData,
}) => {
  return (
    <div>
      <table className=" w-full p-1 bg-white/20 rounded-2xl font-bold text-lg ">
        <thead>
          <tr>
            {["E-Mail", "Rolle", "Aktionen"].map((item) => (
              <th className="text-left p-2" key={item}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user._id} className="border-t-8   ">
              <td className="p-2 ">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <div className="flex flex-col gap-4  ">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-1 border-2 rounded-2xl text-green-600 border-green-600 hover:bg-green-100 mix-blend-multiply font-bold "
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-1 border-2 rounded-2xl text-red-600 border-red-600 hover:bg-red-100 font-bold "
                  >
                    Löschen
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <UserEditForm
          userData={userData}
          setUserData={setUserData}
          handleSaveUser={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserTable;
