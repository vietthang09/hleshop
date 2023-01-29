import { Button, Table, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { baseURL } from "../../util/constants";
import { sendGetRequest } from "../../util/fetchAPI";
import { showToast } from "../../util/helper";
import EditProductModel from "./components/EditProductModel";
import { getColumnSearchProps } from "./components/SearchFilter";
export default function Warehouse() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();
  const [isReload, setIsReload] = useState(false);
  const [filterCategory, setfilterCategory] = useState();
  const searchInput = useRef();

  async function getProducts() {
    const response = await sendGetRequest(`${baseURL}/product/get-total`);
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
      showToast("ERROR", "There are some mistake!");
    }
  }

  const columns = [
    {
      title: "Category",
      key: "category_name",
      filters: filterCategory,            
      onFilter: (value, record) =>record.category_id === value,
      render: record=>
      <div style={{ textAlign: 'center'}}>
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
      ...getColumnSearchProps("product_name", searchInput),
    },
    {
      title: "TOTAL",
      key: "total",
      sorter: (a, b) => a.product_total - b.product_total,
      render: (record) => {
        return record.product_total <= 10 ? (
          <Tag color="red">{record.product_total}</Tag>
        ) : (
          <Tag color="green">{record.product_total}</Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: (record) => {
        return (
          <>
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setCurrentProduct(record);
              }}
            >
              Add
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getProducts();
    setIsReload(false);
  }, [isReload]);

  return (
    <div className="bg-white p-3 rounded">
      <h5 className="mb-3">Manage Warehouse</h5>
      <Table
        columns={columns}
        dataSource={products}
        size="small"
        locale={{ emptyText: "You don't have any orders yet" }}
      />
      {currentProduct && (
        <EditProductModel
          product={currentProduct}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsReload={setIsReload}
        />
      )}
    </div>
  );
}
