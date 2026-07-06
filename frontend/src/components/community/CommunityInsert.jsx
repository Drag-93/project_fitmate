import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initState = {
  title: "",
  content: "",
  writerName: "",
  categoryId: "",
};
const CommunityInsert = () => {
  const navigate = useNavigate();
  const [insert, setInsert] = useState(initState);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8090/community/category")
      .then((res) => {
        setCategory(res.data.result);
      })
      .catch((err) => console.error("카테고리 로딩 실패", err));
  }, []);

  const onCommunityInsert = (e) => {
    const { name, value } = e.target;
    setInsert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 일반 게시글 작성 버전
  // const onInsertFn = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8090/community/insert",
  //       insert,
  //     );
  //     console.log("서버응답", res.data);

  //     if (res.status === 200) {
  //       alert("게시글 작성 성공");
  //       setInsert({ ...initState });

  //       navigate("/community/communityList");
  //     }
  //   } catch (error) {
  //     console.error("게시글 작성 실패", error);
  //     alert("게시글 작성 중 오류 발생");
  //   }
  // };

  //스마트 에디터 사용 버전
  const onInsertFn = async () => {
    // 1. 에디터 인스턴스에서 HTML 내용 추출
    const content = editorRef.current.getInstance().getHTML();

    // 2. 최종 전송할 데이터 객체 생성 (파일 제외 텍스트들)
    const finalInsert = {
      ...insert,
      content: content, // 에디터 내용을 insert 상태에 반영
    };

    const formData = new FormData();
    // JSON을 'data'라는 이름으로 넣음
    formData.append(
      "data",
      new Blob([JSON.stringify(insert)], { type: "application/json" }),
    );
    // 파일을 'file'이라는 이름으로 넣음
    formData.append("file", file);

    axios.post("/community/insert", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    try {
      const res = await axios.post(
        "http://localhost:8090/community/insert",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.status === 200) {
        alert("게시글 작성 성공");
        navigate("/community/communityList");
      }
    } catch (error) {
      console.error("작성 실패", error);
    }
  };

  return {
    /* <div className="cominsert">
        <div className="cominsert-con">
          <h1>게시글 작성</h1>
          <ul>
            <li>
              <label htmlFor="categoryId">카테고리</label>
              <select
                name="categoryId"
                value={insert.categoryId}
                onChange={onCommunityInsert}
              >
                <option value="">카테고리를 선택하세요</option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={insert.title}
                onChange={onCommunityInsert}
              />
            </li>
            <li>
              <label htmlFor="content">내용</label>
              <input
                type="text"
                id="content"
                name="content"
                value={insert.content}
                onChange={onCommunityInsert}
              />
            </li>
            <li>
              <label htmlFor="writerName">작성자</label>
              <input
                type="text"
                id="writerName"
                name="writerName"
                value={insert.writerName}
                onChange={onCommunityInsert}
              />
            </li>
          </ul>
          <button onClick={onInsertFn}>글작성</button>
        </div>
      </div>
    </> */
    import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useRef } from "react";

const CommunityInsert2 = () => {
  const editorRef = useRef(); // 에디터 인스턴스 접근용

  // ... 기존 코드 (상태값, useEffect 등) ...

  return (
    <div className="cominsert">
      <div className="cominsert-con">
        <h1>게시글 작성</h1>
        <ul>
          {/* 1. 카테고리 선택 */}
          <li>
            <label htmlFor="categoryId">카테고리</label>
            <select name="categoryId" value={insert.categoryId} onChange={onCommunityInsert}>
              <option value="">카테고리를 선택하세요</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
          </li>

          {/* 2. 제목 */}
          <li>
            <label htmlFor="title">제목</label>
            <input type="text" name="title" value={insert.title} onChange={onCommunityInsert} />
          </li>

          {/* 3. 스마트 에디터 영역 (여기가 핵심!) */}
          <li>
            <label>내용</label>
            <Editor
              ref={editorRef}
              initialValue="내용을 입력하세요."
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              // 사진 삽입 hook (아까 만든 함수 연결)
              hooks={{
                addImageBlobHook: async (blob, callback) => {
                   // 이미지 업로드 로직 (별도 API 필요)
                }
              }}
            />
          </li>

          {/* 4. 파일 첨부 (썸네일 등) */}
          <li>
            <label>첨부파일</label>
            <input type="file" onChange={onFileChange} />
          </li>

          {/* 5. 작성자 */}
          <li>
            <label htmlFor="writerName">작성자</label>
            <input type="text" name="writerName" value={insert.writerName} onChange={onCommunityInsert} />
          </li>
        </ul>
        <button onClick={onInsertFn}>글작성</button>
      </div>
    </div>
  );
};
  };
};

export default CommunityInsert;
