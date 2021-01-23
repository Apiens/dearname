import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { Card, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppContext } from "store";
import "./UserMain.scss";

const { Meta } = Card;
export default function UserProfile() {
  const [postList, setPostList] = useState([]);
  const apiUrl = "http://localhost:8000/api/myposts";
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  const [{ data, loading, error }, refetch] = useAxios({
    url: apiUrl,
    headers,
  });
  console.log("data", data);
  console.log("error", error);

  useEffect(() => {
    console.log("useEffect from PostList");
    if (typeof data === "object" && data.hasOwnProperty("results")) {
      setPostList(data.results);
    }
  }, [data]);

  return loading ? (
    <div>
      <Spin style={{ position: "absolute", left: "50%", top: "25%" }}></Spin>
    </div>
  ) : (
    <div>
      {/* <div
        style={{
          width: "100%",
          height: "20px",
          borderBottom: "1px solid black",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            backgroundColor: "#F3F5F6",
            padding: "0 10px",
          }}
        >
          내 게시물
        </span>
      </div> */}
      <hr></hr>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {postList.map((post: any) => (
          <Card
            hoverable
            style={{ width: "260px" }}
            cover={
              <div>
                <img
                  width="260px"
                  height="260px"
                  alt="example"
                  src={post.photo_set[0].url}
                  // "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
                <div
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    width: "260px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{post.created_at.slice(0, 10)}</div>
                  <div>{post.like_user_count + " 좋아요"}</div>
                  <div>{post.comment_count + " 댓글"}</div>
                </div>
              </div>
            }
            actions={[<DeleteOutlined key="delete" />]}
          >
            <p
              style={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "1.2rem",
                margin: "0",
              }}
            >
              {post.subject_species.common_name_KOR}
            </p>
            {/* <hr></hr> */}
            {/* <Meta
              style={{ textAlign: "center" }}
              title={post.subject_species.common_name_KOR}
              // description="www.instagram.com"
            /> */}
          </Card>
        ))}
      </div>
    </div>
  );
}
