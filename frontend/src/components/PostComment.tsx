import React from "react";

export default function PostComment({ comment }: any) {
  return (
    <div>
      {"comment by " + comment.author.username + ": " + comment.message}
      {console.log(comment)}
    </div>
  );
}
