import React from "react";
import PostList from "components/PostList";
import AppLayout from "components/AppLayout";

export default function Root() {
  return (
    <div>
      <AppLayout>
        <PostList />
      </AppLayout>
    </div>
  );
}
