import React from "react";
import useAxios from "axios-hooks";
import PostCommentList from "./PostCommentList";
import PostLikeBtn from "./PostLikeBtn";
import PostPhotoList from "./PostPhotoList";

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
    <div>
      {/* {console.log("rendering post with postId:", postId)} */}
      <hr />
      <h2>Post</h2>
      <PostPhotoList postId={postId} />
      {"post_by " + username + ": " + caption}
      <PostCommentList postId={postId} />
      <PostLikeBtn postId={postId} />
      <hr />
      <br />
    </div>
  );
}
