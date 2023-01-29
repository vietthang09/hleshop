import React from "react";
const Pagination = ({
  totalProducts,
  productsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pages.push(i);
  }

  return (
    <ul className="pagination justify-content-center">
      {pages.map((page, index) => {
        return (
          <li
            key={index}
            onClick={() => setCurrentPage(page)}
            className={`${page == currentPage ? "active" : ""} page-item`}
          >
            <a onClick={() => setCurrentPage(page)} className="page-link">
              {page}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
