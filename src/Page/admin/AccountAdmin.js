import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Select,
  message,
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
} from "antd";
import Axios from "axios";
import { ExclamationCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { formatbirthday, showToast } from "../../util/helper";
import Spinner from "../../Page/client/components/spinner";
import { getColumnSearchProps } from "./components/SearchFilter";
import EditUserModel from "./components/EditUserModel";
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
const { confirm } = Modal;
export default function AccountAdmin() {
  const [alluser, setAlluser] = useState([]);
  const overflowX = useSelector((state) => state.layoutReducer.overflowX);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContent, setshowContent] = useState(false);
  const searchInput = useRef();
  const [formAdd] = Form.useForm();
  const [loadingBtn, setloadingBtn] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [showModalAdd, setshowModalAdd] = useState(false);
  const [dataAdd, setdataAdd] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const regEx = {
    // user_fullname: /^[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz0123456789_]+$/,
    user_email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    user_phone_number: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
  };
  const [isReload, setIsReload] = useState(false);
  useEffect(() => {
    loadAdmins();
  }, [isReload]);

  async function loadAdmins() {
    const response = await sendGetRequest(`${baseURL}/user/admin`);
    if (response.status == "success") {
      setAlluser(response.data);
      setshowContent(true);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const columns = [
    {
      title: "ID",
      key: "user_id",
      render: (record) => <span>{record.user_id}</span>,
    },
    {
      title: "Email",
      key: "user_email",
      ...getColumnSearchProps("user_email", searchInput),
    },
    {
      title: "Phone Number",
      key: "user_phone_number",
      ...getColumnSearchProps("user_phone_number", searchInput),
      render: (record) => <span>{record.user_phone_number}</span>,
    },
    {
      title: "Full Name",
      key: "user_fullname",
      ...getColumnSearchProps("user_fullname", searchInput),
      render: (record) => <span>{record.user_fullname}</span>,
    },
    {
      title: "Gender",
      key: "user_gender",
      render: (record) => <span>{record.user_gender}</span>,
    },
    {
      title: "BirthDay",
      key: "user_date_of_birth",
      render: (record) => (
        <span>{formatbirthday(record.user_date_of_birth)}</span>
      ),
    },
    {
      title: "Address",
      key: "user_address",
      render: (record) => <span>{record.user_address}</span>,
    },
    {
      title: "Status",
      key: "status}",
      render: (record) => (
        <Select
          value={record.status}
          onChange={(e) => updateStatusUser(e, record.user_id)}
        >
          <Option value={0}>Active</Option>
          <Option value={1}>Locked</Option>
          <Option value={2}>Not verified</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div style={{ paddingLeft: 15 }}>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              setCurrentUser(record);
            }}
          >
            Edit
          </Button>
          <Button
            className="ml-3"
            onClick={() => showDeleteConfirm(record)}
            type="dashed"
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const updateStatusUser = async (e, id) => {
    const res = await Axios({
      method: "post",
      url: "http://localhost:5000/user/updateStatusUser",
      data: {
        user_id: id,
        status: e,
      },
    }).then((result) => result.data);
    if (res.msg) {
      if (res.msg === "Success") {
        message.success("Update successful");
        loadAdmins();
      } else {
        message.error("There's a mistake !!");
      }
    }
  };

  async function deleteUser(id) {
    setDeleting(true);
    const postData = {
      data: {
        id: id,
      },
    };
    const response = await sendPostRequest(`${baseURL}/user/delete`, postData);
    if (response.status == "success") {
      message.success("Delete Admin successfully");
      setshowModalDelete(false);
      setDeleting(false);
      setdrawerEdit(false);
      loadAdmins();
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Are you sure delete this admin?",
      icon: <ExclamationCircleFilled />,
      content: item.user_fullname,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteUser(item.user_id);
      },
      onCancel() {
        //
      },
    });
  };

  const handleAddAccount = async () => {
    setloadingBtn(true);
    const res = await Axios({
      method: "post",
      url: "http://localhost:5000/user/addAccount",
      data: {
        data: dataAdd,
      },
    }).then((result) => result.data);
    if (res.message === "Success") {
      message.success("Successfully added new Account");
      getAllAccount();
      setdataAdd({});
      formAdd.setFieldsValue({
        user_email: "",
        user_phone_number: "",
        password: "",
        user_fullname: "",
        user_gender: null,
        user_address: "",
        user_date_of_birth: null,
        user_rule: null,
        status: null,
      });
      setloadingBtn(false);
      setshowModalAdd(false);
    } else {
      message.error("There's a mistake !!");
      setloadingBtn(false);
    }
  };

  const ModalAddNew = () => (
    <Modal
      title="Add New Account Admin"
      visible={showModalAdd}
      onCancel={() => setshowModalAdd(false)}
      footer={false}
      style={{ textAlign: "center" }}
    >
      <Form
        form={formAdd}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 12 }}
        style={{ paddingTop: "30px" }}
        onFinish={handleAddAccount}
      >
        <Form.Item
          label="Email"
          name="user_email"
          rules={[{ required: true, message: "Enter your email!!" }]}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={dataAdd.user_email}
            onChange={(e) =>
              setdataAdd({ ...dataAdd, user_email: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="user_phone_number"
          rules={[{ required: true, message: "Enter your Phone Number!!" }]}
        >
          <Input
            placeholder="Enter your Phone Number"
            value={dataAdd.user_phone_number}
            onChange={(e) =>
              setdataAdd({ ...dataAdd, user_phone_number: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Enter your password!!" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            value={dataAdd.password}
            onChange={(e) =>
              setdataAdd({ ...dataAdd, password: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Full Name"
          name="user_fullname"
          rules={[{ required: true, message: "Enter your Full Name!!" }]}
        >
          <Input
            placeholder="Enter your Full Name"
            value={dataAdd.user_fullname}
            onChange={(e) =>
              setdataAdd({ ...dataAdd, user_fullname: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="user_gender"
          rules={[{ required: true, message: "Select Gender" }]}
        >
          <Select
            value={dataAdd.user_gender}
            onChange={(e) => setdataAdd({ ...dataAdd, user_gender: e })}
          >
            <Option value={"male"}>Male</Option>
            <Option value={"female"}>Female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Address"
          name="user_address"
          rules={[{ required: true, message: "Enter your Address!!" }]}
        >
          <Input
            placeholder="Enter your Address"
            value={dataAdd.user_address}
            onChange={(e) =>
              setdataAdd({ ...dataAdd, user_address: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Birthday"
          name="user_date_of_birth"
          rules={[{ required: true, message: "Enter your Birthday!!" }]}
        >
          <DatePicker
            format={formatbirthday}
            onChange={(e) => setdataAdd({ ...dataAdd, user_date_of_birth: e })}
          />
        </Form.Item>

        <Form.Item
          label="Rule"
          name="user_rule"
          rules={[{ required: true, message: "Select Rule" }]}
        >
          <Select
            value={dataAdd.user_rule}
            onChange={(e) => setdataAdd({ ...dataAdd, user_rule: e })}
          >
            <Option value={0}>Customer</Option>
            <Option value={1}>Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item
          style={{ paddingTop: 20 }}
          wrapperCol={{ span: 10, offset: 7 }}
        >
          <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
            Add new Admin
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <>
      <div className="bg-white p-3 rounded">
        <div className="d-flex justify-content-between">
          <h5 className="mb-3">Manage Users</h5>
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => setshowModalAdd(true)}
          >
            Add new <PlusCircleOutlined />
          </Button>
        </div>
        {showContent ? (
          <div>
            <Table
              dataSource={alluser}
              columns={columns}
              style={overflowX ? { overflowX: "scroll" } : null}
            />

            {currentUser && (
              <EditUserModel
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userInfo={currentUser}
                setUserInfo={setCurrentUser}
                setIsReload={setIsReload}
              />
            )}
            {ModalAddNew()}
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
