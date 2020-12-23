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
const { Header, Content, Footer } = Layout;

type Props = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export default function AppLayout({ children, sidebar }: Props) {
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
              icon={<HomeOutlined style={{ fontSize: "1.4em" }} />}
            />
            <Menu.Item
              key="2"
              icon={<BookOutlined style={{ fontSize: "1.4em" }} />}
            />
            <Menu.Item
              key="3"
              icon={<FormOutlined style={{ fontSize: "1.4em" }} />}
            />
            <Menu.Item
              key="4"
              icon={<UserOutlined style={{ fontSize: "1.4em" }} />}
            />
          </Menu>
        </nav>
      </header>
      <main className="main">
        <section className="main__contents">{children}</section>
        <section
          className="main__sidebar"
          style={{ wFidth: "300px", height: "300px" }}
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
