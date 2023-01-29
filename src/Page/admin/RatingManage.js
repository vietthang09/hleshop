import React, { useEffect, useRef, useState } from "react";
import { Table, message, Button, Modal } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import Spinner from "../../Page/client/components/spinner";
import moment from "moment";
import { sendGetRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { formatdolla, showToast } from "../../util/helper";
import { getColumnSearchProps } from "./components/SearchFilter";

export default function RatingManage() {
  const [rating, setRating] = useState([]);
  const [loadingTable, setloadingTable] = useState(false);
  const searchInput = useRef();
  const [showContent, setshowContent] = useState(false);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const overflowX = useSelector((state) => state.layoutReducer.overflowX);
  const [itemTmp, setitemTmp] = useState();

  async function loadComments() {
    const response = await sendGetRequest(`${baseURL}/comment/allRating`);
    if (response.status == "success") {
        setRating(response.data);
        setshowContent(true);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

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
      title: "Price",
      key: "product_price",
      sorter: (a, b) => a.product_price - b.product_price,
      render: (record) => (
        <span>
          {formatdolla(record.product_price, "$")}
        </span>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      render: (record) => (
        <span>
          {[...Array(5)].map((star, innerIndex) => {
            if (record.rating >= 4) {
              return (
                <i
                  style={{ color: "#17A2B8" }}
                  key={innerIndex}
                  className={`${
                    innerIndex < record.rating ? "fas" : "far"
                  } fa-star`}
                ></i>
              );
            } else if (record.rating < 4 && record.rating >= 3) {
              return (
                <i
                  style={{ color: "#FFD700" }}
                  key={innerIndex}
                  className={`${
                    innerIndex < record.rating ? "fas" : "far"
                  } fa-star`}
                ></i>
              );
            } else {
              return (
                <i
                  style={{ color: "red" }}
                  key={innerIndex}
                  className={`${
                    innerIndex < record.rating ? "fas" : "far"
                  } fa-star`}
                ></i>
              );
            }
          })}
        </span>
      ),
    },
  ];

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <>
      <div className="bg-white p-3 rounded">
        <h5 className="mb-3">Manage Ratings</h5>
        {showContent ? (
          <div>
            <Table
              showSorterTooltip={{ title: "Tap to sort" }}
              columns={columns}
              dataSource={rating} 
              loading={loadingTable}
              style={overflowX ? { overflowX: "scroll" } : null}
            />

            {/* {ModalDeleteSale()} */}
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
