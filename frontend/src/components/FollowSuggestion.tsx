import React from "react";
import { Card, Button } from "antd";

export default function FollowSuggestion({
  suggestionUser,
  onFollowUser,
  onUnfollowUser,
}: any) {
  const { username, name, avatar_url, is_followed } = suggestionUser;

  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "001529",
        }}
      >
        <div>
          <img
            src={avatar_url}
            alt=""
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "70%",
            }}
          />
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            {username}
          </p>
        </div>
        <div>
          {is_followed && (
            <Button
              size="small"
              style={{ width: "100px" }}
              onClick={() => onUnfollowUser(username)}
            >
              Unfollow
            </Button>
          )}
          {!is_followed && (
            <Button
              size="small"
              style={{ width: "100px" }}
              onClick={() => onFollowUser(username)}
            >
              Follow
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
