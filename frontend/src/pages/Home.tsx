import React from "react";
import PostList from "components/PostList";
// import AppLayout from "components/AppLayout";
import AppLayout from "components/AppLayout_ant";
import "./Home.scss";

export default function Home() {
  return (
    <div>
      {/* <AppLayout>
        <PostList />
      </AppLayout> */}
      <AppLayout>
        <PostList />
      </AppLayout>
    </div>
  );
}
