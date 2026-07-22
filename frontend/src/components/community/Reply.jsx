import React, { useState } from "react";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";

const Reply = ({ communityId, categoryName }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReplyAdd = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div className="reply">
      <div className="reply-con">
        <h1>댓글</h1>
        <ReplyList communityId={communityId} refreshKey={refreshKey} />
        <ReplyForm
          communityId={communityId}
          categoryName={categoryName}
          onReplyAdd={handleReplyAdd}
        />
      </div>
    </div>
  );
};

export default Reply;
