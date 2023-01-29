import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { baseURL } from "../../../util/constants";
import { sendGetRequest } from "../../../util/fetchAPI";
import { formatdolla, showToast } from "../../../util/helper";
import { Modal, Tag, Upload } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Link } from "react-router-dom";
const PriceDiscount = (price, discount) => {
  var prdc = price - price * (discount / 100);
  return prdc;
};
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function EditProduct({
  productInfo,
  setProductInfo,
  errorList,
}) {
  const [categories, setCategories] = useState([]);
  const [characteristic, setCharacteristic] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [productImageList, setProductImageList] = useState([]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Replace
      </div>
    </div>
  );
  const productImageProps = {
    action: `${baseURL}/uploads/product-image`,
    name: "image",
    listType: "picture-card",
    fileList: productImage,
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
    onChange: ({ fileList: newFileList }) => setProductImage(newFileList),
  };

  const productImagesProps = {
    action: `${baseURL}/uploads/product-images`,
    name: "image",
    listType: "picture-card",
    fileList: productImageList,
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
    onChange: ({ fileList: newFileList }) => setProductImageList(newFileList),
  };

  const handleCancel = () => setPreviewOpen(false);
  async function loadCategories() {
    const response = await sendGetRequest(`${baseURL}/category/get-categories`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", response.message);
    }
  }

  async function loadCharacteristics() {
    const response = await sendGetRequest(
      `${baseURL}/attribute/id/${productInfo.product_id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setCharacteristic(response.data);
    }
  }

  useEffect(() => {
    loadCategories();
    loadCharacteristics();
    setProductImage([]);
    setProductImageList([]);
  }, []);

  useEffect(() => {
    if (productImage.length > 0 && productImage[0].response != undefined) {
      setProductInfo((current) => ({
        ...current,
        product_image:
          "/Upload/ImageProduct/" + productImage[0].response.msg.filename,
      }));
    }
  }, [productImage]);

  useEffect(() => {
    if (
      productImageList.length > 0 &&
      productImageList[0].response != undefined
    ) {
      if (
        productImageList.length == 1 &&
        productImageList[0].response != undefined
      ) {
        setProductInfo((current) => ({
          ...current,
          image_description1:
            "/Upload/ProductDescription/" +
            productImageList[0].response.msg.filename,
        }));
      } else if (
        productImageList.length == 2 &&
        productImageList[0].response != undefined &&
        productImageList[1].response != undefined
      ) {
        setProductInfo((current) => ({
          ...current,
          image_description1:
            "/Upload/ProductDescription/" +
            productImageList[0].response.msg.filename,
          image_description2:
            "/Upload/ProductDescription/" +
            productImageList[1].response.msg.filename,
        }));
      }
    }
  }, [productImageList]);

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("image", file);
            fetch(`${baseURL}/uploads/product-images`, {
              method: "post",
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `http://localhost:3000/Upload/ProductDescription/${res.msg.filename}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="row">
      <div className="col-6 bg-white px-3 py-4 rounded row">
        <div className="col-12 mb-4">
          <label class="form-label">
            <h6>Product Image</h6>
          </label>
          {errorList.image && (
            <Tag className="ml-2" color="gold">
              Please upload a photo
            </Tag>
          )}
          <div className="d-flex">
            {productImage.length == 0 && (
              <img
                width={100}
                height={100}
                className="mr-2"
                src={`http://localhost:3000/${productInfo.product_image}`}
              />
            )}
            <Upload {...productImageProps}>
              {productImage.length > 0 ? null : uploadButton}
            </Upload>
          </div>

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
          <label for="product_name" class="form-label">
            <h6>Product Name</h6>
          </label>
          {errorList.name && (
            <Tag className="ml-2" color="gold">
              Please enter product name
            </Tag>
          )}
          <input
            type="text"
            class="form-control rounded"
            id="product_name"
            placeholder="Product Name"
            value={productInfo.product_name}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                product_name: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6">
          <label for="product_trademark" class="form-label">
            <h6>Product Trademark</h6>
          </label>
          {errorList.trademark && (
            <Tag className="ml-2" color="gold">
              Please enter trademark
            </Tag>
          )}
          <input
            type="text"
            class="form-control rounded"
            id="product_trademark"
            placeholder="Trademark"
            value={productInfo.trademark}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                trademark: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6">
          <label for="product_category" class="form-label">
            <h6>Category</h6>
          </label>
          {errorList.categoryId && (
            <Tag className="ml-2" color="gold">
              Please select a category
            </Tag>
          )}
          <select
            class="form-control rounded"
            aria-label="Default select example"
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                category_id: e.target.value,
              }))
            }
          >
            <option defaultChecked value={0}>
              Select a category
            </option>
            {categories.map((item) => {
              return (
                <option
                  key={item.category_id}
                  value={item.category_id}
                  selected={item.category_id == productInfo.category_id}
                >
                  {item.category_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col-6">
          <label for="product_price" class="form-label mt-4">
            <h6>Product Price</h6>
          </label>
          {errorList.price && (
            <Tag className="ml-2" color="gold">
              Please enter product price
            </Tag>
          )}
          <input
            type="number"
            class="form-control rounded"
            id="product_price"
            placeholder="0.0"
            value={productInfo.product_price}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                product_price: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6">
          <label for="product_discount" class="form-label mt-4">
            <h6>Discount</h6>
          </label>
          <input
            type="number"
            class="form-control rounded"
            id="product_discount"
            placeholder="0"
            value={productInfo.product_discount}
            onChange={(e) =>
              setProductInfo((current) => ({
                ...current,
                product_discount: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-4">
          <label for="product_preview" class="form-label mt-4">
            <h6>Product Review</h6>
          </label>
          <div className="product-item bg-light mb-4">
            <img
              className="img-fluid w-100"
              src={
                productInfo.product_image == ""
                  ? "https://digital-marketing.vn/wp-content/uploads/2021/09/alt-text-la-gi.png"
                  : `http://localhost:3000/${productInfo.product_image}`
              }
              alt="preview"
              style={{ padding: "20px" }}
            />
            <div className="text-center py-3 px-2">
              <p
                className="text-truncate text-center"
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
              {productInfo.product_discount != "" ? (
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <h5>
                    {formatdolla(
                      PriceDiscount(
                        parseInt(productInfo.product_price),
                        parseInt(productInfo.product_discount)
                      ),
                      "$"
                    )}
                  </h5>
                  <h6 className="text-muted ml-2">
                    <del>
                      {formatdolla(parseInt(productInfo.product_price), "$")}
                    </del>
                  </h6>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <h5>
                    {formatdolla(parseInt(productInfo.product_discount), "$")}
                  </h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-6 bg-white px-3 py-4 rounded row">
        <div className="col-12">
          <label for="product_images" class="form-label">
            <h6>Product Images</h6>
          </label>
          {errorList.imageDes && (
            <Tag className="ml-2" color="gold">
              Please upload 2 description pictures
            </Tag>
          )}
          <div className="d-flex">
            {productImageList.length == 0 && (
              <>
                <img
                  width={100}
                  height={100}
                  className="mr-2"
                  src={`http://localhost:3000/${productInfo.image_description1}`}
                />
                <img
                  width={100}
                  height={100}
                  className="mr-2"
                  src={`http://localhost:3000/${productInfo.image_description2}`}
                />
              </>
            )}

            <Upload {...productImagesProps}>
              {productImageList.length > 1 ? null : uploadButton}
            </Upload>
          </div>
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
          <span>
            You need to add at least 2 images. Pay attention to the quality of
            the pictures you add, comply with the background color standards.
            Pictures must be in certain dimensions. Notice that the product
            shows all the details
          </span>
        </div>
        <div className="col-12">
          <label
            for="product_characteristics"
            className="form-label d-block mb-3"
          >
            <h6>Product Characteristics</h6>
          </label>
          {characteristic.map((item, index) => {
            return (
              <span
                className="border p-2 mr-3"
                style={{ cursor: "pointer" }}
                key={index}
              >
                {`${item.values} (${item.total})`}
              </span>
            );
          })}
        </div>
        <div className="col-12 mt-4">
          <label for="product_description" className="form-label">
            <h6>Description</h6>
          </label>
          {errorList.description && (
            <Tag className="ml-2" color="gold">
              Please enter product description
            </Tag>
          )}
          <CKEditor
            editor={ClassicEditor}
            data={productInfo.product_description}
            config={{
              extraPlugins: [uploadPlugin],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setProductInfo((current) => ({
                ...current,
                product_description: data,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
