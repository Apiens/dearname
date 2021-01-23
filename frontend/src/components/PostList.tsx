import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { Spin } from "antd";
import Axios from "axios";
import Post from "./Post";
import { useAppContext } from "store";
import FollowSuggestion from "components/FollowSuggestionList";

export default function PostList() {
  const [postList, setPostList] = useState([]);
  const apiUrl = "http://localhost:8000/api/posts/";
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

  // useEffect(() => {
  //   console.log("start useEffect from PostList");
  //   setPostList(originalPostList);
  // }, [originalPostList]);

  return loading === true ? (
    <div>
      <Spin style={{ position: "absolute", left: "50%", top: "25%" }}></Spin>
    </div>
  ) : (
    <div style={{}}>
      <div style={{ width: "600px" }}>
        {/* <h1>PostList</h1> */}
        {console.log("loading :", loading)}
        {console.log("render PostList with postList:", postList)}
        {console.log("type of postList", typeof postList)}

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

// 1. 마운트 되며 초기값([])으로 렌더
// 2. 마운트 끝나고 didmount니까 useEffect바로 실행 & setPostList(undefined)수행
// 3. setPostList되었으니 다시 렌더 (loading:true)
// 4. 로딩 끝나고 (loading:false) 다시 렌더(loading이라는 status값이 변했으므로.)
// 5. fetch끝나서 originalPostList바뀌었으니 useEffect 실행 & setPostList수행
// 6. setPostList되었으니 다시 렌더

// 총 4번이나 렌더함.
// fetch를 useEffect안에서 하고 then에서 setPostList했으면 1회 줄고.
// loading을 state로 관리 안했으면 1회 더 줄어서 2회였을것이다.
// 4랑 5가 따로 렌더링 된다는게 흠터레스팅..(서로다른 state땜에 동일한걸 중첩렌더링..)
// 1, 3번에서의 render는 로딩중인걸 이용해 뭔가를 보여주려면 연산이 좀 들겠다.
// 물론 4번에서의 render는 비용이 거의 없을것이다.(렌더링 할 대상이 없으니..)
// 렌더링 좀 몇번 더하는거 아무것도 아닌것 같으니 너무 신경쓰지 말자.

// fetch를 userEffect의 async function으로 실행해도 initial value로 2번 render되는데... 왜그러지?
