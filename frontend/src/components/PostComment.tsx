import React from "react";
import { axiosInstance } from "api";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppContext } from "store";

export default function PostComment({ comment, setCommentList }: any) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const deleteAPIUrl = `/api/comments/${comment.id}/`;
  const deleteComment = async () => {
    try {
      const response = await axiosInstance.delete(deleteAPIUrl, { headers });
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
}
