import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import PostCommentList from "./PostCommentList";
import PostLikeBtn from "./PostLikeBtn";
import PostPhotoList from "./PostPhotoList";
import { Card, Avatar, Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import { useAppContext } from "store";
import "./Post.scss";
import { LikeIcon, UnlikeIcon } from "./icons/CostumIcons";
import Axios from "axios";
import { exception } from "console";

export default function Post({ post }: any) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const {
    author,
    caption,
    location,
    created_at,
    updated_at,
    is_like,
    like_user_count,
    id: postId,
  } = post;
  const [isLike, setIsLike] = useState(is_like);
  const [likeUserCount, setLikeUserCount] = useState(like_user_count);

  // const postId = post.id;
  //   console.log("postId: ", postId);
  //   console.log(post);
  //   console.log(author, caption);
  const apiUrl = "http://localhost:8000/api/posts/";
  const [{ data, loading, error }, refetch] = useAxios({
    url: apiUrl,
    headers,
  });

  const handleLike = async ({ isLike }: any) => {
    console.log("Clicked Like button. isLike is:", isLike);
    const likeAPIUrl = `http://localhost:8000/api/posts/${postId}/like/`;
    try {
      if (isLike) {
        const response = await Axios.delete(likeAPIUrl, { headers });
        setIsLike(!isLike);
        setLikeUserCount(likeUserCount - 1);
        console.log("unlike successful. response:", response);
      } else {
        const response = await Axios.post(likeAPIUrl, data, { headers });
        setIsLike(!isLike);
        setLikeUserCount(likeUserCount + 1);
        console.log("like successful. response:", response);
      }
    } catch (error) {
      console.log("error.response: ", error.response);
    }
  };

  useEffect(() => {
    console.log("isLike Changed to:", isLike);
  }, [isLike]);

  return (
    <article className="post-card">
      {console.log("rendering post with postId:", postId)}
      <div className="card-user">{"post_by :" + author.username}</div>
      <div>created_at: {created_at}</div>
      {console.log("created at", created_at)}
      <PostPhotoList postId={postId} />
      {/* <div>asdf</div> */}
      <div className="card-action">
        <span
          className="card-action__like"
          style={{ cursor: "pointer" }}
          onClick={() => handleLike({ isLike: isLike })}
        >
          {isLike ? <UnlikeIcon /> : <LikeIcon />}
        </span>
        <span>{likeUserCount} likes</span>
      </div>
      <div>this is post location area</div>
      <div className="card-caption">this is caption area</div>
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
