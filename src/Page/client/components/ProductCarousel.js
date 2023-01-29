import { Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { baseURL } from "../../../util/constants";
import { sendPostRequest } from "../../../util/fetchAPI";
import { formatdolla, showToast } from "../../../util/helper";
import OwlCarousel from "react-owl-carousel";
const ProductCarousel = ({ products, setUpdate }) => {
  const userRedux = useSelector((state) => state.user);
  const PriceDiscount = (price, discount) => {
    var prdc = price - price * (discount / 100);
    return prdc;
  };

  async function addToWishlist(productId) {
    var requestData = {
      data: {
        userId: userRedux.user.user_id,
        productId: productId,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/wishlist/create`,
      requestData
    );
    if (response.status == "success") {
      showToast("SUCCESS", response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }

  async function removeFromWishlist(id) {
    var requestData = {
      data: {
        id: id,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/wishlist/delete`,
      requestData
    );
    if (response.status == "success") {
      showToast("SUCCESS", "Product removed successful");
      setUpdate(true);
    } else {
      showToast("ERROR", response.message);
    }
  }

  return (
    <>
      {products.length == 0 ? (
        <Empty style={{ width: "100%", height: "100%" }} />
      ) : (
        <div className="row px-xl-5">
          <div className="col">
            <OwlCarousel className="owl-theme" items={4} loop margin={10} nav>
              {products.map((product, index) => (
                <div key={index}>
                  <div className="product-item bg-light mb-4 mr-2">
                    <div
                      className="product-img position-relative overflow-hidden"
                      style={{ height: "380px" }}
                    >
                      <img
                        className="img-fluid w-100"
                        src={product.product_image}
                        alt=""
                        style={{ padding: "70px" }}
                      />
                      <div className="product-action">
                        <Link
                          className="btn btn-outline-dark btn-square"
                          to={`/detailshop/${product.product_slug}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            class="bi bi-cart-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                          </svg>
                        </Link>
                        {product.hasOwnProperty("wishlist_id") ? (
                          <Link
                            className="btn btn-outline-dark btn-square"
                            onClick={() => {
                              removeFromWishlist(product.wishlist_id);
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        ) : (
                          <Link
                            className="btn btn-outline-dark btn-square"
                            onClick={() => {
                              addToWishlist(product.product_id);
                            }}
                          >
                            <i className="fa fa-heart"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <div className="d-flex justify-content-center">
                        <p
                          className="text-truncate"
                          style={{
                            width: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Link
                            className="h6 text-decoration-none"
                            to={`/detailshop/${product.product_slug}`}
                          >
                            {product.product_name}
                          </Link>
                        </p>
                      </div>
                      {product.product_discount != "0" ? (
                        <div className="d-flex align-items-center justify-content-center mt-2">
                          <h5>
                            {formatdolla(
                              PriceDiscount(
                                product.product_price,
                                product.product_discount
                              ),
                              "$"
                            )}
                          </h5>
                          <h6 className="text-muted ml-2">
                            <del>{formatdolla(product.product_price, "$")}</del>
                          </h6>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center mt-2">
                          <h5>{formatdolla(product.product_price, "$")}</h5>
                        </div>
                      )}
                      <div className="d-flex align-items-center justify-content-center mb-1">
                        <small className="fa fa-star text-primary mr-1"></small>
                        <small className="fa fa-star text-primary mr-1"></small>
                        <small className="fa fa-star text-primary mr-1"></small>
                        <small className="fa fa-star text-primary mr-1"></small>
                        <small className="fa fa-star text-primary mr-1"></small>
                        <small>(99)</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCarousel;
