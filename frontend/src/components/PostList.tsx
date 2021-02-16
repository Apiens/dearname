import React, { useEffect, useState } from "react";
import { useAxios } from "api";
import { Spin } from "antd";
import Post from "./Post";
import { useAppContext } from "store";
import FollowSuggestion from "components/FollowSuggestionList";

export default function PostList() {
  const [postList, setPostList] = useState([]);
  const apiUrl = "/api/posts/";
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  const [{ data, loading, error }, refetch] = useAxios({
    url: apiUrl,
    headers,
  });

  useEffect(() => {
    console.log("useEffect from PostList");
    if (typeof data === "object" && data.hasOwnProperty("results")) {
      setPostList(data.results);
    }
  }, [data]);

  // from here
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      // fetchMoreInstaFeeds();
      console.log("time to load more data!");
    }
  };
  // to here // is copied directly from https://medium.com/@_diana_lee

  return loading === true ? (
    <div>
      <Spin style={{ position: "absolute", left: "50%", top: "25%" }}></Spin>
    </div>
  ) : (
    <div style={{}}>
      <div style={{ width: "600px" }}>
        {postList &&
          postList
            .map((post: any) => <Post post={post} key={post.id} />)
            .slice(0, 3)
            .concat(<FollowSuggestion />)
            .concat(
              postList
                .map((post: any) => <Post post={post} key={post.id} />)
                .slice(3)
            )}
      </div>
    </div>
  );
}
