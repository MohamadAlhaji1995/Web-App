import React from "react";

const InputField = ({ label, type, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded-2xl bg-gray-100"
      />
    </div>
  );
};

const SelectField = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded-2xl bg-gray-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SaveButton = ({ handleSave }) => {
  return (
    <button
      onClick={handleSave}
      className="w-full p-2 bg-transparent text-blue-500 border-2 border-blue-500 rounded-2xl font-bold text-lg hover:bg-blue-100 hover:border-blue-500 hover:text-blue-500 transition duration-300 transform  "
    >
      Speichern
    </button>
  );
};

const UserEditForm = ({ userData, setUserData, handleSaveUser }) => {
  return (
    <div className=" mt-2 w-full p-1 bg-white/20 rounded-2xl  ">
      <InputField
        label="Name"
        type="text"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />

      <InputField
        label="E-Mail"
        type="email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />

      <SelectField
        label="Rolle"
        value={userData.role}
        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
        options={[
          { value: "user", label: "user" },
          { value: "admin", label: "admin" },
        ]}
      />

      <SaveButton handleSave={handleSaveUser} />
    </div>
  );
};

export default UserEditForm;
