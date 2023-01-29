import React, { useEffect, useState, useRef } from "react";
import { Table, Select, message, Button, Modal } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import { formatbirthday, showToast } from "../../util/helper";
import Spinner from "../../Page/client/components/spinner";
import { getColumnSearchProps } from "./components/SearchFilter";
import EditUserModel from "./components/EditUserModel";
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
export default function AccountUser() {
  const [alluser, setAlluser] = useState([]);
  const overflowX = useSelector((state) => state.layoutReducer.overflowX);
  const [showContent, setshowContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchInput = useRef();
  const [currentUser, setCurrentUser] = useState();
  const [isReload, setIsReload] = useState(false);
  useEffect(() => {
    loadUsers();
    setIsReload(false)
  }, [isReload]);

  async function loadUsers() {
    const response = await sendGetRequest(`${baseURL}/user/customer`);
    if (response.status == "success") {
      setAlluser(response.data);
      setshowContent(true);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }
  async function deleteUser(id) {
    const postData = {
      data: {
        id: id,
      },
    };
    const response = await sendPostRequest(`${baseURL}/user/delete`, postData);
    if (response.status == "success") {
      message.success("Delete Admin successfully");
      loadUsers();
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
      key: "status",
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
        loadUsers();
      } else {
        message.error("There's a mistake !!");
      }
    }
  };

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
  return (
    <>
      <div className="bg-white p-3 rounded">
        <h5 className="mb-3">Manage Users</h5>
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
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
