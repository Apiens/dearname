import React from "react";
import Axios from "axios";
import { Comment, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppContext } from "store";

export default function PostComment({ comment, setCommentList }: any) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const deleteAPIUrl = `http://localhost:8000/api/comments/${comment.id}/`;
  const deleteComment = async () => {
    try {
      const response = await Axios.delete(deleteAPIUrl, { headers });
      console.log("delete success. response: ", response);
      setCommentList((prevList: any) =>
        prevList.filter((element: any) => {
          return element.id !== comment.id;
        })
      );
    } catch (error) {
      console.log("error.response: ", error.response);
    }
  };
  return (
    <div>
      <span style={{ fontWeight: "bold" }}>{comment.author.username} </span>
      {console.log("comment data: ", comment)}
      <span>{comment.message}</span>
      {comment.is_author && (
        <span
          style={{ float: "right", cursor: "pointer" }}
          onClick={deleteComment}
        >
          <DeleteOutlined />
        </span>
      )}
    </div>
  );
  // return <Comment content={comment} />;
}
