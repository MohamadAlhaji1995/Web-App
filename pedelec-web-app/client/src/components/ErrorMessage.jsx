import React from 'react';

const ErrorMessage = ({ errorMessage }) => (
  <div className="bg-red-100 p-4 rounded-lg mt-4 text-red-800">
    <p>{errorMessage}</p>
  </div>
);

export default ErrorMessage;
