import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BarChartOutlined,
  DropboxOutlined,
  ContainerOutlined,
  PoweroffOutlined,
  GiftOutlined,
  DatabaseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import cookie from "react-cookies";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../../Page/client/components/spinner";
import HomeAdmin from "./HomeAdmin";
import AccountUser from "./AccountUser";
import AccountAdmin from "./AccountAdmin";
import ProductManage from "./ProductManage";
import CategoryManage from "./CategoryManage";
import AddProduct from "./AddProduct";
import SaleManage from "./SaleManage";
import Invoices from "./Invoices";
import CommentManage from "./CommentManage";
import Warehouse from "./Warehouse";
import RatingManage from "./RatingManage";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function Admin() {
  const [collapsed, setCollapsed] = useState(false);
  const [showContent, setshowContent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setshowContent(false);
    document.getElementsByClassName("Header-nav")[0].style.display = "none";
    document.getElementsByClassName("footer")[0].style.display = "none";
    document.getElementsByClassName("chatbot")[0].style.display = "none";
    checkAccountAdmin();
  }, []);

  const checkAccountAdmin = async () => {
    const token = cookie.load("token");
    const user = cookie.load("user");

    // console.log(token)
    if (token === undefined) {
      toast.error("Please login account admin!!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/loginadmin");
    } else if (user.user_rule === 1) {
      setshowContent(true);
      navigate("/admin");
    } else {
      toast.error("Please login account admin!!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/loginadmin");
    }
  };

  const handleLogout = () => {
    cookie.remove("token");
    cookie.remove("user");

    navigate("/loginadmin");
  };

  const NavMenu = () => (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["/admin/home"]}
      style={{ paddingTop: 20 }}
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key="/admin/home" icon={<BarChartOutlined />}>
        <Link to="/admin/home">Overview</Link>
      </Menu.Item>
      <SubMenu key="sub1" icon={<DatabaseOutlined />} title="Account Manage">
        <Menu.Item key="/admin/accountUser">
          <Link to="/admin/accountUser">Account User</Link>
        </Menu.Item>
        <Menu.Item key="/admin/accountAdmin">
          <Link to="/admin/accountAdmin">Account Admin</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<DropboxOutlined />} title="Product">
        <Menu.Item key="/admin/addproduct">
          <Link to="/admin/add-product">Add products</Link>
        </Menu.Item>
        <Menu.Item key="/admin/productManage">
          <Link to="/admin/productManage">Product Manage</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="/admin/warehouse" icon={<HomeOutlined />}>
        <Link to="/admin/warehouse">Warehouse</Link>
      </Menu.Item>
      <Menu.Item key="/admin/categoryManage" icon={<DatabaseOutlined />}>
        <Link to="/admin/categoryManage">Category Manage</Link>
      </Menu.Item>
      <Menu.Item key="/admin/invoices" icon={<ContainerOutlined />}>
        <Link to="/admin/invoices">Invoices</Link>
      </Menu.Item>
      <Menu.Item key="/admin/saleManage" icon={<GiftOutlined />}>
        <Link to="/admin/saleManage">Special event</Link>
      </Menu.Item>
      <SubMenu key="sub3" icon={<DropboxOutlined />} title="Product Reviews">
        <Menu.Item key="/admin/commentManage">
          <Link to="/admin/commentManage">Comment Manage</Link>
        </Menu.Item>
        <Menu.Item key="/admin/ratingManage">
          <Link to="/admin/ratingManage">Rating Manage</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item icon={<PoweroffOutlined />} onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );

  const body = () => (
    <Routes>
      <Route path="/home" element={<HomeAdmin />} />
      <Route path="/accountUser" element={<AccountUser />} />
      <Route path="/accountAdmin" element={<AccountAdmin />} />
      <Route path="/productManage" element={<ProductManage />} />
      <Route path="/categoryManage" element={<CategoryManage />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/saleManage" element={<SaleManage />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/commentManage" element={<CommentManage />} />
      <Route path="/warehouse" element={<Warehouse />} />
      <Route path="/ratingManage" element={<RatingManage />} />
    </Routes>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div>
        {showContent ? (
          <Layout style={{ minHeight: window.innerHeight }}>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              collapsedWidth={80}
            >
              <div
                className="logo"
                style={{
                  alignItems: "center",
                  display: "flex",
                  paddingTop: 20,
                  flexDirection: "column",
                }}
              >
                {collapsed ? (
                  <></>
                ) : (
                  <div>
                    <Link to="" className="text-decoration-none">
                      <span className="h5 text-uppercase text-info bg-dark px-2">
                        HLE
                      </span>
                      <span className="h5 text-uppercase text-white bg-info px-2 ml-n1">
                        E-commere
                      </span>
                    </Link>
                  </div>
                )}
              </div>
              <NavMenu />
            </Sider>
            <Layout>
              <Header
                className="site-layout-background"
                style={{ padding: 0, background: "#fff", paddingLeft: "20px" }}
              >
                {collapsed ? (
                  <MenuUnfoldOutlined
                    onClick={() => setCollapsed(!collapsed)}
                  />
                ) : (
                  <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
                )}
                <span style={{ paddingLeft: 20 }}>HLE E-commere</span>
              </Header>
              <Content
                className="site-layout-background"
                style={{
                  margin: "24px 16px",
                  padding: 24,
                  minHeight: 280,
                }}
              >
                {body()}
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
