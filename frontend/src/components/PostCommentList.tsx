import Axios from "axios";
import React, { useEffect, useState } from "react";
import PostComment from "./PostComment";

export default function PostCommentList({ postId }: any) {
  const [commentList, setCommentList] = useState([]);
  const apiUrl = `http://localhost:8000/api/posts/${postId}/comments`;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: fetchedComments }: any = await Axios.get(apiUrl);
        console.log("fetched_comments: ", fetchedComments);
        setCommentList(fetchedComments);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="comment-list">
      <h4>PostCommentList</h4>
      {console.log("render with commentList: ", commentList)}
      {commentList.map((comment) => (
        <PostComment comment={comment} />
      ))}
    </div>
  );
}
