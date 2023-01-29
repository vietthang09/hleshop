import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Tag, Upload } from "antd";
import { baseURL } from "../../../util/constants";
import { sendGetRequest, sendPostRequest } from "../../../util/fetchAPI";
import { showToast } from "../../../util/helper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
let nextId = 1;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function CreateProductDescription({
  productInfo,
  setProductInfo,
  update,
  setUpdate,
  errorList,
  setErrorList,
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [characteristic, setCharacteristic] = useState([]);
  const [recommendAtt, setRecommendAtt] = useState([]);
  const [currentEditAtt, setCurrentEditAtt] = useState(1);
  const [createdChar, setCreatedChar] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [newAttribute, setNewAttribute] = useState({
    type: "",
    unit: "",
  });
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
    action: `${baseURL}/uploads/product-images`,
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

  function createCharacteristic() {
    setCharacteristic([
      ...characteristic,
      {
        id: nextId++,
        categoryId: productInfo.categoryId,
        attributeId: "",
        type: "",
        value: "",
        unit: "",
      },
    ]);
  }

  function deleteCharacteristic(id) {
    setCharacteristic(characteristic.filter((e) => e.id != id));
  }

  async function handleInputCharacteristic(id, attribute, value) {
    setCurrentEditAtt(id);
    if (attribute == "type") {
      if (value.length == 0) {
        setRecommendAtt([]);
      } else {
        const response = await sendGetRequest(
          `${baseURL}/attribute/keyword/${value}`
        );
        if (response.status == "success") {
          setRecommendAtt(response.data);
          if (value.length != 0 && response.data.length < 1) {
            setShowCreateButton(true);
          } else {
            setShowCreateButton(false);
          }
        } else {
          showToast("ERROR", response.message);
        }
      }
    }
    const tempArr = [...characteristic];
    const foundItem = tempArr.find((e) => e.id == id);
    foundItem[attribute] = value;
    setCharacteristic(tempArr);
  }

  function onClickSuggestedAtt(item) {
    const tempArr = [...characteristic];
    const foundItem = tempArr.find((e) => e.id == currentEditAtt);
    foundItem["attributeId"] = item.attribute_id;
    foundItem["type"] = item.type;
    foundItem["unit"] = item.unit;
    setRecommendAtt([]);
  }

  async function createAttribute() {
    const postData = {
      data: {
        type: newAttribute.type,
        unit: newAttribute.unit,
      },
    };
    if(newAttribute.type == ""){
      showToast("WARNING", "Type cannot be blank");
    } else {
      const response = await sendPostRequest(
        `${baseURL}/attribute/create`,
        postData
      );
      if (response.status == "success") {
        showToast("SUCCESS", "Attribute created successfully!");
        setNewAttribute({ type: "", unit: "" });
      } else {
        showToast("ERROR", "There are some mistake!");
      }
    }
  }

  function validateProductInfo() {
    setErrorList((current) => ({ ...current, name: productInfo.name == "" }));
    setErrorList((current) => ({ ...current, image: productInfo.image == "" }));
    setErrorList((current) => ({
      ...current,
      trademark: productInfo.trademark == "",
    }));
    setErrorList((current) => ({
      ...current,
      categoryId: productInfo.categoryId == "0" || "",
    }));
    setErrorList((current) => ({
      ...current,
      price: productInfo.price == "",
    }));
    setErrorList((current) => ({
      ...current,
      imageDes: fileList.length < 2,
    }));
    setErrorList((current) => ({
      ...current,
      characteristics: characteristic.length == 0,
    }));
    setErrorList((current) => ({
      ...current,
      description: productInfo.description == "",
    }));
  }
  async function onClickAddProduct() {
    validateProductInfo();
    if (
      errorList.name ||
      errorList.trademark ||
      errorList.categoryId ||
      errorList.price ||
      errorList.image ||
      errorList.imageDes ||
      errorList.characteristics ||
      errorList.description
    ) {
      showToast("WARNING", "There are some mistake!");
    } else {
      const data = { data: characteristic };
      const charResponse = await sendPostRequest(
        `${baseURL}/characteristic/create`,
        data
      );
      if (charResponse.status == "success") {
        const data = { data: productInfo };
        const prodResponse = await sendPostRequest(
          `${baseURL}/product/create`,
          data
        );
        if (prodResponse.status == "success") {
          setProductInfo((current) => ({ ...current, id: prodResponse.data }));
          const data = {
            data: {
              productId: prodResponse.data,
              attHash: charResponse.data,
              total: productInfo.total,
            },
          };
          const response = await sendPostRequest(
            `${baseURL}/characteristic-product/create`,
            data
          );
          if (response.status == "success") {
            showToast("SUCCESS", "Product added successfully");
            setUpdate(true);
            setCharacteristic([]);
            loadCreatedCharacteristics();
          } else {
            showToast("ERROR", response.message);
          }
        } else {
          showToast(prodResponse.message);
        }
      } else {
        showToast(charResponse.message);
      }
    }
  }

  async function onClickAddChatacteristic() {
    const data = { data: characteristic };
    const charResponse = await sendPostRequest(
      `${baseURL}/characteristic/create`,
      data
    );
    if (charResponse.status == "success") {
      const data = {
        data: {
          productId: productInfo.id,
          attHash: charResponse.data,
          total: productInfo.total,
        },
      };
      const response = await sendPostRequest(
        `${baseURL}/characteristic-product/create`,
        data
      );
      if (response.status == "success") {
        showToast("SUCCESS", "Characteristics added successfully");
        setCharacteristic([]);
        loadCreatedCharacteristics();
      } else {
        showToast("ERROR", response.message);
      }
    } else {
      showToast("ERROR", charResponse.message);
    }
  }

  async function loadCreatedCharacteristics() {
    const response = await sendGetRequest(
      `${baseURL}/attribute/id/${productInfo.id}`
    );
    if (response.status == "error") {
      showToast("ERROR", response.message);
    } else {
      setCreatedChar(response.data);
    }
  }
  useEffect(() => {
    if (fileList.length > 0 && fileList[0].response != undefined) {
      if (fileList.length == 1 && fileList[0].response != undefined) {
        setProductInfo((current) => ({
          ...current,
          imageDes1:
            "/Upload/ProductDescription/" + fileList[0].response.msg.filename,
        }));
      } else if (
        fileList.length == 2 &&
        fileList[0].response != undefined &&
        fileList[1].response != undefined
      ) {
        setProductInfo((current) => ({
          ...current,
          imageDes1:
            "/Upload/ProductDescription/" + fileList[0].response.msg.filename,
          imageDes2:
            "/Upload/ProductDescription/" + fileList[1].response.msg.filename,
        }));
      }
    }
  }, [fileList]);

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
    <div className="bg-white px-3 py-4 rounded row">
      <div className="col-12">
        <label for="product_images" class="form-label">
          <h6>Product Images</h6>
        </label>
        {errorList.imageDes && (
          <Tag className="ml-2" color="gold">
            Please upload 2 description pictures
          </Tag>
        )}
        <Upload {...imageUploadProps} disabled={update}>
          {fileList.length > 1 ? null : uploadButton}
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
        <span>
          You need to add at least 2 images. Pay attention to the quality of the
          pictures you add, comply with the background color standards. Pictures
          must be in certain dimensions. Notice that the product shows all the
          details
        </span>
      </div>
      <div className="col-12">
        <label for="product_characteristics" class="form-label mt-4">
          <h6>Product Characteristics</h6>
        </label>
        {errorList.characteristics && (
          <Tag className="ml-2" color="gold">
            Please enter at least 1 characteristic
          </Tag>
        )}
        <div className="my-3">
          {update &&
            createdChar.map((item, index) => {
              return (
                <span className="border p-2 mr-3" style={{ cursor: "pointer" }}>
                  {item.values}
                </span>
              );
            })}
        </div>
        {characteristic.map((item) => {
          return (
            <div className="row mb-2" key={item.id}>
              <div className="col-lg-4">
                <input
                  type="text"
                  class="form-control rounded"
                  placeholder="Type"
                  value={item.type}
                  onChange={(e) => {
                    handleInputCharacteristic(item.id, "type", e.target.value);
                  }}
                />
                {item.id == currentEditAtt &&
                  recommendAtt.map((item) => {
                    return (
                      <li
                        className="list-group-item"
                        key={item.attribute_id}
                        onClick={() => onClickSuggestedAtt(item)}
                      >
                        {item.type}
                      </li>
                    );
                  })}
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  class="form-control rounded"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => {
                    handleInputCharacteristic(item.id, "value", e.target.value);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <input
                  type="text"
                  class="form-control rounded"
                  placeholder="Unit"
                  value={item.unit}
                  onChange={(e) => {
                    handleInputCharacteristic(item.id, "unit", e.target.value);
                  }}
                />
              </div>
              <div className="col-lg-1">
                <button
                  className="btn btn-secondary"
                  onClick={() => deleteCharacteristic(item.id)}
                >
                  <i class="fa fa-minus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          );
        })}
        <button
          className="d-block btn border rounded"
          onClick={() => createCharacteristic()}
        >
          <i class="fa fa-plus" aria-hidden="true"></i>
        </button>
        <div className="mt-3 row">
          <span className="col-12">
            If the attribute is not available, create a new one
          </span>
          <input
            type="text"
            class="ml-3 form-control rounded col-3"
            placeholder="Type"
            value={newAttribute.type}
            onChange={(e) =>
              setNewAttribute((current) => ({
                ...current,
                type: e.target.value,
              }))
            }
          />
          <input
            type="text"
            class="ml-3 form-control rounded col-3"
            placeholder="Unit"
            value={newAttribute.unit}
            onChange={(e) =>
              setNewAttribute((current) => ({
                ...current,
                unit: e.target.value,
              }))
            }
          />
          <button
            className="ml-3 btn btn-info rounded"
            onClick={() => createAttribute()}
          >
            Create
          </button>
        </div>
      </div>
      <div className="col-12 mt-4">
        <label for="product_description" class="form-label">
          <h6>Description</h6>
        </label>
        {errorList.description && (
          <Tag className="ml-2" color="gold">
            Please enter product description
          </Tag>
        )}
        <CKEditor
          disabled={update}
          editor={ClassicEditor}
          config={{
            extraPlugins: [uploadPlugin],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setProductInfo((current) => ({
              ...current,
              description: data,
            }));
          }}
        />
      </div>
      <div className="mt-3 col-12 d-flex">
        {update ? (
          <button
            className="btn btn-info rounded"
            onClick={() => onClickAddChatacteristic()}
          >
            Add Characteristics
          </button>
        ) : (
          <button
            className="btn btn-info rounded"
            onClick={() => onClickAddProduct()}
          >
            Add Product
          </button>
        )}
      </div>
    </div>
  );
}
