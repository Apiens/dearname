import React, { useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { parseErrorMessages } from "utils/forms";
import { Form, Input, Button, notification, Card } from "antd";
import { SmileOutlined, FrownOutlined, MailOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Signup.scss";

export default function Signup() {
  // for redirection after signup
  const history = useHistory();
  const { from: signupRedirectUrl }: any = {
    from: { pathname: "/accounts/login/" },
  };

  // for error notifications.
  const [fieldErrors, setFieldErrors] = useState({});

  // onSubmit the form
  const onFinish = (values: any) => {
    const { username, password, email } = values;
    const data = { username, password, email };
    setFieldErrors({});

    async function fn() {
      //signup
      try {
        const response = await Axios.post(
          "http://localhost:8000/accounts/signup/",
          data
        );
        console.log("signup success. response: ", response);
        notification.open({
          message: "회원가입 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push(signupRedirectUrl);
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "회원가입 실패",
            description: "아이디/암호를 확인해 주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldErrorMessages } = error.response;
          setFieldErrors(parseErrorMessages(fieldErrorMessages));
        }
      }
    }
    console.log("Success:", values);
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
      <Card title="Dearname Signup">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "사용자명을 입력해주세요" },
              { min: 4, message: "4글자 이상 입력해 주세요." },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "이메일을 입력해 주세요.",
              },
              {
                required: true,
                message: "이메일을 입력해 주세요.",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="E-mail"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "암호를 입력해 주세요" },
              { min: 8, message: "8글자 입력해주세요." },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "암호를 확인해 주세요",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("암호가 일치하지 않습니다.");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Sign Up
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <Button className="login-form-button">Sign Up with FaceBook</Button>
          </Form.Item>
          <Form.Item>
            <Button className="login-form-button">Sign Up with Kakao</Button>
          </Form.Item> */}
        </Form>
      </Card>
    </div>
  );
}
