import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  message,
  Drawer,
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  InputNumber,
} from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Spinner from "../../Page/client/components/spinner";
import { PlusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { getColumnSearchProps } from "./components/SearchFilter";
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';

export default function SaleManage() {
  const [AllVoucher, setAllVoucher] = useState([]);
  const [loadingTable, setloadingTable] = useState(false);
  const [showContent, setshowContent] = useState(false);
  const [showDrawer, setshowDrawer] = useState(false);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const overflowX = useSelector((state) => state.layoutReducer.overflowX);
  const [loadingBtn, setloadingBtn] = useState(false);
  const [formAddSale] = Form.useForm();
  const [dataAddSale, setdataAddSale] = useState({});
  const [itemTmp, setitemTmp] = useState();
  const searchInput = useRef();

  useEffect(() => {
    getAllVoucher();
  }, []);

  const getAllVoucher = () => {
    Axios.get("http://localhost:5000/shop/getAllSale").then((responsive) => {
      if (responsive.data !== undefined) {
        setAllVoucher(responsive.data.data);
        console.log(responsive.data.data);
        setshowContent(true);
      }
    });
  };

  const handleEditDate = async (e, id) => {
    setloadingTable(true);
    if (e === null) {
    } else {
      const date_start = moment(e[0].$d).format("YYYY-MM-DD HH:mm:ss");
      const expired = moment(e[1].$d).format("YYYY-MM-DD HH:mm:ss");
      console.log(date_start, expired)
      const res = await Axios({
        method: "post",
        url: "http://localhost:5000/shop/updateTimeSale",
        data: {
          date_start: date_start,
          expired: expired,
          id: id,
        },
      }).then((result) => result.data);
      if (res.msg) {
        if (res.msg === "Success") {
          setTimeout(() => {
            message.success("Update promo code #" + id + " successful !");
            setloadingTable(false);
            getAllVoucher()
          }, 500);
        } else {
          setTimeout(() => {
            message.error("There's a mistake !!");
            setloadingTable(false);
          }, 500);
        }
      }
    }
  };

  const handleEditQuanity = async (e, id) => {
    setloadingTable(true);
    const res = await Axios({
      method: "post",
      url: "http://localhost:5000/shop/updateQuanitySale",
      data: {
        quantity: e,
        id: id,
      },
    }).then((result) => result.data);
    if (res.msg) {
      if (res.msg === "Success") {
        setTimeout(() => {
          message.success("Update promo code #" + id + " successful !");
          getAllVoucher();
          setloadingTable(false);
        }, 500);
      } else {
        setTimeout(() => {
          message.error("There's a mistake !!");
          setloadingTable(false);
        });
      }
    }
  };

  const handleAddSale = async () => {
    setloadingBtn(true);
    const res = await Axios({
      method: "post",
      url: "http://localhost:5000/shop/addPromotion",
      data: {
        data: dataAddSale,
      },
    }).then((result) => result.data);
    if (res.msg) {
      if (res.msg === "Success") {
        setTimeout(() => {
          message.success("Successfully added promo code !");
          getAllVoucher();
          setdataAddSale({});
          formAddSale.setFieldsValue({
            name_event_sale: "",
            discount: "",
            code_sale: "",
            quantity: "",
            time: "",
          });
          setshowDrawer(false);
          setloadingBtn(false);
        }, 500);
      } else {
        setTimeout(() => {
          message.error("There's a mistake !!");
          setloadingBtn(false);
        });
      }
    }
  };

  const DrawerAddSale = () => (
    <Drawer
      title="Add promo code"
      placement="right"
      width={overflowX ? "100%" : 520}
      getContainer={false}
      onClose={() => setshowDrawer(false)}
      visible={showDrawer}
    >
      <Form
        form={formAddSale}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleAddSale}
      >
        <Form.Item
          label="Event name"
          name="name_event_sale"
          rules={[{ required: true, message: "Please enter event name" }]}
        >
          <Input
            placeholder="Enter event name"
            value={dataAddSale.name_event_sale}
            onChange={(e) =>
              setdataAddSale({
                ...dataAddSale,
                name_event_sale: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="Promo code"
          name="code_sale"
          rules={[{ required: true, message: "Promo code is not empty!" }]}
        >
          <Input
            placeholder="Enter promo code"
            value={dataAddSale.code_sale}
            onChange={(e) =>
              setdataAddSale({ ...dataAddSale, code_sale: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Percent decrease"
          name="discount"
          rules={[{ required: true, message: "Discount price is not blank!" }]}
        >
          <InputNumber
            placeholder="Percent decrease"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={0}
            value={dataAddSale.discount}
            onChange={(e) => setdataAddSale({ ...dataAddSale, discount: e })}
          />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Quantity is not blank!" }]}
        >
          <InputNumber
            placeholder="Quantity"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={0}
            value={dataAddSale.quantity}
            onChange={(e) => setdataAddSale({ ...dataAddSale, quantity: e })}
          />
        </Form.Item>
        <Form.Item
          label="Time"
          name="time"
          rules={[
            {
              required: true,
              message: "You must choose the time the event takes place!",
            },
          ]}
        >
          <RangePicker
            renderExtraFooter={() => "extra footer"}
            showTime
            onChange={(e) =>
              setdataAddSale({
                ...dataAddSale,
                date_start: moment(e[0]._d).format("YYYY-MM-DD HH:mm:ss"),
                expired: moment(e[1]._d).format("YYYY-MM-DD HH:mm:ss"),
              })
            }
          />
        </Form.Item>
        <Form.Item
          style={{ paddingTop: 20 }}
          wrapperCol={{ span: 12, offset: 10 }}
        >
          <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
            Add code
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );

  const handleDeleteSale = async () => {
    const res = await Axios({
      method: "post",
      url: "http://localhost:5000/shop/deleteSale",
      data: {
        id: itemTmp.id,
      },
    }).then((result) => result.data);
    if (res.msg) {
      if (res.msg === "Success") {
        message.success("Successful code removal");
        setshowModalDelete(false);
        getAllVoucher();
      } else {
        message.error("There's a mistake !!");
        setshowModalDelete(false);
      }
    }
  };

  const ModalDeleteSale = () => (
    <div>
      {showModalDelete && (
        <Modal
          title={`Delete product ${itemTmp.code_sale}`}
          visible={showModalDelete}
          onCancel={() => {
            setshowModalDelete(false);
          }}
          onOk={handleDeleteSale}
          cancelText="Exit"
          okText="Chắc chắn"
        >
          <p>Are you sure you want to delete this promo code.</p>
        </Modal>
      )}
    </div>
  );

  const columns = [
    {
      title: "Event name",
      key: "name_event_sale",
      ...getColumnSearchProps("name_event_sale", searchInput),
    },
    {
      title: "Promo code",
      key: "code_sale",
      ...getColumnSearchProps("code_sale", searchInput),
    },
    {
      title: "Percent decrease",
      key: "discount",
      render: (record) => <span>{record.discount + "%"}</span>,
    },
    {
      title: "Remaining",
      key: "quantity",
      render: (record) => (
        <InputNumber
          value={record.quantity}
          min={0}
          onChange={(e) => handleEditQuanity(e, record.id)}
        />
      ),
    },
    {
      title: "Used",
      key: "used",
      render: (record) => <span>{record.used}</span>,
    },
    {
        title:<div style={{textAlign: 'center'}}><span>Discount period</span></div>,
        key:'date_start',
        sorter: (a, b) =>new Date(a.date_start)- new Date(b.date_start),
        render: (record) =>(
            <RangePicker 
                value={[dayjs(record.date_start, "YYYY-MM-DD HH:mm:ss").add(7, 'h'),dayjs(record.expired, "YYYY-MM-DD HH:mm:ss").add(7, 'h')]}
                showTime 
                onChange= {(e)=>handleEditDate(e,record.id)}
            />
        )
    },
    {
      title: "Edit",
      key: "edit",
      render: (record) => (
        <Button
          onClick={() => {
            setshowModalDelete(true);
            setitemTmp(record);
          }}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
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

      <div className="bg-white p-3 rounded">
        <div className="d-flex justify-content-between">
          <h5 className="mb-3">Manage Sales</h5>
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => setshowDrawer(true)}
          >
            Add new Event
            <PlusCircleOutlined />
          </Button>
        </div>
        {showContent ? (
          <div>
            <Table
              showSorterTooltip={{ title: "Tap to sort" }}
              columns={columns}
              dataSource={AllVoucher}
              loading={loadingTable}
              style={overflowX ? { overflowX: "scroll" } : null}
            />

            {DrawerAddSale()}
            {ModalDeleteSale()}
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
