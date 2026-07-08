import axios from "axios";
import React, { useState } from "react";

const ReplyForm = ({ communityId, onReplyAdd }) => {
  const [reply, setReply] = useState({ content: "", communityId });

  const saveReply = async () => {
    if (!reply.content.trim()) {
      alert("댓글 내용을 입력하세요");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8090/reply/insert", reply);
      alert("댓글이 작성되었습니다");
      setReply({ ...reply, content: "" });
      if (onReplyAdd) {
        onReplyAdd(res.data);
      }
    } catch (error) {
      alert("댓글 작성 실패");
    }
  };
  return (
    <div className="reply-write">
      <ul>
        <li>
          <input
            type="text"
            value={reply.content}
            onChange={(e) => setReply({ ...reply, content: e.target.value })}
            placeholder="댓글을 입력하세요"
          />
          <button type="button" onClick={saveReply}>
            입력
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ReplyForm;
