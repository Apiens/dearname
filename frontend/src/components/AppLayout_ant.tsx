import React, { ReactNode } from "react";
import { Layout, Menu, Button, Breadcrumb } from "antd";
import "./AppLayout_ant.scss";
import {
  FormOutlined,
  BookOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import LogoImage from "assets/dearname_icon_white.png";
import { Link } from "react-router-dom";
import { useAppContext, deleteToken } from "store";
const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

type Props = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export default function AppLayout({ children, sidebar }: Props) {
  const { dispatch } = useAppContext();

  return (
    <div className="app">
      <header className="header">
        <nav className="header__nav">
          <div className="header__logo">
            <img src={LogoImage} width="120px" height="54px" alt="" />
          </div>
          <Menu
            className="menu"
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
          >
            <Menu.Item
              key="1"
              icon={
                <HomeOutlined
                  style={{
                    fontSize: "1.6em",
                    margin: "auto",
                  }}
                />
              }
            >
              <Link to="/" />
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={
                <BookOutlined style={{ fontSize: "1.6em", margin: "auto" }} />
              }
            >
              <Link to="/mycollections/" />
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={
                <FormOutlined style={{ fontSize: "1.6em", margin: "auto" }} />
              }
              style={{ verticalAlign: "bottom" }}
            >
              <Link to="/post/create" />
            </Menu.Item>
            <SubMenu
              key="Sub1"
              icon={
                <UserOutlined style={{ fontSize: "1.6em", margin: "auto" }} />
              }
              // style={{ position: "relative", top: "10px" }}
            >
              <Menu.Item key="4">
                <Link to="/accounts/main/">Profile</Link>
              </Menu.Item>
              <Menu.Item
                key="5"
                onClick={() => {
                  dispatch(deleteToken());
                }}
              >
                <div>Log out</div>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </nav>
      </header>
      <main className="main">
        <section className="main__contents">{children}</section>
        <section
          className="main__sidebar"
          style={{ width: "300px", height: "300px" }}
        >
          this is the sidebar area. asdfasdfasdfasdfasdfasdfasdfasdf
        </section>
      </main>
      <footer className="footer">
        <div>Ant Design ©2018 Created by Ant UED</div>
      </footer>
    </div>

    // <Layout>
    //   <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
    //     <div className="logo" />
    //     <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
    //       <Menu.Item key="1">nav 1</Menu.Item>
    //       <Menu.Item key="2">nav 2</Menu.Item>
    //       <Menu.Item key="3">nav 3</Menu.Item>
    //     </Menu>
    //   </Header>
    //   <Content
    //     className="site-layout"
    //     style={{ padding: "0 50px", marginTop: 64 }}
    //   >
    //     <div
    //       className="site-layout-background"
    //       style={{ padding: 24, minHeight: 380 }}
    //     >
    //       Content
    //     </div>
    //   </Content>
    //   <Footer style={{ textAlign: "center" }}>
    //     Ant Design ©2018 Created by Ant UED
    //   </Footer>
    // </Layout>
  );
}
