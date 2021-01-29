import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useAppContext } from "store";
import Axios from "axios";
import { axiosInstance, useAxios } from "api";
import FollowSuggestion from "components/FollowSuggestion";

export default function FollowSuggestionList() {
  const [suggestionList, setsuggestionList] = useState<Object[]>([]);

  // carousel settings
  const settings = {
    style: { marginBottom: "30px" },
    dots: true,
    infinite: true,
    // arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    adaptiveHeight: true,
  };

  const apiUrl = "/accounts/suggestions";
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  const [{ data: originalUserList, loading, error }, refetch] = useAxios({
    url: apiUrl,
    headers,
  });

  useEffect(() => {
    console.log("useEffect from PostList");
    if (!originalUserList) {
      setsuggestionList([]);
    } else {
      setsuggestionList(
        originalUserList.map((user: any) => ({ ...user, is_followed: false }))
      );
    }
  }, [originalUserList]);

  const onFollowUser = (username: any) => {
    const data = { username };
    const config = { headers };
    axiosInstance
      .post("/accounts/follow/", data, config)
      .then((response) => {
        setsuggestionList((prevUserList) =>
          prevUserList.map((user: any) =>
            user.username === username ? { ...user, is_followed: true } : user
          )
        );
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const onUnfollowUser = (username: any) => {
    setsuggestionList((prevUserList) =>
      prevUserList.map((user: any) =>
        user.username === username ? { ...user, is_followed: false } : user
      )
    );
  };

  return (
    <section style={{ border: "3px solid #bcbcbc", borderRadius: "5px" }}>
      <p style={{ textAlign: "center", color: "gray" }}>
        주변 사람들을 알아보세요
      </p>
      {console.log("originalUserList", originalUserList)}
      {console.log("suggestionList", suggestionList)}
      <Slider {...settings}>
        {suggestionList &&
          suggestionList.map((suggestionUser: any) => {
            return (
              <FollowSuggestion
                key={suggestionUser.username}
                suggestionUser={suggestionUser}
                onFollowUser={onFollowUser}
                onUnfollowUser={onUnfollowUser}
              />
            );
          })}
      </Slider>
    </section>
  );
}
