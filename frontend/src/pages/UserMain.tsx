import React, { useEffect, useState } from "react";
import { useAxios } from "api";
import { Card, Spin } from "antd";
import { useAppContext } from "store";
import "./UserMain.scss";
import UserPostCard from "components/UserPostCard";
// import { useLocation } from "react-router-dom";

export default function UserProfile() {
  // const location = useLocation();
  // const { from }: any = location.state; // if from "postCreate" => refresh (refetch?) ..??
  const [postList, setPostList] = useState([]);
  const apiUrl = "/api/myposts";
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
