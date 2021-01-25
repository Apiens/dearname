import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button, Card, Spin, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function UserPostCard({ post, setPostList, headers }: any) {
  //   const handleDelete = () => {
  //     Axios.delete(`http://localhost:8000/api/posts/${post.id}/`, {
  //       headers,
  //     }).then(message.info("게시물을 성공적으로 삭제 하였습니다."));
  //   };
  const deletePost = async () => {
    try {
      const response = await Axios.delete(
        `http://localhost:8000/api/posts/${post.id}/`,
        { headers }
      );
      console.log("delete success. response: ", response);
      message.info("게시물을 성공적으로 삭제 하였습니다.");
      setPostList((prevList: any) =>
        prevList.filter((element: any) => {
          return element.id !== post.id;
        })
      );
    } catch (error) {
      console.log("error.response: ", error.response);
    }
  };

  return (
    post && (
      <Card
        hoverable
        style={{ width: "260px" }}
        cover={
          <div>
            <img
              width="260px"
              height="260px"
              alt="example"
              src={post.photo_set[0].url}
            />
            <div
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                width: "260px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>{post.created_at.slice(0, 10)}</div>
              <div>{post.like_user_count + " 좋아요"}</div>
              <div>{post.comment_count + " 댓글"}</div>
            </div>
          </div>
        }
      >
        <p
          style={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.2rem",
            margin: "0",
          }}
        >
          {post.subject_species.common_name_KOR}
        </p>
        <Button block={true} icon={<DeleteOutlined />} onClick={deletePost} />
      </Card>
    )
  );
}
