import React, { useState } from "react";
import Axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAppContext, setToken } from "store";
import { parseErrorMessages } from "utils/forms";
import { Form, Input, Button, Checkbox, notification, Card } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.scss";

export default function Login() {
  // to save in local
  const { dispatch } = useAppContext();

  // for redirection after login
  const history = useHistory();
  const location = useLocation();
  const { from: loginRedirectUrl }: any = location.state || {
    from: { pathname: "/" },
  };

  // for error notifications.
  const [fieldErrors, setFieldErrors] = useState({});

  // onSubmit the form
  const onFinish = (values: any) => {
    const { username, password } = values;
    const data = { username, password };
    setFieldErrors({});

    async function fn() {
      try {
        const response = await Axios.post(
          "http://localhost:8000/accounts/token/",
          data
        );
        const {
          data: { token: jwtToken },
        } = response;
        console.log("서버로부터 jwt토큰을 받아왔습니다 :", jwtToken);

        //set token and save it in local storage.
        dispatch(setToken(jwtToken));

        console.log("Success:", values);
        notification.open({
          message: "로그인 성공",
          description: "기본(이전) 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push(loginRedirectUrl);
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "로그인 실패",
            description: "아이디/암호를 확인해 주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldErrorMessages } = error.response;
          console.log(fieldErrorMessages);
          setFieldErrors(parseErrorMessages(fieldErrorMessages));
        }
      }
    }
    fn();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        width: "400px",
        height: "400px",
        justifyContent: "center",
        alignItems: "center",
        margin: "12% auto",
      }}
    >
      <Card title="Dearname Login">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "사용자명을 입력해 주세요" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "암호를 입력해 주세요" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <Link to="/accounts/signup">register now!</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
