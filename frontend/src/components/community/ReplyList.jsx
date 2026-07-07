import axios from "axios";
import React, { useEffect, useState } from "react";

const ReplyList = ({ communityId, refreshKey }) => {
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const getReplyList = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8090/reply/list/${communityId}`,
      );
      setReplies(res.data?.replies || res.data?.result || []);
    } catch (error) {
      alert(error);
      setReplies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      getReplyList();
    }
  }, [communityId, refreshKey]);

  // 수정 모드 진입
  const startEdit = (reply) => {
    setEditingId(reply.id);
    setEditContent(reply.content);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // 수정 저장
  const saveEdit = async (reply) => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    try {
      await axios.put(`http://localhost:8090/reply/update/${reply.id}`, {
        content: editContent,
        communityId: reply.communityId,
        // memberId: reply.memberId,
      });
      setReplies((prev) =>
        prev.map((item) =>
          item.id === reply.id ? { ...item, content: editContent } : item,
        ),
      );
      cancelEdit();
    } catch (error) {
      console.error(error);
      alert("댓글 수정 실패");
    }
  };

  if (isLoading) {
    return <p>댓글을 불러오는 중입니다</p>;
  }

  if (replies.length === 0) {
    return <p className="reply-empty">아직 댓글이 없습니다</p>;
  }

  return (
    <ul className="reply-list">
      {replies.map((reply) => (
        <li key={reply.id}>
          {editingId === reply.id ? (
            <div className="reply-edit">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => saveEdit(reply)}>
                저장
              </button>
              <button type="button" onClick={cancelEdit}>
                취소
              </button>
            </div>
          ) : (
            <>
              <div className="reply-content">{reply.content}</div>
              <div className="reply-meta">
                {/* {reply.writerName && <span>{reply.writerName}</span>}
                {reply.createTime && <span>{reply.createTime.split("T")[0]}</span>} */}
                <button type="button" onClick={() => startEdit(reply)}>
                  수정
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ReplyList;
