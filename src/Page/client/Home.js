import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import offer1 from "../../img/banner3.png";
import { showToast } from "../../util/helper";
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { baseURL, cartCookie, emailCookie } from "../../util/constants";
import { useSelector } from "react-redux";
import { getCookie } from "../../util/localStorageHandle";
import Products from "./components/Products";
import * as CONSTANTS from "../../util/constants";
import HomeCarousel from "./components/HomeCarousel";

export default function Home() {
  const userRedux = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [topProduct, setTopProduct] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);

  async function loadCategories() {
    const response = await sendGetRequest(`${baseURL}/category/all`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function loadTopProducts() {
    const response = await sendGetRequest(`${baseURL}/product/top`);
    if (response.status == "success") {
      setTopProduct(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function loadPromotionalProducts() {
    const response = await sendGetRequest(`${baseURL}/product/promotional`);
    if (response.status == "success") {
      setPromotionalProducts(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const checkPayment = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has("vnp_ResponseCode")) {
      const cart = JSON.parse(getCookie(CONSTANTS.cartCookie));
      const voucher = JSON.parse(getCookie(CONSTANTS.voucherCookie));
      let dataProduct = [];
      cart.map((item) => {
        let newProduct = {
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          description: item.characteristics.values,
          hash: item.characteristics.characteristics_hash,
          price: item.price,
        };
        dataProduct.push(newProduct);
      });
      let requestData = {
        responseCode: urlParams.get("vnp_ResponseCode"),
        orderId: urlParams.get("vnp_TxnRef"),
        userEmail: userRedux.user.user_email,
        htmlBody: getCookie(emailCookie),
        products: dataProduct,
        voucherId: voucher ? voucher.id : null,
      };
      const response = await sendPostRequest(
        `${baseURL}/payment/handle-vnpay-response`,
        requestData
      );
      if (response.status == "success") {
        if (response.data == "success") {
          localStorage.removeItem(cartCookie);
          localStorage.removeItem(emailCookie);
          localStorage.removeItem(CONSTANTS.voucherCookie);
          navigate("/");
          showToast("SUCCESS", "Order successfully!");
          setTimeout(function() {
            window.location.reload(false);
          }, 2000);
        } else {
          showToast("ERROR", response.message);
          navigate("/");
          window.location.reload(false);
        }
      }
    }
  };

  useEffect(() => {
    loadCategories();
    loadTopProducts();
    loadPromotionalProducts();
    checkPayment();
  }, []);

  return (
    <>
      <div className="container-fluid mb-3">
        <HomeCarousel />
      </div>

      <div className="container-fluid pt-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Categories</span>
        </h2>
        <div className="row px-xl-5 pb-3">
          {categories.map((val, key) => (
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={key}>
              <Link
                className="text-decoration-none"
                to={val.category_slug}
                state={{ category_id: val.category_id }}
              >
                <div className="cat-item d-flex align-items-center mb-4 p-1">
                  <div className="overflow-hidden">
                    <img
                      className="img-fluid"
                      src={val.category_image}
                      alt=""
                      style={{
                        padding: "10px",
                        height: "80px",
                        alignItems: "center",
                      }}
                    />
                  </div>
                  <div className="flex-fill pl-3">
                    <h5>{val.category_name}</h5>
                    <small className="text-body">{val.quantity} Products</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Latest product</span>
        </h2>
        <div className="row px-xl-5">
          {topProduct && topProduct.length > 0 && (
            <Products products={topProduct} />
          )}
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">Promotional products</span>
        </h2>
        <div className="row px-xl-5">
          {promotionalProducts && promotionalProducts.length > 0 && (
            <Products products={promotionalProducts} />
          )}
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <div className="row px-xl-5">
          <div className="col-md-6">
            <div className="product-offer mb-30" style={{ height: "300px" }}>
              <img className="img-fluid" src={offer1} alt="" />
              <div className="offer-text">
                <h6 className="text-white text-uppercase">Save 20%</h6>
                <h3 className="text-white mb-3">Special Offer</h3>
                <a to="" className="btn btn-info">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-offer mb-30" style={{ height: "300px" }}>
              <img className="img-fluid" src={offer1} alt="" />
              <div className="offer-text">
                <h6 className="text-white text-uppercase">Save 20%</h6>
                <h3 className="text-white mb-3">Special Offer</h3>
                <a to="" className="btn btn-info">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-check text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
              <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              <h1 className="fa fa-phone-volume text-primary m-0 mr-3"></h1>
              <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
