import axios from "axios";
import React, { useEffect, useState } from "react";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

const ReplyForm = ({ communityId, categoryName, onReplyAdd }) => {
  const [reply, setReply] = useState({
    memberId: "",
    content: "",
    communityId,
    userName: "",
    userEmail: "",
  });
  const [role, setRole] = useState(null); // 사용자 role
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await jwtAxios.get(`${API_SERVER_URL}/api/member/detail`);
      if (res && res.data && res.data.result) {
        setReply((prev) => ({
          ...prev,
          memberId: res.data.result.memberId,
          userName: res.data.result.userName,
          userEmail: res.data.result.userEmail,
        }));
        setRole(res.data.result.role); // "ADMIN" 또는 "USER" 등
      }
    } catch (error) {
      console.error("회원 정보를 불러올 수 없습니다.", error);
      setReply((prev) => ({ ...prev, userName: "비회원" }));
    } finally {
      setLoadingUser(false);
    }
  };

  const isQna = categoryName === "QNA";
  const isAdmin = role === "ADMIN";
  const isBlocked = isQna && !isAdmin;

  const saveReply = async () => {
    if (isBlocked) {
      alert("QNA 게시글의 댓글은 관리자만 작성할 수 있습니다.");
      return;
    }
    if (!reply.content.trim()) {
      alert("댓글 내용을 입력하세요");
      return;
    }
    try {
      const res = await jwtAxios.post(`${API_SERVER_URL}/reply/insert`, reply);
      alert("댓글이 작성되었습니다");
      setReply({ ...reply, content: "" });
      if (onReplyAdd) {
        onReplyAdd(res.data);
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        alert("QNA 게시글의 댓글은 관리자만 작성할 수 있습니다.");
      } else {
        alert("댓글 작성 실패");
      }
    }
  };

  if (loadingUser) return null;

  if (isBlocked) {
    return (
      <div className="reply-write reply-write--blocked">
        <p>QNA 게시글의 댓글은 관리자만 작성할 수 있습니다.</p>
      </div>
    );
  }

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
