import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  message,
  Drawer,
  Form,
  Input,
  Button,
  Modal,
  Upload,
} from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import Spinner from "../../Page/client/components/spinner";
import { getColumnSearchProps } from "./components/SearchFilter";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { baseURL } from "../../util/constants";
import { sendGetRequest, sendPostRequest } from "../../util/fetchAPI";
import { showToast } from "../../util/helper";

export default function CategoryManage() {
  const [AllCategory, setAllCategory] = useState([]);
  const searchInput = useRef();
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [dataAdd, setdataAdd] = useState({
    name: "",
    image: "",
  });
  const [showContent, setshowContent] = useState(false);
  const [drawerEdit, setdrawerEdit] = useState(false);
  const overflowX = useSelector((state) => state.layoutReducer.overflowX);
  const [loadingBtn, setloadingBtn] = useState(false);
  const [showModalAdd, setshowModalAdd] = useState(false);
  const [logoCategory, setlogoCategory] = useState([]);
  const [category_image, setCategory_image] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);
  async function getCategories() {
    const response = await sendGetRequest(`${baseURL}/category/all`);
    if (response.status == "success") {
      setAllCategory(response.data);
      setshowContent(true);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function deleteCategory(id) {
    const postData = { data: id };
    const response = await sendPostRequest(
      `${baseURL}/category/delete`,
      postData
    );
    if (response.status == "success") {
      showToast("SUCCESS", "Category deleted successfully!");
      getCategories();
      setdrawerEdit(false);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const onChangeImage = ({ fileList: newFileList }) => {
    setlogoCategory(newFileList);
  };

  useEffect(() => {
    if (logoCategory.length > 0 && logoCategory[0].response != undefined) {
      formAdd.setFieldsValue({
        logo: "/Upload/ImageCategory/" + logoCategory[0].response.msg.filename,
      });
      setdataAdd({
        ...dataAdd,
        image: "/Upload/ImageCategory/" + logoCategory[0].response.msg.filename,
      });
    }
  }, [logoCategory]);

  const onChangeImageEdit = ({ fileList: newFileList }) => {
    setCategory_image(newFileList);
  };

  useEffect(() => {
    if (category_image.length > 0 && category_image[0].response != undefined) {
      formEdit.setFieldsValue({
        category_image:
          "/Upload/ImageCategory/" + category_image[0].response.msg.filename,
      });
    }
  }, [category_image]);
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  async function handlerEditCategory(values) {
    setloadingBtn(true);
    const postData = {
      data: {
        name: values.category_name,
        image: values.category_image,
        id: values.category_id,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/category/update`,
      postData
    );
    if (response.status == "success") {
      message.success("Update successful");
      getCategories();
      setloadingBtn(false);
    } else {
      message.error("There's a mistake !!");
      setloadingBtn(false);
    }
  }

  async function addCategory() {
    setloadingBtn(true);
    const data = { data: dataAdd };
    const response = await sendPostRequest(`${baseURL}/category/create`, data);
    if (response.status == "success") {
      message.success("Successfully added new");
      getCategories();
      setdataAdd({});
      formAdd.setFieldsValue({ name: "", status: null });
      setloadingBtn(false);
      setshowModalAdd(false);
    } else {
      message.error("There's a mistake !!");
      setloadingBtn(false);
    }
  }

  const showEditDrawer = () => (
    <Drawer
      title="Edit category"
      placement="right"
      width={overflowX ? "100%" : 520}
      getContainer={false}
      onClose={() => setdrawerEdit(false)}
      visible={drawerEdit}
    >
      <Form
        form={formEdit}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        onFinish={handlerEditCategory}
      >
        <Form.Item label="ID" name="category_id">
          <Input placeholder="ID" disabled={true} />
        </Form.Item>
        <Form.Item
          label="Category name"
          name="category_name"
          rules={[{ required: true, message: "Category name can't be blank!" }]}
        >
          <Input placeholder="Category name" />
        </Form.Item>
        <Form.Item
          label="Image category"
          name="category_image"
          rules={[
            {
              required: true,
              message: "There must be a photo assigned to the category!",
            },
          ]}
        >
          <ImgCrop rotate grid aspect={1.5 / 2.2}>
            <Upload
              action={`${baseURL}/uploads/category`}
              listType="picture-card"
              name="image"
              fileList={category_image}
              onChange={onChangeImageEdit}
              onPreview={onPreview}
            >
              {category_image.length < 1 && (
                <div>
                  <UploadOutlined />
                  <span>Upload photos</span>
                </div>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item
          style={{ paddingTop: 20 }}
          wrapperCol={{ span: 12, offset: 10 }}
        >
          <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
            <CheckOutlined />
          </Button>
          <Button
            type="primary"
            danger
            style={{ marginLeft: 20 }}
            onClick={() => deleteCategory(formEdit.getFieldValue().category_id)}
          >
            <DeleteOutlined />
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );

  const ModalAddNew = () => (
    <Modal
      title="Add new category"
      visible={showModalAdd}
      onCancel={() => setshowModalAdd(false)}
      footer={false}
    >
      <Form
        form={formAdd}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 12 }}
        onFinish={addCategory}
      >
        <Form.Item
          label="Product category name"
          name="category_name"
          rules={[{ required: true, message: "Enter product category name" }]}
        >
          <Input
            placeholder="Enter product category name"
            value={dataAdd.name}
            onChange={(e) => setdataAdd({ ...dataAdd, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Logo"
          name="category_image"
          // rules={[
          //   {
          //     required: true,
          //     message: "You must choose a logo for the product category",
          //   },
          // ]}
        >
          <ImgCrop rotate grid aspect={1.5 / 2.2}>
            <Upload
              action={`${baseURL}/uploads/category`}
              listType="picture-card"
              name="image"
              fileList={logoCategory}
              onChange={onChangeImage}
            >
              {logoCategory.length === 0 && (
                <div>
                  <UploadOutlined />
                  <span>Upload photos</span>
                </div>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item
          style={{ paddingTop: 20 }}
          wrapperCol={{ span: 12, offset: 10 }}
        >
          <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
            Add new
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: "ID",
      key: "category_id ",
      render: (record) => <span>{record.category_id}</span>,
    },
    {
      title: "Category name",
      key: "category_name",
      ...getColumnSearchProps("category_name", searchInput),
    },
    {
      title: "Slug",
      key: "category_slug",
      render: (record) => <span>{record.category_slug}</span>,
    },
    {
      title: "Category image",
      key: "category_image",
      render: (record) => (
        <span>
          <img src={record.category_image} width={50} />
        </span>
      ),
    },
    {
      title: "Detail",
      key: "details",
      render: (record) => (
        <div style={{ paddingLeft: 15 }}>
          <Button
            type="default"
            onClick={() => {
              setdrawerEdit(true);
              formEdit.setFieldsValue(record);
              if (record.category_image) {
                setCategory_image([{ url: record.category_image }]);
              } else {
                setCategory_image([]);
              }
            }}
          >
            <InfoCircleOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white p-3 rounded">
        <div className="d-flex justify-content-between">
          <h5 className="mb-3">Manage Categories</h5>
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => setshowModalAdd(true)}
          >
            Add new Category
            <PlusCircleOutlined />
          </Button>
        </div>
        {showContent ? (
          <div>
            <Table
              dataSource={AllCategory}
              columns={columns}
              style={overflowX ? { overflowX: "scroll" } : null}
            />

            {ModalAddNew()}
            {showEditDrawer()}
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
