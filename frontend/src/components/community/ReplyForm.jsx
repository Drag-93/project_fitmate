import axios from "axios";
import React, { useEffect, useState } from "react";
import jwtAxios from "../../apis/util/jwtUtil";

const ReplyForm = ({ communityId, onReplyAdd }) => {
  const [reply, setReply] = useState({
    content: "",
    communityId,
    userName: "",
  });
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await jwtAxios.get("http://localhost:8090/api/member/detail");
      if (res && res.data && res.data.result) {
        setReply((prev) => ({
          ...prev,
          userName: res.data.result.userName,
        }));
      }
    } catch (error) {
      console.error("회원 정보를 불러올 수 없습니다.", error);
      setReply((prev) => ({ ...prev, userName: "비회원" }));
    }
  };

  const saveReply = async () => {
    if (!reply.content.trim()) {
      alert("댓글 내용을 입력하세요");
      return;
    }
    try {
      const res = await jwtAxios.post(
        "http://localhost:8090/reply/insert",
        reply,
      );
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
          <input name="userName" value={reply.userName} readOnly />
          <button type="button" onClick={saveReply}>
            댓글 작성
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ReplyForm;
