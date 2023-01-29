import React, { useEffect, useRef, useState } from "react";
import { Table, message, Button, Modal } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import Spinner from "../../Page/client/components/spinner";
import moment from "moment";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { formatbirthday, formatdate, showToast } from "../../util/helper";
import { getColumnSearchProps } from "./components/SearchFilter";
import dayjs from 'dayjs';

export default function CommentManage() {
  const [comments, setComments] = useState([]);
  const [loadingTable, setloadingTable] = useState(false);
  const searchInput = useRef();
  const [showContent, setshowContent] = useState(false);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const overflowX = useSelector((state) => state.layoutReducer.overflowX);
  const [itemTmp, setitemTmp] = useState();

  async function loadComments() {
    const response = await sendGetRequest(`${baseURL}/comment/all`);
    if (response.status == "success") {
      setComments(response.data);
      setshowContent(true);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const handleDeleteSale = async () => {
    const res = await Axios({
      method: "post",
      url: "http://localhost:5000/comment/deleteComment",
      data: {
        comment_id: itemTmp.comment_id,
      },
    }).then((result) => result.data);
    console.log(res)
    if (res.status) {
      if (res.status === "success") {
        message.success("Successful");
        setshowModalDelete(false);
        loadComments();
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
          title={`Delete comment ${itemTmp.comment_id}`}
          visible={showModalDelete}
          onCancel={() => {
            setshowModalDelete(false);
          }}
          onOk={handleDeleteSale}
          cancelText="Exit"
          okText="Chắc chắn"
        >
          <p>Are you sure you want to delete this comment.</p>
        </Modal>
      )}
    </div>
  );

  const columns = [
    {
      title: "Email",
      key: "user_email",
      ...getColumnSearchProps("user_email", searchInput),
    },
    {
      title: "Full name",
      key: "user_fullname",
      ...getColumnSearchProps("user_fullname", searchInput),
    },
    {
      title: "Product image",
      key: "product_image",
      render: (record) => (
        <span>
          <img src={record.product_image} width={100} />
        </span>
      ),
    },
    {
      title: "Product name",
      key: "product_name",
      ...getColumnSearchProps("product_name", searchInput),
    },
    {
      title: "Comment",
      key: "comment_content",
      render: (record) => <span>{record.comment_content}</span>,
    },
    {
      title: "Rating",
      key: "comment_star",
      sorter: (a, b) => a.comment_star - b.comment_star,
      render: (record) => (
        <span>
          {[...Array(5)].map((star, innerIndex) => {
            if (record.comment_star >= 4) {
              return (
                <i
                  style={{ color: "#17A2B8" }}
                  key={innerIndex}
                  className={`${
                    innerIndex < record.comment_star ? "fas" : "far"
                  } fa-star`}
                ></i>
              );
            } else if (record.comment_star < 4 && record.comment_star >= 3) {
              return (
                <i
                  style={{ color: "#FFD700" }}
                  key={innerIndex}
                  className={`${
                    innerIndex < record.comment_star ? "fas" : "far"
                  } fa-star`}
                ></i>
              );
            } else {
              return (
                <i
                  style={{ color: "red" }}
                  key={innerIndex}
                  className={`${
                    innerIndex < record.comment_star ? "fas" : "far"
                  } fa-star`}
                ></i>
              );
            }
          })}
        </span>
      ),
    },
    {
      title: "Time",
      key: "create_at",
      render: (record) => <span>{formatdate(record.created_at)}</span>,
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

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <>
      <div className="bg-white p-3 rounded">
        <h5 className="mb-3">Manage Comments</h5>
        {showContent ? (
          <div>
            <Table
              showSorterTooltip={{ title: "Tap to sort" }}
              columns={columns}
              dataSource={comments}
              loading={loadingTable}
              style={overflowX ? { overflowX: "scroll" } : null}
            />

            {ModalDeleteSale()}
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
