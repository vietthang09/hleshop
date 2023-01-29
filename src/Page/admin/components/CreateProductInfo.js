import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Tag, Upload } from "antd";
import { baseURL } from "../../../util/constants";
import { sendGetRequest } from "../../../util/fetchAPI";
import { formatdolla, showToast } from "../../../util/helper";
import { Link } from "react-router-dom";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function CreateProductInfo({
  productInfo,
  setProductInfo,
  update,
  errorList,
  setErrorList,
}) {
  const [categories, setCategories] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const imageUploadProps = {
    action: `${baseURL}/uploads/product-image`,
    name: "image",
    listType: "picture-card",
    fileList: fileList,
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    },
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
  };
  const PriceDiscount = (price, discount) => {
    var prdc = price - price * (discount / 100);
    return prdc;
  };
  async function loadCategories() {
    const response = await sendGetRequest(`${baseURL}/category/all`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }

  async function checkValidName(productName) {
    const response = await sendGetRequest(
      `${baseURL}/product/check-valid-name/${productName}`
    );
    if (response.status == "success") {
      if (response.data == "OK") {
        setProductInfo((current) => ({
          ...current,
          name: productName,
        }));
      } else {
        setProductInfo((current) => ({
          ...current,
          name: "",
        }));
        showToast("WARNING", response.data);
      }
    } else {
      showToast("ERROR", response.message);
    }
  }

  useEffect(() => {
    if (fileList.length > 0 && fileList[0].response != undefined) {
      setProductInfo((current) => ({
        ...current,
        image: "/Upload/ImageProduct/" + fileList[0].response.msg.filename,
      }));
    }
  }, [fileList]);
  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <>
      <div className="bg-white px-3 py-4 rounded row">
        <div className="col-12 mb-4">
          <label className="form-label">
            <h6>Product Image</h6>
          </label>
          {errorList.image && (
            <Tag className="ml-2" color="gold">
              Please upload a photo
            </Tag>
          )}
          <Upload {...imageUploadProps} disabled={update}>
            {fileList.length > 0 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </div>

        <div className="col-12 mb-4">
          <label for="product_name" className="form-label">
            <h6>Product Name</h6>
          </label>
          {errorList.name && (
            <Tag className="ml-2" color="gold">
              Please enter product name
            </Tag>
          )}
          <input
            type="text"
            className="form-control rounded"
            id="product_name"
            placeholder="Product Name"
            disabled={update}
            onChange={(e) => {
              checkValidName(e.target.value);
            }}
          />
        </div>
        <div className="col-6">
          <label for="product_trademark" className="form-label">
            <h6>Product Trademark</h6>
          </label>
          {errorList.trademark && (
            <Tag className="ml-2" color="gold">
              Please enter trademark
            </Tag>
          )}
          <input
            type="text"
            className="form-control rounded"
            id="product_trademark"
            placeholder="Trademark"
            disabled={update}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                trademark: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6">
          <label for="product_category" className="form-label">
            <h6>Category</h6>
          </label>
          {errorList.categoryId && (
            <Tag className="ml-2" color="gold">
              Please select a category
            </Tag>
          )}
          <select
            className="form-control rounded"
            aria-label="Default select example"
            disabled={update}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                categoryId: e.target.value,
              }))
            }
          >
            <option defaultChecked value={0}>
              Select a category
            </option>
            {categories.map((item) => {
              return (
                <option key={item.category_id} value={item.category_id}>
                  {item.category_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col-6">
          <label for="product_price" className="form-label mt-4">
            <h6>Product Price</h6>
          </label>
          {errorList.price && (
            <Tag className="ml-2" color="gold">
              Please enter product price
            </Tag>
          )}
          <input
            type="number"
            className="form-control rounded"
            id="product_price"
            placeholder="0.0"
            disabled={update}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                price: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6">
          <label for="product_discount" className="form-label mt-4">
            <h6>Discount</h6>
          </label>
          <input
            type="number"
            className="form-control rounded"
            id="product_discount"
            placeholder="0"
            disabled={update}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                discount: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-4">
          <label for="product_preview" className="form-label mt-4">
            <h6>Product Review</h6>
          </label>
          <div className="product-item bg-light mb-4">
            <img
              className="img-fluid w-100"
              src={
                productInfo.image == ""
                  ? "https://digital-marketing.vn/wp-content/uploads/2021/09/alt-text-la-gi.png"
                  : `http://localhost:3000/${productInfo.image}`
              }
              alt="preview"
              style={{ padding: "20px" }}
            />
            <div className="text-center py-3 px-2">
              <p
                className="text-truncate"
                style={{
                  width: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link className="h6 text-decoration-none">
                  {productInfo.product_name}
                </Link>
              </p>
              {productInfo.discount != "" ? (
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <h5>
                    {formatdolla(
                      PriceDiscount(
                        parseInt(productInfo.price),
                        parseInt(productInfo.discount)
                      ),
                      "$"
                    )}
                  </h5>
                  <h6 className="text-muted ml-2">
                    <del>{formatdolla(parseInt(productInfo.price), "$")}</del>
                  </h6>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <h5>{formatdolla(parseInt(productInfo.price), "$")}</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
