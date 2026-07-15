import React, { useState } from "react";
import ReplyList from "./NoticeReplyList";
import ReplyForm from "./NoticeReplyForm";

const Reply = ({ noticeId }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReplyAdd = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div className="reply">
      <div className="reply-con">
        <h1>댓글</h1>
        <ReplyList communityId={noticeId} refreshKey={refreshKey} />
        <ReplyForm communityId={noticeId} onReplyAdd={handleReplyAdd} />
      </div>
    </div>
  );
};

export default Reply;
