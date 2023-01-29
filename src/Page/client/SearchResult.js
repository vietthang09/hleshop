import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/style.css";
import "../../lib/animate/animate.min.css";
import "../../lib/owlcarousel/assets/owl.carousel.min.css";
import "../../lib/easing/easing.min.js";
import "../../lib/owlcarousel/owl.carousel.min.js";
import "../../js/main.js";
import Axios from "axios";
import Pagination from "./components/Pagination";
import Products from "./components/Products";
import { divPriceToArray, showToast } from "../../util/helper";
var lastProductIndex;
var firstProductIndex;
var currentProducts;
var firstTime = true;
export default function SearchResult() {
  const { keyword } = useParams();
  const [productList, setProductList] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const loadProductWithKeyword = async () => {
    const data = {
      keyword: keyword,
      price: selectedPrice,
    };
    const encoded = btoa(JSON.stringify(data));
    Axios.get(`http://localhost:5000/shop/search/${encoded}`).then(
      (response) => {
        const responseData = response.data;
        if (responseData.status == "error") {
          showToast("ERROR", response.message);
        } else {
          setProductList(responseData.data);
          if (firstTime) {
            let maxProduct = responseData.data.reduce((max, el) =>
              max.product_price > el.product_price ? max : el
            );
            setMaxPrice(maxProduct.product_price);
            firstTime = false;
          }
        }
      }
    );
  };

  const onSelectPriceHandler = (newPrice) => {
    const foundIndex = selectedPrice.findIndex(
      (el) =>
        Object.entries(el).toString() == Object.entries(newPrice).toString()
    );

    if (foundIndex != -1) {
      let pricesArr = selectedPrice;
      pricesArr.splice(foundIndex, 1);
      setSelectedPrice(pricesArr);
    } else {
      setSelectedPrice((current) => [...current, newPrice]);
    }
    loadProductWithKeyword();
  };

  useEffect(() => {
    loadProductWithKeyword();
  }, [keyword, selectedPrice]);
  useEffect(() => {
    firstTime = true;
  }, [keyword]);

  lastProductIndex = currentPage * productsPerPage;
  firstProductIndex = lastProductIndex - productsPerPage;
  currentProducts = productList.slice(firstProductIndex, lastProductIndex);
  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5 mb-3">
          <div className="col-12">
            <span>{`Found ${productList.length} ${
              productList.length > 1 ? "products" : "product"
            } with keyword "${keyword}" `}</span>
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
                {divPriceToArray(maxPrice).map((item, index) => {
                  return (
                    <div
                      className="custom-control custom-checkbox d-flex align-items-center justify-content-between mt-3"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`price-${index}`}
                        onChange={() => onSelectPriceHandler(item.data)}
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
