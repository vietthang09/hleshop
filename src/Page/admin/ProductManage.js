import React, { useEffect, useRef, useState } from "react";
import { Table, Tag } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal } from "antd";
const { confirm } = Modal;
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";
import { formatdolla, showToast } from "../../util/helper";
import EditProduct from "./components/EditProduct";
import { getColumnSearchProps } from "./components/SearchFilter";
export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const searchInput = useRef();
  const [filterCategory, setfilterCategory] = useState();
  const [errorList, setErrorList] = useState({
    name: false,
    trademark: false,
    categoryId: false,
    price: false,
    image: false,
    imageDes: false,
    description: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function loadProducts() {
    const response = await sendGetRequest(`${baseURL}/product/all`);
    if (response.status == "success") {
      let arrTmpCateGory = [];
      response.data.map((item, index) => {
        const posCategory = arrTmpCateGory.findIndex(x=>x.value === item.category_id);
        if(posCategory===-1){
            arrTmpCateGory.push({text:item.category_name,value:item.category_id})
        }
        if(index === response.data.length-1){
            setfilterCategory(arrTmpCateGory)
        }
      })

      setProducts(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }

  async function deleteProduct(id) {
    const data = { id: id };
    const response = await sendPostRequest(`${baseURL}/product/delete`, data);
    if (response.status == "success") {
      loadProducts();
      showToast("SUCCESS", "Product deleted successfully!");
    } else {
      showToast("ERROR", response.message);
    }
  }

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Are you sure delete this product?",
      icon: <ExclamationCircleFilled />,
      content: item.product_name,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteProduct(item.product_id);
      },
      onCancel() {
        //
      },
    });
  };

  const showModal = (item) => {
    setIsModalOpen(true);
    setCurrentProduct(item);
  };
  function validateProductInfo() {
    setErrorList((current) => ({
      ...current,
      product_name: currentProduct.product_name == "",
    }));
    setErrorList((current) => ({
      ...current,
      product_image: currentProduct.product_image == "",
    }));
    setErrorList((current) => ({
      ...current,
      trademark: currentProduct.trademark == "",
    }));
    setErrorList((current) => ({
      ...current,
      category_id: currentProduct.category_id == "0" || "",
    }));
    setErrorList((current) => ({
      ...current,
      product_price: currentProduct.product_price == "",
    }));
    setErrorList((current) => ({
      ...current,
      imageDes:
        currentProduct.image_description1 == "" ||
        currentProduct.image_description2 == "",
    }));
    setErrorList((current) => ({
      ...current,
      product_description: currentProduct.product_description == "",
    }));
  }
  const handleOk = async () => {
    validateProductInfo();
    if (
      errorList.name &&
      errorList.trademark &&
      errorList.categoryId &&
      errorList.price &&
      errorList.image &&
      errorList.imageDes &&
      errorList.description
    ) {
      showToast("WARNING", "There are some mistake!");
    } else {
      const data = { data: currentProduct };
      const response = await sendPostRequest(`${baseURL}/product/update`, data);
      if (response.status == "success") {
        showToast("SUCCESS", "Product updated successfully!");
        setIsModalOpen(false);
        loadProducts();
      } else {
        showToast("ERROR", response.message);
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "CATEGORY",
      key: "category",
      filters: filterCategory,            
      onFilter: (value, record) =>record.category_id === value,
      render: record=>
      <div style={{ textAlign: 'center', width: 100}}>
          <span >{record.category_name}</span>
      </div>
    },
    {
      title: "IMAGE",
      key: "image",
      render: (record) => {
        return (
          <img
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
            }}
            src={`http://localhost:3000/${record.product_image}`}
          />
        );
      },
    },
    {
      title: "NAME",
      key: "name",
      width: 600,
      ...getColumnSearchProps("product_name", searchInput),
    },
    {
      title: "TRADEMARK",
      key: "trademark",
      render: (record) => {
        return <span>{record.trademark}</span>;
      },
    },
    {
      title: "PRICE",
      key: "price",
      width: 100,
      sorter: (a, b) => a.product_price - b.product_price,
      render: (record) => {
        return <span>{formatdolla(record.product_price, "$")}</span>;
      },
    },
    {
      title: "DISCOUNT (%)",
      key: "discount",
      sorter: (a, b) => a.product_discount - b.product_discount,
      render: (record) => {
        return record.product_discount ? (
          <Tag color="green">-{record.product_discount}%</Tag>
        ) : (
          <Tag>-0%</Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: (record) => {
        return (
          <>
            <Button type="primary" onClick={() => showModal(record)}>
              Edit
            </Button>
            <Button
              className="ml-3"
              onClick={() => showDeleteConfirm(record)}
              type="dashed"
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <div className="bg-white p-3 rounded">
        <h5 className="mb-3">Manage Products</h5>
        <Table
          columns={columns}
          dataSource={products}
          size="small"
          locale={{ emptyText: "You don't have any orders yet" }}
        />

        <Modal
          title={`Editing ${currentProduct.product_name}`}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1500}
        >
          <EditProduct
            productInfo={currentProduct}
            setProductInfo={setCurrentProduct}
            errorList={errorList}
          />
        </Modal>
      </div>
    </>
  );
}
