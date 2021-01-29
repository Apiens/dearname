import React, { useEffect, useState } from "react";
import PostCommentList from "./PostCommentList";
import PostPhotoList from "./PostPhotoList";
import { Avatar, Spin } from "antd";
import { useAppContext } from "store";
import "./Post.scss";
import { LikeIcon, UnlikeIcon } from "./icons/CostumIcons";
import { axiosInstance } from "api";

export default function Post({ post }: any) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const {
    id: postId,
    author,
    caption,
    location,
    // created_at,
    // updated_at,
    subject_species,
    comment_set,
    photo_set,
    is_like,
    // like_user_set,
    like_user_count,
    like_following_user_set,
  } = post;

  const [isLike, setIsLike] = useState(is_like);
  const [likeUserCount, setLikeUserCount] = useState(like_user_count);

  // const postId = post.id;
  //   console.log("postId: ", postId);
  //   console.log(post);
  //   console.log(author, caption);
  // const [{ data, loading, error }, refetch] = useAxios({
  //   url: apiUrl,
  //   headers,
  // });

  const handleLike = async ({ isLike }: any) => {
    console.log("Clicked Like button. isLike is:", isLike);
    const likeAPIUrl = `/api/posts/${postId}/like/`;
    try {
      if (isLike) {
        const response = await axiosInstance.delete(likeAPIUrl, { headers });
        setIsLike(!isLike);
        setLikeUserCount(likeUserCount - 1);
        console.log("unlike successful. response:", response);
      } else {
        const response = await axiosInstance.post(likeAPIUrl, {}, { headers });
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
      {/* {console.log("rendering post with postId:", postId)} */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          <Avatar src={author.avatar_url} />
          <span className="card-username">{author.username}</span>
        </span>
        {/* <span>created_at: {created_at}</span> */}
        <span style={{ fontWeight: "bold" }}>
          {subject_species.common_name_KOR} {subject_species.common_name}
        </span>
        <span>at {location}</span>
      </div>
      {/* {console.log("created at", created_at)} */}
      <div>
        <PostPhotoList photo_set={photo_set} postId={postId} />
      </div>
      <div className="card-action">
        <span
          className="card-action__like"
          style={{ cursor: "pointer" }}
          onClick={() => handleLike({ isLike: isLike })}
        >
          {isLike ? <UnlikeIcon /> : <LikeIcon />}
        </span>
        <span>
          {/* Q: Why it doesn't work? */}
          {/* {like_following_user_set === []
            ? ""
            : JSON.stringify(
                like_following_user_set.map((user: any) => user.username)
              ) + "외 "} */}
          {likeUserCount} 명이 좋아합니다.
        </span>
      </div>
      <div className="card-caption">{caption}</div>
      <PostCommentList comment_set={comment_set} postId={postId} />
      <br />
    </article>
  );
}
