import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => handlePageChange("prev")}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-2xl disabled:opacity-50 hover:bg-blue-600"
      >
        &laquo; Vorherige
      </button>
      <span className="mx-4">
        Seite {currentPage} von {totalPages}
      </span>
      <button
        onClick={() => handlePageChange("next")}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-2xl disabled:opacity-50 hover:bg-blue-600"
      >
        Nächste &raquo;
      </button>
    </div>
  );
};

export default Pagination;
