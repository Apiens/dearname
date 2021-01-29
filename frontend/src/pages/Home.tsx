import React from "react";
import PostList from "components/PostList";
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
      ></section>
    </div>
  );
}
