import React from "react";
import useAxios from "axios-hooks";
import PostCommentList from "./PostCommentList";
import PostLikeBtn from "./PostLikeBtn";
import PostPhotoList from "./PostPhotoList";
import { Card, Avatar } from "antd";
import "./Post.scss";

export default function Post({ post }: any) {
  const {
    author: { username },
    caption,
    location,
    is_like,
  } = post;
  const postId = post.id;
  //   console.log("postId: ", postId);
  //   console.log(post);
  //   console.log(author, caption);
  const apiUrl = "http://localhost:8000/api/posts/";
  const [{ data, loading, error }, refetch] = useAxios(apiUrl);
  return (
    <article className="post-card">
      {console.log("rendering post with postId:", postId)}
      {/* <hr /> */}
      {/* <h2>Post</h2> */}
      <div className="card-user">{"post_by :" + username}</div>
      <PostPhotoList postId={postId} />
      <div className="card-action">
        <PostLikeBtn postId={postId} />
      </div>
      <div className="card-caption"></div>
      <PostCommentList postId={postId} />
      <div className="card-leave_comment">
        <form>
          <input type="text" placeholder="Add a comment..." />
          <input type="submit" value="post" />
        </form>
      </div>
      {/* <hr /> */}

      <br />
    </article>
  );
}
