import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useState, useLayoutEffect } from "react";
import Home from "./Page/client/Home";
import payments from "./img/payments.png";
import DetailShop from "./Page/client/DetailShop";
import ShoppingCart from "./Page/client/ShoppingCart";
import Login from "./Page/client/Login";
import { getUser } from "./util/getUser";
import { useDispatch, useSelector } from "react-redux";
import cookie from "react-cookies";
import { logoutUser } from "./redux/actions/logoutUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import "./css/style.css";
import Checkout from "./Page/client/Checkout";
import LoginAdmin from "./Page/admin/LoginAdmin";
import Admin from "./Page/admin/Admin";
import ProductByCategory from "./Page/client/ProductByCategory";
import { showToast } from "./util/helper";
import SearchResult from "./Page/client/SearchResult";
import { getCookie } from "./util/localStorageHandle";
import * as CONSTANTS from "./util/constants";
import Profile from "./Page/client/Profile";
import Register from "./Page/client/Register";
import AccountVerification from "./Page/client/AccountVerification";
import Wishlist from "./Page/client/Wishlist";
import ChatBotPage from "./ChatBotPage";
import { sendGetRequest } from "./util/fetchAPI";

function App() {
  const userRedux = useSelector((state) => state.user);
  const [categoryList, setCategoryList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [cart, setCart] = useState([]);
  const [updateCart, setUpdateCart] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function loadCategories() {
    const response = await sendGetRequest(`${CONSTANTS.baseURL}/category/all`);
    if (response.status == "success") {
      setCategoryList(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const logout = () => {
    navigate("/");
    cookie.remove("token");
    cookie.remove("user");
    showToast("SUCCESS", "Logout successful");
    dispatch(logoutUser());
  };

  useEffect(() => {
    loadCategories();
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
  }, []);

  useEffect(() => {
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
    setUpdateCart(false);
  }, [updateCart]);

  const onKeyDownHandler = (e) => {
    if (e.keyCode == 13) {
      onSearchHandler();
    }
  };

  const onSearchHandler = () => {
    if (keyword.length > 0) {
      navigate(`/search/${keyword}`);
    }
  };

  const UserLogin = () => {
    const token = cookie.load("token");
    if (token === null || token === undefined) {
      return (
        <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
          <Link to="/login" className="btn px-0 ml-3">
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: "#17a2b8",
                color: "#fff",
                fontSize: "16px",
                marginTop: "9px",
              }}
            >
              Login
            </button>
          </Link>
        </div>
      );
    } else {
      const status = getUser(token);
      if (status === false) {
        showToast("ERROR", "Login session expired, please login again!");
      } else if (status == "block") {
        showToast(
          "ERROR",
          "Your account is locked, please contact the manager!"
        );
      } else {
        return (
          <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
            <Link to="/wishlist" className="btn px-0">
              <i
                className="fas fa-heart text-primary"
                style={{ paddingBottom: "2px", marginTop: "9px" }}
              ></i>
            </Link>
            <Link to="/shoppingcart" className="btn px-0 ml-3">
              <i className="fas fa-shopping-cart text-primary"></i>
              <span
                className="badge text-secondary border border-secondary rounded-circle"
                style={{ paddingBottom: "2px", marginTop: "9px" }}
              >
                {cart ? cart.length : 0}
              </span>
            </Link>
            <Link to="/profile" className="btn px-0 ml-3">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#17a2b8",
                  color: "#fff",
                  fontSize: "16px",
                  marginTop: "9px",
                }}
              >
                <b>{userRedux.user && userRedux.user.user_fullname}</b>
              </button>
            </Link>
            <div className="btn px-0 ml-3">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#17a2b8",
                  color: "#fff",
                  fontSize: "16px",
                  marginTop: "9px",
                }}
                onClick={() => logout()}
              >
                <b>Logout</b>
              </button>
            </div>
          </div>
        );
      }
    }
  };

  const Header = () => (
    <div className="Header-nav">
      <div className="container-fluid">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="row justify-content-between align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
          <div className="col-lg-4">
            <Link to="" className="text-decoration-none">
              <span className="h1 text-uppercase text-info bg-dark px-2">
                HLE
              </span>
              <span className="h1 text-uppercase text-white bg-info px-2 ml-n1">
                Shop
              </span>
            </Link>
          </div>
          <div className="col-lg-4 col-6 text-right">
            <p className="m-0">Customer Service</p>
            <h5 className="m-0">+012 345 6789</h5>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-dark mb-30">
        <div className="row px-xl-5">
          <div className="col-lg-3 d-none d-lg-block">
            <a
              className="btn d-flex align-items-center justify-content-between bg-info w-100"
              data-toggle="collapse"
              id="menubar"
              style={{ height: "65px", padding: "0 30px" }}
            >
              <h6 className="text-white m-0">
                <i className="fa fa-bars mr-2"></i>Categories
              </h6>
              <i className="fa fa-angle-down text-dark"></i>
            </a>
            <nav
              className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light"
              id="navbar-vertical"
              style={{ width: "calc(100% - 30px)", zIndex: "999" }}
            >
              <div className="navbar-nav w-100">
                {categoryList.map((val, key) => (
                  <div className="pb-1 nav-link nav-item menuhover" key={key}>
                    <Link
                      className="text-decoration-none"
                      to={val.category_slug}
                      state={{ category_id: val.category_id }}
                    >
                      <div className="d-flex align-items-center">
                        <img
                          className="img-fluid"
                          src={val.category_image}
                          alt=""
                          style={{
                            padding: "10px",
                            height: "50px",
                            alignItems: "center",
                          }}
                        />
                        <div className="flex-fill pl-3">
                          <h6 className="">{val.category_name}</h6>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </nav>
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
              <Link to="/" className="text-decoration-none d-block d-lg-none">
                <span className="h1 text-uppercase text-dark bg-light px-2">
                  Multi
                </span>
                <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">
                  Shop
                </span>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                data-toggle="collapse"
                data-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div className="navbar-nav mr-auto py-0">
                  <div className="searchmb" style={{ height: "20px" }}>
                    <div className="input-group nav-item">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for products"
                        onKeyDown={(e) => onKeyDownHandler(e)}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          className="input-group-text text-primary bg-info"
                          onClick={() => onSearchHandler()}
                        >
                          <i
                            className="fa fa-search"
                            style={{ color: "#fff" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {UserLogin()}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  const body = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vnpay-return" element={<Home />} />
      <Route path="/:category_slug" element={<ProductByCategory />} />
      <Route path="/search/:keyword" element={<SearchResult />} />
      <Route path="/home" element={<Home />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/detailshop/:slug" element={<DetailShop />} />
      <Route
        path="/shoppingcart"
        element={<ShoppingCart setUpdateCart={setUpdateCart} />}
      />
      <Route
        path="/checkout"
        element={<Checkout setUpdateCart={setUpdateCart} />}
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/account-verification" element={<AccountVerification />} />

      <Route path="/loginadmin" element={<LoginAdmin />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );

  const footer = () => (
    <div className="footer container-fluid bg-dark text-secondary mt-5 pt-5">
      <div className="row px-xl-5 pt-5">
        <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
          <h5 className="text-secondary text-uppercase mb-4">HLE E-commere</h5>
          <p className="mb-4">
            No dolore ipsum accusam no lorem. Invidunt sed clita kasd clita et
            et dolor sed dolor. Rebum tempor no vero est magna amet no
          </p>
          <p className="mb-2">
            <i className="fa fa-map-marker-alt text-primary mr-3"></i>76 Thiều
            Chửu, Hoà Xuân, Cẩm Lệ, Đà Nẵng 550000
          </p>
          <p className="mb-2">
            <i className="fa fa-envelope text-primary mr-3"></i>
            Lmhuy.18it3@vku.udn.vn
          </p>
          <p className="mb-0">
            <i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890
          </p>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="row">
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Quick Shop</h5>
              <div className="d-flex flex-column justify-content-start">
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Home
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Our Shop
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Shop Detail
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Shopping Cart
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Checkout
                </Link>
                <Link className="text-secondary" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Contact Us
                </Link>
              </div>
            </div>
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">My Account</h5>
              <div className="d-flex flex-column justify-content-start">
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Home
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Our Shop
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Shop Detail
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Shopping Cart
                </Link>
                <Link className="text-secondary mb-2" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Checkout
                </Link>
                <Link className="text-secondary" to="#">
                  <i className="fa fa-angle-right mr-2"></i>Contact Us
                </Link>
              </div>
            </div>
            <div className="col-md-4 mb-5">
              <h5 className="text-secondary text-uppercase mb-4">Newsletter</h5>
              <p>Duo stet tempor ipsum sit amet magna ipsum tempor est</p>
              <form action="">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Email Address"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary">Sign Up</button>
                  </div>
                </div>
              </form>
              <h6 className="text-secondary text-uppercase mt-4 mb-3">
                Follow Us
              </h6>
              <div className="d-flex">
                <Link className="btn btn-primary btn-square mr-2" to="#">
                  <i className="fab fa-twitter"></i>
                </Link>
                <Link className="btn btn-primary btn-square mr-2" to="#">
                  <i className="fab fa-facebook-f"></i>
                </Link>
                <Link className="btn btn-primary btn-square mr-2" to="#">
                  <i className="fab fa-linkedin-in"></i>
                </Link>
                <Link className="btn btn-primary btn-square" to="#">
                  <i className="fab fa-instagram"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row border-top mx-xl-5 py-4"
        style={{ borderColor: "rgba(256, 256, 256, .1) !important" }}
      >
        <div className="col-md-6 px-xl-0">
          <p className="mb-md-0 text-center text-md-left text-secondary">
            &copy;{" "}
            <Link className="text-primary" to="#">
              Domain
            </Link>
            . All Rights Reserved. Designed by
            <Link className="text-primary" to="https://htmlcodex.com">
              HTML Codex
            </Link>
          </p>
        </div>
        <div className="col-md-6 px-xl-0 text-center text-md-right">
          <img className="img-fluid" src={payments} alt="" />
        </div>
      </div>
    </div>
  );

  const initialOptions = {
    "client-id": "test",
    currency: "USD",
    intent: "capture",
    "data-client-token": "abc123xyz==",
  };
  return (
    <>
      {Header()}
      {body()}
      {footer()}
      <div className="chatbot">{ChatBotPage()}</div>
    </>
  );
}
export default App;
