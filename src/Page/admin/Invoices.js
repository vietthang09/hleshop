import { sendPostRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { formatdolla, showToast } from "../../util/helper";
import { useEffect, useState } from "react";
import { DatePicker, Table, Tabs, Tag } from "antd";
import { Link } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import OrderDetailModel from "./components/OrderDetailModel";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
export default function Invoices() {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [keyTab, setKeyTab] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [filter, setFilter] = useState({
    start: dayjs(new Date())
      .startOf("M")
      .format("YYYY-MM-DD"),
    end: dayjs(new Date())
      .endOf("M")
      .format("YYYY-MM-DD"),
  });
  async function getOrders() {
    const postData = {
      data: {
        start: dayjs(new Date())
          .startOf("M")
          .format("YYYY-MM-DD"),
        end: dayjs(new Date())
          .endOf("M")
          .format("YYYY-MM-DD"),
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/order/filtered-date`,
      postData
    );
    if (response.status == "success") {
      setOrders(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function getOrdersWithFilter() {
    const postData = {
      data: {
        start: filter.start,
        end: filter.end,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/order/filtered-date`,
      postData
    );
    if (response.status == "success") {
      setOrders(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  useEffect(() => {
    getOrders();
    setIsReload(false);
  }, [isReload]);

  const columns = [
    {
      title: "ORDER",
      key: "id",
      render: (record) => {
        return (
          <Link
            onClick={() => {
              setCurrentOrder(record);
              setIsModalOpen(true);
            }}
          >
            {"#" + record.order_id}
          </Link>
        );
      },
    },
    {
      title: "EMAIL",
      key: "email",
      render: (record) => {
        return <span>{record.email}</span>;
      },
    },
    {
      title: "USERNAME",
      key: "username",
      render: (record) => {
        return <span>{record.fullname}</span>;
      },
    },
    {
      title: "ADDRESS",
      key: "address",
      render: (record) => {
        return <span>{record.address}</span>;
      },
    },
    {
      title: "BOOKING DATE",
      dataIndex: "",
      key: "date",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (record) => {
        return <span>{new Date(record.created_at).toLocaleString()}</span>;
      },
    },
    {
      title: "PAYMENT METHOD",
      key: "payment_method",
      render: (record) => {
        return (
          <span>
            {record.method_payment == 0
              ? "Cash on delivery"
              : record.method_payment == 1
              ? "Paywith with Paypal"
              : "Paywith with Vnpay"}
          </span>
        );
      },
    },
    {
      title: "STATUS",
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
      title: "TOTAL",
      dataIndex: "",
      key: "total",
      sorter: (a, b) => a.total_price - b.total_price,
      render: (record) => {
        return <h6>{formatdolla(record.total_price, "$")}</h6>;
      },
    },
    {
      key: "paid",
      render: (record) => {
        return (record.method_payment == 0 && record.status == 2) ||
          record.method_payment == 1 ||
          record.method_payment == 2 ? (
          <Tag color="green">Paied</Tag>
        ) : (
          <Tag color="red">UnPaid</Tag>
        );
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

  return (
    <div className="bg-white p-3 rounded">
      <div className="d-flex justify-content-between mb-3">
        <h5 className="mb-3">Manage Invoices</h5>
        <div className="d-flex align-items-center">
          <RangePicker
            value={[
              dayjs(filter.start, "YYYY-MM-DD"),
              dayjs(filter.end, "YYYY-MM-DD"),
            ]}
            onChange={(e) => {
              setFilter((current) => ({
                ...current,
                start: dayjs(new Date(e[0].$d)).format("YYYY-MM-DD"),
                end: dayjs(new Date(e[1].$d)).format("YYYY-MM-DD"),
              }));
            }}
          />
          <button
            className="mx-2 btn btn-info rounded"
            onClick={getOrdersWithFilter}
          >
            Show
          </button>
          <button
            className="btn btn-info rounded"
            onClick={() => {
              getOrders();
              setFilter((current) => ({
                ...current,
                start: dayjs(new Date())
                  .startOf("M")
                  .format("YYYY-MM-DD"),
                end: dayjs(new Date())
                  .endOf("M")
                  .format("YYYY-MM-DD"),
              }));
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <Tabs
        tabPosition="left"
        defaultActiveKey="0"
        centered
        onChange={(e) => setKeyTab(e)}
      >
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
      {currentOrder != undefined && (
        <OrderDetailModel
          order={currentOrder}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsReload={setIsReload}
        />
      )}
    </div>
  );
}
