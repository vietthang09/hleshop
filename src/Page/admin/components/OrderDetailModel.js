import { Button, Modal, Table, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { baseURL, orderStatus } from "../../../util/constants";
import { sendGetRequest, sendPostRequest } from "../../../util/fetchAPI";
import {
  calculateDiscountByPercent,
  formatdolla,
  showToast,
} from "../../../util/helper";

export default function OrderDetailModel({
  order,
  isModalOpen,
  setIsModalOpen,
  setIsReload,
}) {
  const componentRef = useRef();
  const [orderedItems, setOrderedItems] = useState([]);
  async function getOrderedItem() {
    const response = await sendGetRequest(`${baseURL}/order/${order.order_id}`);
    if (response.status == "success") {
      setOrderedItems(response.data);
    } else {
      showToast("ERROR", "There some mistake!");
    }
  }

  async function updateStatus(status) {
    const postData = {
      data: {
        id: order.order_id,
        status: status,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/order/update-status`,
      postData
    );
    if (response.status == "success") {
      getOrderedItem();
      setIsReload(true);
      showToast("SUCCESS", "Order status updated successfully!");
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function calculateSubTotal() {
    var total = 0;
    orderedItems.map((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }
  const columns = [
    {
      title: "Image",
      key: "image",
      render: (record) => {
        return (
          <img
            className="border p-1 rounded"
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
            }}
            src={record.product_image}
          />
        );
      },
    },
    {
      title: "Name",
      key: "name",
      render: (record) => {
        return <h6 className="d-block text-black">{record.product_name}</h6>;
      },
    },
    {
      title: "Description",
      key: "description",
      render: (record) => {
        return <h6 className="d-block">{record.description}</h6>;
      },
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (record) => {
        return (
          <span className="d-block" style={{ textAlign: "center" }}>
            <h6>{record.quantity}</h6>
          </span>
        );
      },
    },
    {
      title: "Price",
      key: "price",
      render: (record) => {
        return (
          <h6>
            {formatdolla(
              record.product_discount
                ? calculateDiscountByPercent(
                    record.product_price,
                    record.product_discount
                  )
                : record.product_price,
              "$"
            )}
          </h6>
        );
      },
    },
    {
      title: "Total",
      key: "total",
      render: (record) => {
        return (
          <h6>
            {formatdolla(
              record.product_discount
                ? calculateDiscountByPercent(
                    record.product_price,
                    record.product_discount
                  ) * record.quantity
                : record.product_price * record.quantity,
              "$"
            )}
          </h6>
        );
      },
    },
  ];

  useEffect(() => {
    getOrderedItem();
  }, [order]);

  return (
    <div>
      <div className="d-none">
        <div ref={componentRef} className="p-3">
          <h1 className="text-center">INVOICE</h1>
          <h5 className="text-center my-3">
            <i>{new Date(order.created_at).toLocaleString()}</i>
          </h5>
          <div>
            <Table
              columns={columns}
              dataSource={orderedItems}
              size="small"
              locale={{ emptyText: "You don't have any orders yet" }}
            />
            <div className="row mt-2">
              <div className="col-md-2">To:</div>
              <div className="col-md-6">{order.fullname}</div>
              <div className="col-md-2">Subtotal:</div>
              <div className="col-md-2">
                {formatdolla(calculateSubTotal(), "$")}
              </div>
              <div className="col-md-2">Address:</div>
              <div className="col-md-6">{order.address}</div>
              <div className="col-md-2">Shipping:</div>
              <div className="col-md-2">{formatdolla(5, "$")}</div>

              <div className="col-md-2">Message:</div>
              <div className="col-md-6">{order.message}</div>
              {order.discount ? (
                <>
                  <div className="col-md-2">Voucher:</div>
                  <div className="col-md-2">{`- ${formatdolla(
                    order.total_price -
                      calculateDiscountByPercent(
                        order.total_price,
                        order.discount
                      ),
                    "$"
                  )}`}</div>
                </>
              ) : (
                <div className="col-md-4"></div>
              )}

              <div className="col-md-2">Status:</div>
              <div className="col-md-6">
                {orderStatus.find((el) => el.id == order.status).data}
              </div>
              <div className="col-md-4"></div>

              <div className="col-md-2">Payment method:</div>
              <div className="col-md-6">
                {order.method_payment == 0
                  ? "Cash on delivery"
                  : order.method_payment == 1
                  ? "Pay with Paypal"
                  : "Pay with VNPay"}
              </div>
              <div className="col-md-2">
                <h5>Total:</h5>
              </div>
              <div className="col-md-2">
                <h5>{formatdolla(order.total_price, "$")}</h5>
              </div>

              <div className="col-10"></div>
              <div className="col-2">
                {(order.method_payment == 0 && order.status == 2) ||
                order.method_payment == 1 ||
                order.method_payment == 2 ? (
                  <button
                    type="button"
                    className="btn btn-success btn-lg rounded"
                  >
                    PAID
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger btn-lg rounded"
                  >
                    UNPAID
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={`Ordered items - ${order.order_id}`}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={1000}
        footer={[<Button onClick={() => handlePrint()}>Print</Button>]}
      >
        <div>
          <Table
            columns={columns}
            dataSource={orderedItems}
            size="small"
            locale={{ emptyText: "You don't have any orders yet" }}
          />
          <div className="row">
            <div className="col-3 form-group">
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                onChange={(e) => updateStatus(e.target.value)}
              >
                {orderStatus.map((item) => {
                  return (
                    <option
                      key={item.id}
                      value={item.id}
                      selected={item.id == order.status}
                    >
                      {item.data}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-12">
              <p>
                Booking date: {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
