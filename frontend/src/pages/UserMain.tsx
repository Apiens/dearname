import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import Axios from "axios";
import { Button, Card, Spin, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppContext } from "store";
import "./UserMain.scss";
import UserPostCard from "components/UserPostCard";

const { Meta } = Card;
export default function UserProfile() {
  const [postList, setPostList] = useState([]);
  const apiUrl = "http://localhost:8000/api/myposts";
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  const [{ data, loading, error }, refetch] = useAxios({
    url: apiUrl,
    headers,
  });

  useEffect(() => {
    console.log("useEffect from PostList");
    if (typeof data === "object" && data.hasOwnProperty("results")) {
      setPostList(data.results);
    }
  }, [data]);

  return loading ? (
    <div>
      <Spin style={{ position: "absolute", left: "50%", top: "25%" }}></Spin>
    </div>
  ) : (
    <div>
      <hr></hr>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {postList.map((post: any) => (
          <UserPostCard
            key={post.id}
            post={post}
            setPostList={setPostList}
            headers={headers}
          />
        ))}
      </div>
    </div>
  );
}
