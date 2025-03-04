import React, { useState } from "react";
import PostComment from "./PostComment";
import { useAppContext } from "store";
import { Input, Button } from "antd";
import { axiosInstance } from "api";

export default function PostCommentList({ postId, comment_set }: any) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  const [commentList, setCommentList] = useState(comment_set);
  const [commentContent, setCommentContent] = useState("");
  const apiUrl = `/api/posts/${postId}/comments/`;

  const addComment = async () => {
    const response = await axiosInstance.post(
      apiUrl,
      { message: commentContent },
      { headers }
    );
    console.log("comment add success. response: ", response);
    setCommentContent("");
    setCommentList((prevState: Object[]) => {
      return [response.data].concat(prevState);
    });
  };

  return (
    <>
      <div className="comment-list">
        {commentList.map((comment: any) => (
          <PostComment
            key={comment.id}
            comment={comment}
            setCommentList={setCommentList}
          />
        ))}
      </div>
      <div
        className="card-leave_comment"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input.TextArea
          style={{
            marginBottom: ".5em",
            display: "inline",
            height: "1em",
            maxHeight: "4em",
            maxWidth: "88%",
            width: "88%",
          }}
          autoSize={{ maxRows: 4 }}
          maxLength={200}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <Button
          block
          type="primary"
          style={{ marginBottom: ".5em", display: "inline", maxWidth: "10%" }}
          disabled={commentContent.length === 0}
          onClick={addComment}
        >
          게시
        </Button>
      </div>
    </>
  );
}
