import React from "react";

export default function PostLikeBtn({ postId }: any) {
  const likeApiUrl = `http://localhost:8000/api/posts/${postId}/like`;
  return <button>Like</button>;
}
