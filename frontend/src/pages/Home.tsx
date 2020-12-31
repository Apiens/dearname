import React from "react";
import PostList from "components/PostList";
// import AppLayout from "components/AppLayout";
import AppLayout from "components/AppLayout_ant";
import "./Home.scss";

export default function Home() {
  return (
    <div>
      <section>
        <PostList />
      </section>
      <section
        className="main__sidebar"
        style={{ width: "300px", height: "300px" }}
      >
        this is the sidebar area. asdfasdfasdfasdfasdfasdfasdfasdf
      </section>
    </div>
  );
}
