import React from 'react';

const TextInput = ({ label, value, onChange, placeholder, error }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{label}</label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-black ${error ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 mt-1 text-sm animate-fade">{error}</p>}
  </div>
);

export default TextInput;
