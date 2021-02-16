import React, { ReactNode } from "react";
import { Menu } from "antd";
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
const { SubMenu } = Menu;

type Props = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const { dispatch } = useAppContext();

  return (
    <div className="app">
      <header className="header">
        <nav className="header__nav">
          <div className="header__logo">
            <Link to="/">
              <img src={LogoImage} width="120px" height="54px" alt="" />
            </Link>
          </div>
          <Menu
            className="menu"
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={["1"]}
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
              style={{ verticalAlign: "bottom" }}
            >
              <Link to="/user_collections" />
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
                <Link to="/user_main">Profile</Link>
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
      <main className="main">{children}</main>
      <footer className="footer">
        <div>Ant Design ©2018 Created by Ant UED</div>
      </footer>
    </div>
  );
}
