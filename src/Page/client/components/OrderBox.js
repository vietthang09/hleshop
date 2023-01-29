import { Table, Tabs, Tag } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import {
  calculateDiscountByPercent,
  formatdate,
  formatdolla,
  showToast,
} from "../../../util/helper";
import { useSelector } from "react-redux";
import AccountVerificationForm from "./AccountVerificationForm";
import { useEffect, useState } from "react";
import { sendGetRequest } from "../../../util/fetchAPI";
import { baseURL } from "../../../util/constants";
export const OrderBox = () => {
  const userRedux = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [currentOrder, setCurrentOrder] = useState({});
  const [keyTab, setKeyTab] = useState("0");
  const loadOrders = async () => {
    const response = await sendGetRequest(
      `${baseURL}/order/get-orders-by-user-id/${userRedux.user.user_id}`
    );
    if (response.status == "success") {
      setOrders(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  };

  async function loadOrderDetail() {
    const response = await sendGetRequest(`${baseURL}/order/${currentOrderId}`);
    if (response.status == "success") {
      setOrderDetail(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }

  function calculateSubTotal() {
    var total = 0;
    orderDetail.map((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }

  const columns = [
    {
      title: "Order",
      key: "id",
      render: (record) => {
        return (
          <Link
            onClick={() => {
              setIsModalOpen(true);
              setCurrentOrderId(record.order_id);
            }}
          >
            {"#" + record.order_id}
          </Link>
        );
      },
    },
    {
      title: "Booking Date",
      dataIndex: "",
      key: "date",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (record) => {
        return <span>{new Date(record.created_at).toLocaleString()}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "",
      key: "status",
      render: (record) => {
        switch (record.status) {
          case 0:
            return (
              <Tag color={"yellow"} key={"processing"}>
                {"Processing".toUpperCase()}
              </Tag>
            );
          case 1:
            return (
              <Tag color={"blue"} key={"delivering"}>
                {"Delivering".toUpperCase()}
              </Tag>
            );
          case 2:
            return (
              <Tag color={"green"} key={"delivered"}>
                {"Delivered".toUpperCase()}
              </Tag>
            );
          case 3:
            return (
              <Tag color={"red"} key={"cancelled"}>
                {"Cancelled".toUpperCase()}
              </Tag>
            );
          case 4:
            return (
              <Tag color={"red"} key={"refund"}>
                {"Refund".toUpperCase()}
              </Tag>
            );
          default:
            return <span style={{ color: "yellow" }}>Undefined</span>;
        }
      },
    },
    {
      title: "Total",
      dataIndex: "",
      key: "total",
      render: (record) => {
        return <span>{formatdolla(record.total_price, "$")}</span>;
      },
    },
  ];

  const TabContent = () => {
    let dataTmp = [];
    if (orders !== undefined) {
      if (keyTab === "0") {
        dataTmp = orders;
      }
      if (keyTab === "1") {
        dataTmp = orders.filter((e) => e.status == 0);
      }
      if (keyTab === "2") {
        dataTmp = orders.filter((e) => e.status == 1);
      }
      if (keyTab === "3") {
        dataTmp = orders.filter((e) => e.status == 2);
      }
      if (keyTab === "4") {
        dataTmp = orders.filter((e) => e.status == 3);
      }
      if (keyTab === "5") {
        dataTmp = orders.filter((e) => e.status == 4);
      }
      //sort by date soon as soon
      dataTmp.sort(function(a, b) {
        return new Date(b.create_at) - new Date(a.create_at);
      });
    }
    return (
      <div className="wrapperTableBill">
        <Table
          columns={columns}
          dataSource={dataTmp}
          size="small"
          locale={{ emptyText: "You don't have any orders yet" }}
        />
      </div>
    );
  };

  useEffect(() => {
    loadOrders();
  }, []);
  useEffect(() => {
    loadOrderDetail();
    setCurrentOrder(
      orders.filter((obj) => {
        return obj.order_id == currentOrderId;
      })[0]
    );
  }, [currentOrderId]);
  return (
    <>
      {userRedux.user.status == 2 ? (
        <>
          <AccountVerificationForm user_email={userInfor.user_email} />
        </>
      ) : (
        <>
          {currentOrder != null && currentOrder.order_id != undefined && (
            <Modal
              title={`Ordered items - ${currentOrder.order_id}`}
              open={isModalOpen}
              onOk={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
              width={1000}
            >
              {orderDetail.map((item, index) => {
                return (
                  <div style={{ backgroundColor: "" }}>
                    <div className="row d-flex align-items-center mt-3">
                      <div className="col-md-2">
                        <img
                          className="border p-1 rounded"
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "contain",
                          }}
                          src={item.product_image}
                        />
                      </div>
                      <div className="col-md-6">
                        <h5 className="d-block text-black">
                          {item.product_name}
                        </h5>
                        <span className="d-block">{item.description}</span>
                        <span
                          className="d-block"
                          style={{ opacity: 0.7 }}
                        >{`Product ID: ${item.product_id}`}</span>
                      </div>
                      <div className="col-md-2 text-black">
                        <h5>
                          {`${formatdolla(
                            item.product_discount
                              ? calculateDiscountByPercent(
                                  item.product_price,
                                  item.product_discount
                                )
                              : item.product_price,
                            "$"
                          )} x ${item.quantity}`}
                        </h5>
                      </div>
                      <div className="col-md-2 text-black">
                        <h5>
                          {formatdolla(
                            item.product_discount
                              ? calculateDiscountByPercent(
                                  item.product_price,
                                  item.product_discount
                                ) * item.quantity
                              : item.product_price * item.quantity,
                            "$"
                          )}
                        </h5>
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
              <div className="row mt-2">
                <div className="col-md-2">To:</div>
                <div className="col-md-6">{currentOrder.fullname}</div>
                <div className="col-md-2">Subtotal:</div>
                <div className="col-md-2">
                  {formatdolla(calculateSubTotal(), "$")}
                </div>
                <div className="col-md-2">Address:</div>
                <div className="col-md-6">{currentOrder.address}</div>
                <div className="col-md-2">Shipping:</div>
                <div className="col-md-2">{formatdolla(5, "$")}</div>

                <div className="col-md-2">Message:</div>
                <div className="col-md-6">{currentOrder.message}</div>
                {currentOrder.discount ? (
                  <>
                    <div className="col-md-2">Voucher:</div>
                    <div className="col-md-2">{`- ${formatdolla(
                      currentOrder.total_price -
                        calculateDiscountByPercent(
                          currentOrder.total_price,
                          currentOrder.discount
                        ),
                      "$"
                    )}`}</div>
                  </>
                ) : (
                  <div className="col-md-4"></div>
                )}

                <div className="col-md-2">Payment method:</div>
                <div className="col-md-6">
                  {currentOrder.method_payment == 0
                    ? "Cash on delivery"
                    : currentOrder.method_payment == 1
                    ? "Pay with Paypal"
                    : "Pay with VNPay"}
                </div>
                <div className="col-md-2">
                  <h5>Total:</h5>
                </div>
                <div className="col-md-2">
                  <h5>{formatdolla(currentOrder.total_price, "$")}</h5>
                  {currentOrder.method_payment === 0 ? (
                    <Tag color={"red"}>UnPaid</Tag>
                  ): currentOrder.method_payment === 1 ? (
                    <Tag color={"green"}>Paid</Tag>
                  ):(
                    <Tag color={"green"}>Paid</Tag>
                  )}
                </div>
              </div>
            </Modal>
          )}
          <h5 className="section-title position-relative text-uppercase mb-3">
            <span className="bg-secondary pr-3">My orders</span>
          </h5>
          <div className="bg-light p-30 mb-5">
            <Tabs defaultActiveKey="0" centered onChange={(e) => setKeyTab(e)}>
              <TabPane tab="All orders" key="0">
                <TabContent />
              </TabPane>
              <TabPane tab="Processing" key="1">
                <TabContent />
              </TabPane>
              <TabPane tab="Delivering" key="2">
                <TabContent />
              </TabPane>
              <TabPane tab="Delivered" key="3">
                <TabContent />
              </TabPane>
              <TabPane tab="Cancelled" key="4">
                <TabContent />
              </TabPane>
              <TabPane tab="Refund" key="5">
                <TabContent />
              </TabPane>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
};
