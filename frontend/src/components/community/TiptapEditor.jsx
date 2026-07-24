import { useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import "../css/Community/Tiptap.css";

// 에디터 HTML에서 img 태그 개수 세기
const countImages = (html) => (html.match(/<img/g) || []).length;

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

// ---- 에디터 상단 툴바 ----
const EditorToolbar = ({ editor, onImageClick, imageCount, maxImageCount }) => {
  if (!editor) return null;
  const isLimited = Number.isFinite(maxImageCount);
  const isFull = isLimited && imageCount >= maxImageCount;

  return (
    <div className="editor-toolbar">
      <select
        onChange={(e) => {
          const level = Number(e.target.value);
          if (level === 0) editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level }).run();
        }}
        defaultValue={0}
      >
        <option value={0}>본문</option>
        <option value={1}>제목 1</option>
        <option value={2}>제목 2</option>
        <option value={3}>제목 3</option>
      </select>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        굵게
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        밑줄
      </button>
      <button
        type="button"
        onClick={onImageClick}
        disabled={isFull}
        title={
          isFull ? `이미지는 최대 ${maxImageCount}장까지 첨부 가능합니다.` : ""
        }
      >
        {isLimited ? `이미지 (${imageCount}/${maxImageCount})` : "이미지"}
      </button>
    </div>
  );
};

/**
 * 재사용 가능한 Tiptap 에디터
 *
 * props:
 * - value: string (에디터에 표시할 HTML, 수정 페이지에서 초기값 전달용)
 * - onChange: (html: string) => void
 * - onImageCountChange: (count: number) => void  (선택, 부모가 이미지 개수를 알아야 할 때)
 * - onUploadingChange: (uploading: boolean) => void  (선택, 제출 버튼 disable 등에 사용)
 * - maxImageCount: number (기본 4)
 * - maxImageSize: number (bytes, 기본 5MB)
 * - allowedImageTypes: string[] (기본 jpg/png/gif/webp)
 */
const TiptapEditor = ({
  value = "",
  onChange,
  onImageCountChange,
  onUploadingChange,
  maxImageCount = 4,
  maxImageSize = 5 * 1024 * 1024,
  allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}) => {
  // 외부에서 value가 바뀌었을 때(수정 페이지 초기 로딩 등) 무한 루프 방지용 플래그
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: value,
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;
      const html = editor.getHTML();
      onChange?.(html);
      onImageCountChange?.(countImages(html));
    },
  });

  // 수정 페이지처럼 부모가 뒤늦게 value를 채워주는 경우 동기화
  useEffect(() => {
    if (!editor) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
      onImageCountChange?.(countImages(value || ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const handleImageUpload = useCallback(() => {
    if (!editor) return;

    // 1. 개수 제한 (선택 창 열기 전 먼저 차단)
    const currentCount = countImages(editor.getHTML());
    if (currentCount >= maxImageCount) {
      alert(`이미지는 게시글당 최대 ${maxImageCount}장까지 첨부 가능합니다.`);
      return;
    }

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // 2. 파일 선택 직후 재확인 (연속 클릭 등으로 우회 방지)
      const countBeforeUpload = countImages(editor.getHTML());
      if (countBeforeUpload >= maxImageCount) {
        alert(`이미지는 게시글당 최대 ${maxImageCount}장까지 첨부 가능합니다.`);
        return;
      }

      // 3. 형식 체크
      if (!allowedImageTypes.includes(file.type)) {
        alert("jpg, png, gif, webp 형식만 업로드 가능합니다.");
        return;
      }

      // 4. 용량 체크
      if (file.size > maxImageSize) {
        alert(
          `이미지 용량은 ${formatSize(maxImageSize)} 이하만 첨부 가능합니다. (선택한 파일: ${formatSize(file.size)})`,
        );
        return;
      }

      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        onUploadingChange?.(true);
        const res = await jwtAxios.post(
          `${API_SERVER_URL}/api/upload/image`,
          uploadData,
        );
        editor
          .chain()
          .focus()
          .setImage({ src: `${API_SERVER_URL}${res.data.url}` })
          .run();

        // onUpdate에서도 갱신되지만, 즉시 반영용으로 한 번 더
        const html = editor.getHTML();
        onChange?.(html);
        onImageCountChange?.(countImages(html));
      } catch (err) {
        if (err?.response?.status === 413) {
          alert("이미지 용량이 서버 제한을 초과했습니다.");
        } else {
          alert("이미지 업로드 실패");
        }
      } finally {
        onUploadingChange?.(false);
      }
    };
  }, [
    editor,
    maxImageCount,
    maxImageSize,
    allowedImageTypes,
    onChange,
    onImageCountChange,
    onUploadingChange,
  ]);

  const imageCount = editor ? countImages(editor.getHTML()) : 0;

  return (
    <div className="tiptap-wrapper">
      <EditorToolbar
        editor={editor}
        onImageClick={handleImageUpload}
        imageCount={imageCount}
        maxImageCount={maxImageCount}
      />
      <EditorContent editor={editor} className="tiptap-content" />
      <p className="image-limit-hint">
        이미지 최대 {maxImageCount}장, 장당 {formatSize(maxImageSize)} 이하
        (jpg, png, gif, webp)
      </p>
    </div>
  );
};

export default TiptapEditor;
