import { useEffect, useMemo, useState } from "react";
import { API_SERVER_URL } from "../../../apis/commonApi";
import jwtAxios from "../../../apis/util/jwtUtil";
import TiptapEditor from "../../community/TiptapEditor";

const AdminNoticeWrite = ({ tabId, tabs, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tabId: String(tabId),
    categoryId: "",
    title: "",
    content: "",
    userName: "",
    userEmail: "",
  });

  const tabName = useMemo(
    () => tabs.find((t) => String(t.id) === String(tabId))?.tabName || "",
    [tabs, tabId],
  );

  const filteredCategories = useMemo(
    () => categories.filter((cat) => String(cat.tabId) === String(tabId)),
    [categories, tabId],
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await jwtAxios.get(`${API_SERVER_URL}/api/member/detail`);
        if (res.data?.result) {
          setFormData((prev) => ({
            ...prev,
            userName: res.data.result.userName,
            userEmail: res.data.result.userEmail,
          }));
        }
      } catch (err) {
        console.error("작성자 정보 로드 실패", err);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("카테고리를 선택해주세요");
      return;
    }
    if (!formData.title) {
      alert("제목을 입력해주세요");
      return;
    }
    if (!formData.content) {
      alert("내용을 작성해주세요");
      return;
    }
    try {
      await jwtAxios.post(`${API_SERVER_URL}/community/insert`, formData);
      alert("작성 완료!");
      onSuccess();
    } catch (err) {
      alert("작성 실패");
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>공지사항 작성{tabName && ` > ${tabName}`}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="insert-form">
          <div className="form-group">
            <label>카테고리 선택</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
            >
              <option value="">카테고리를 선택하세요</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <input
            name="title"
            placeholder="제목"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <TiptapEditor
            value={formData.content}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, content: html }))
            }
            maxImageCount={4}
          />

          <div className="admin-modal-actions">
            <button type="submit" className="submit-btn">
              글 작성하기
            </button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeWrite;
