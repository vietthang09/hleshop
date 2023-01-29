import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../util/localStorageHandle";
import * as CONSTANTS from "../../util/constants";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { formatdolla, showToast } from "../../util/helper";
import { sendPostRequest } from "../../util/fetchAPI";
import Paypal from "./components/Paypal";
export default function Checkout(props) {
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user);
  const [cart, setCart] = useState([]);
  const [userInfor, setUserInfor] = useState({
    user_fullname: userRedux.user.user_fullname,
    user_email: userRedux.user.user_email,
    user_phone_number: userRedux.user.user_phone_number,
    user_address: userRedux.user.user_address,
    user_gender: userRedux.user.user_gender,
  });
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(0);
  const location = useLocation();
  let unCombinedAddress = userInfor.user_address.split(", ", 5);
  const [newAddress, setNewAddress] = useState({
    country: unCombinedAddress[4],
    province: unCombinedAddress[3],
    district: unCombinedAddress[2],
    ward: unCombinedAddress[1],
    specific: unCombinedAddress[0],
  });
  const loadCartData = () => {
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
  };

  const onPayHandler = async () => {
    // console.log(user_fullname)
    if (
      userInfor.user_fullname === "" ||
      userInfor.user_email === "" ||
      userInfor.user_phone_number === "" ||
      userInfor.user_gender === "-- Gender --" ||
      newAddress.country === undefined ||
      newAddress.province === undefined ||
      newAddress.district === undefined ||
      newAddress.ward === undefined ||
      newAddress.specific === undefined
    ) {
      showToast("WARNING", "Invalid information!");
    } else {
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
      var checkoutData = {
        dataProduct: dataProduct,
        user_id: userRedux.user.user_id,
        fullname: userInfor.user_fullname,
        email: userInfor.user_email,
        phonenumber: userInfor.user_phone_number,
        address: userInfor.user_address,
        total_price: location.state.totalPayment,
        method_payment: paymentMethod,
        message: message,
        paymentInfo: null,
        voucher:
          location.state.voucher != undefined
            ? location.state.voucher.voucher_infor
            : null,
      };
      switch (paymentMethod) {
        case 0:
          let cashOnDeliveryResponse = await sendPostRequest(
            `${CONSTANTS.baseURL}/order/postOrder`,
            checkoutData
          );
          if (cashOnDeliveryResponse.status == "success") {
            localStorage.removeItem(CONSTANTS.cartCookie);
            props.setUpdateCart(true);
            navigate("/");
            showToast("SUCCESS", "Order successfully!");
            setTimeout(function() {
              window.location.reload(false);
            }, 2000);
          }
          break;
        case 1:
          let paypalResponse = await sendPostRequest(
            `${CONSTANTS.baseURL}/order/postOrder`,
            checkoutData
          );
          if (paypalResponse.status == "success") {
            localStorage.removeItem(CONSTANTS.cartCookie);
            props.setUpdateCart(true);
            navigate("/");
            showToast("SUCCESS", "Order successfully!");
            setTimeout(function() {
              window.location.reload(false);
            }, 2000);
          }
          break;
        case 2:
          checkoutData.method_payment = 2;
          let vnpayInsertResponse = await sendPostRequest(
            `${CONSTANTS.baseURL}/order/postOrder`,
            checkoutData
          );
          if (vnpayInsertResponse.status == "success") {
            let vnpayData = {
              orderId: vnpayInsertResponse.data.orderId,
              amount: location.state.totalPayment,
              bankCode: "",
              orderDescription:
                message == ""
                  ? `Payment for ${userInfor.user_fullname}`
                  : message,
              orderType: "billpayment",
              language: "",
            };
            let vnpayResponse = await sendPostRequest(
              `${CONSTANTS.baseURL}/payment/vnpay_create_payment_url`,
              vnpayData
            );
            if (vnpayResponse.status == "success") {
              window.location.replace(vnpayResponse.data);
              setCookie(
                CONSTANTS.emailCookie,
                vnpayInsertResponse.data.htmlBody
              );
              if (location.state.voucher != undefined) {
                setCookie(
                  CONSTANTS.voucherCookie,
                  JSON.stringify(location.state.voucher.voucher_infor)
                );
              }
            }
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    let combinedAddress = `${newAddress.specific}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.province}, ${newAddress.country}`;
    setUserInfor((current) => ({
      ...current,
      user_address: combinedAddress,
    }));
  }, [newAddress]);

  useEffect(() => {
    loadCartData();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <a className="breadcrumb-item text-dark" href="#">
                Home
              </a>
              <a className="breadcrumb-item text-dark" href="#">
                Shop
              </a>
              <span className="breadcrumb-item active">Checkout</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-8">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Billing Address</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={userInfor.user_fullname}
                    onChange={(e) =>
                      setUserInfor((current) => ({
                        ...current,
                        user_fullname: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Phone number</label>
                  <input
                    className="form-control"
                    type="text"
                    value={userInfor.user_phone_number}
                    onChange={(e) =>
                      setUserInfor((current) => ({
                        ...current,
                        user_phone_number: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>E-mail</label>
                  <input
                    className="form-control"
                    type="text"
                    value={userInfor.user_email}
                    onChange={(e) =>
                      setUserInfor((current) => ({
                        ...current,
                        user_email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    onChange={(e) =>
                      setUserInfor((current) => ({
                        ...current,
                        user_gender: e.target.value,
                      }))
                    }
                    defaultValue={userInfor.user_gender}
                  >
                    <option>-- Gender --</option>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                  </select>
                </div>
                <div className="col-md-12 form-group">
                  <label>Specific</label>
                  <input
                    className="form-control"
                    type="text"
                    value={newAddress.specific}
                    onChange={(e) =>
                      setNewAddress((current) => ({
                        ...current,
                        specific: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Ward</label>
                  <input
                    className="form-control"
                    type="text"
                    value={newAddress.ward}
                    onChange={(e) =>
                      setNewAddress((current) => ({
                        ...current,
                        ward: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>District</label>
                  <input
                    className="form-control"
                    type="text"
                    value={newAddress.district}
                    onChange={(e) =>
                      setNewAddress((current) => ({
                        ...current,
                        district: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Province</label>
                  <input
                    className="form-control"
                    type="text"
                    value={newAddress.province}
                    onChange={(e) =>
                      setNewAddress((current) => ({
                        ...current,
                        province: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Country</label>
                  <input
                    className="form-control"
                    type="text"
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress((current) => ({
                        ...current,
                        country: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-md-12 form-group">
                  <label>Message</label>
                  <textarea
                    className="form-control"
                    type="text"
                    rows={5}
                    placeholder="I want to..."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Order Total</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="border-bottom">
                <h6 className="mb-3">Products</h6>
                {cart.map((item, index) => (
                  <div className="d-flex justify-content-between" key={index}>
                    <p>{`${item.product_name} x ${item.quantity}`}</p>
                    <p>{formatdolla(item.totalprice, "$")}</p>
                  </div>
                ))}
              </div>
              <div className="border-bottom pt-3 pb-2">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Subtotal</h6>
                  <h6>{formatdolla(location.state.subtotal, "$")}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$5</h6>
                </div>
                {location.state.voucher != undefined &&
                  location.state.voucher.status == 3 && (
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="font-weight-medium">{`Voucher ${location.state.voucher.voucher_infor.code_sale}: ${location.state.voucher.voucher_infor.discount}% off sale`}</h6>
                    </div>
                  )}
              </div>
              <div className="pt-2">
                <div className="d-flex justify-content-between mt-2">
                  <h5>Total</h5>
                  <h5>{formatdolla(location.state.totalPayment, "$")}</h5>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Payment</span>
              </h5>
              <div className="bg-light p-30">
                <div className="form-group">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="payment"
                      id="directcheck"
                      checked={paymentMethod == 0 && true}
                      onChange={() => setPaymentMethod(0)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="directcheck"
                    >
                      <h5>Cash on delivery</h5>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="payment"
                      id="paypal"
                      checked={paymentMethod == 1 && true}
                      onChange={() => setPaymentMethod(1)}
                    />
                    <label className="custom-control-label" htmlFor="paypal">
                      <img
                        src="https://www.paypalobjects.com/digitalassets/c/website/logo/full-text/pp_fc_hl.svg"
                        style={{ width: "100px" }}
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group mb-4">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="payment"
                      id="banktransfer"
                      checked={paymentMethod == 2 && true}
                      onChange={() => setPaymentMethod(2)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="banktransfer"
                    >
                      <img
                        height={32}
                        src="https://vnpayqr.vn/wp-content/uploads/2022/01/tong-hop-logo-xuat-PNG_VNPAY-ngang-1.png"
                      />
                    </label>
                  </div>
                </div>
                {paymentMethod == 1 ? (
                  <Paypal
                    totalPrice={location.state.totalPayment}
                    handleOrder={onPayHandler}
                  />
                ) : (
                  <button
                    className="btn btn-block btn-info font-weight-bold py-3"
                    onClick={() => onPayHandler()}
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
