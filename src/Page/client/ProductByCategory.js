import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Pagination from "./components/Pagination";
import Products from "./components/Products";
import { divPriceToArray, showToast } from "../../util/helper";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
var lastProductIndex;
var firstProductIndex;
var currentProducts;
export default function ProductByCategory() {
  const location = useLocation();
  const [productList, setProductList] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState({
    category_id: location.state.category_id,
    attributes: {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  async function loadAllProduct() {
    const response = await sendGetRequest(
      `${baseURL}/shop/getProductsByCategoryID/${location.state.category_id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setProductList(response.data);
    }
  }

  async function loadAttributes() {
    const response = await sendGetRequest(
      `${baseURL}/shop/getAttributeByCategoryID/${location.state.category_id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setAttributes(response.data);
    }
  }

  async function onSelectAttributeHandler(
    attributeID,
    attributeType,
    attributeValue
  ) {
    var attributes = selectedAttribute.attributes;
    const foundAttribute = Object.keys(attributes).find(
      (el) => el == attributeType
    );

    if (foundAttribute) {
      var foundValue = attributes[foundAttribute].data.find(
        (el) =>
          Object.entries(el).toString() ==
          Object.entries(attributeValue).toString()
      );
      if (foundValue) {
        const foundIndex = attributes[foundAttribute].data.indexOf(foundValue);
        if (foundIndex != -1) {
          attributes[foundAttribute].data.splice(foundIndex, 1);
        }
      } else {
        attributes[foundAttribute].data.push(attributeValue);
      }
    } else {
      attributes[attributeType] = {
        id: attributeID,
        data: [attributeValue],
      };
    }

    const encoded = btoa(JSON.stringify(selectedAttribute));
    const response = await sendGetRequest(
      `${baseURL}/shop/getProductsWithFilter/${encoded}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setProductList(response.data);
    }
  }
  // End Filter section

  useEffect(() => {
    loadAllProduct();
    loadAttributes();
    setSelectedAttribute({
      category_id: location.state.category_id,
      attributes: {},
    });
  }, [location]);

  lastProductIndex = currentPage * productsPerPage;
  firstProductIndex = lastProductIndex - productsPerPage;
  currentProducts = productList.slice(firstProductIndex, lastProductIndex);
  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" to="#">
                Home
              </Link>
              <Link className="breadcrumb-item text-dark" to="#">
                Smart Phone
              </Link>
              <span className="breadcrumb-item active">Smart Phone List</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-3 col-md-4">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by price</span>
            </h5>
            <div className="bg-light p-4 mb-30">
              <div>
                {attributes.max_price &&
                  divPriceToArray(attributes.max_price).map((item, index) => {
                    return (
                      <div
                        className="custom-control custom-checkbox d-flex align-items-center justify-content-between mt-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`price-${index}`}
                          onChange={() =>
                            onSelectAttributeHandler(
                              "price",
                              "price",
                              item.data
                            )
                          }
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`price-${index}`}
                        >
                          {item.text}
                        </label>
                      </div>
                    );
                  })}
              </div>
            </div>

            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by trademark</span>
            </h5>

            <div className="bg-light p-3 mb-30">
              <div>
                {attributes.trademarks &&
                  attributes.trademarks.map((item, index) => {
                    return (
                      <div
                        className="custom-control custom-checkbox d-flex align-items-center justify-content-between mt-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`trademark-${index}`}
                          onChange={() => {
                            onSelectAttributeHandler(
                              "trademark",
                              "trademark",
                              item
                            );
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`trademark-${index}`}
                        >
                          {item}
                        </label>
                      </div>
                    );
                  })}
              </div>
            </div>

            {attributes.attributes &&
              attributes.attributes.map((item, index) => {
                return (
                  <div key={index}>
                    <h5 className="section-title position-relative text-uppercase mb-3">
                      <span className="bg-secondary pr-3">{`Filter by ${
                        Object.keys(item)[0]
                      }`}</span>
                    </h5>
                    <div className="bg-light p-4 mb-30">
                      <div>
                        {item[Object.keys(item)[0]].data.map(
                          (attItem, attIndex) => {
                            return (
                              <div
                                className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3"
                                key={attIndex}
                              >
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`${Object.keys(item)[0]}-${attIndex}`}
                                  onChange={() => {
                                    onSelectAttributeHandler(
                                      item[Object.keys(item)[0]].id,
                                      Object.keys(item)[0],
                                      attItem
                                    );
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor={`${
                                    Object.keys(item)[0]
                                  }-${attIndex}`}
                                >
                                  {`${attItem} ${
                                    item[Object.keys(item)[0]].unit
                                  }`}
                                </label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="col-lg-9 col-md-8">
            <div className="row pb-3">
              <div className="col-12 pb-1">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div></div>
                  <div className="ml-2">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-light dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Sorting
                      </button>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" to="#">
                          Latest
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Popularity
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Best Rating
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Products products={currentProducts} />
              <div className="col-12">
                <Pagination
                  totalProducts={productList.length}
                  productsPerPage={productsPerPage}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
