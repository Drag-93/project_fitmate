import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CommonCalendar from "../common/calendar/CommonCalendar";
import { API_SERVER_URL } from "../../apis/commonApi";
import jwtAxios from "../../apis/util/jwtUtil";

const MySchedule = () => {
  // 로그인 회원 정보
  const user = useSelector((state) => state.loginSlice);
  const isLogin = !!user?.userEmail;

  const API_URL = API_SERVER_URL;

  // 조회할 일정 유형
  const [eventType, setEventType] = useState("ALL");

  // 캘린더 일정 목록
  const [calendarEvents, setCalendarEvents] = useState([]);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // insert, detail, update
  const [modalMode, setModalMode] = useState("insert");

  // 현재 선택한 캘린더 일정
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 등록·수정 입력값
  const [form, setForm] = useState({
    eventType: "PERSONAL",
    title: "",
    start: "",
    end: "",
    content: "",
  });

  // 일정 목록 조회
  const getCalendarList = async () => {
    if (!isLogin) {
      setCalendarEvents([]);
      return;
    }

    try {
      const res = await jwtAxios.get(`${API_URL}/api/schedule/scheduleList`, {
        params: {
          eventType,
        },
      });

      setCalendarEvents(res.data || []);
    } catch (err) {
      console.error("일정 조회 실패:", err);
      setCalendarEvents([]);
    }
  };

  // 로그인 상태 또는 조회 유형 변경 시 재조회
  useEffect(() => {
    getCalendarList();
  }, [isLogin, eventType]);

  // 날짜 클릭 시 등록 모달 열기
  const openInsertModal = (info) => {
    setModalMode("insert");
    setSelectedEvent(null);

    setForm({
      eventType: "PERSONAL",
      title: "",
      start: `${info.dateStr}T09:00`,
      end: `${info.dateStr}T10:00`,
      content: "",
    });

    setIsModalOpen(true);
  };

  // 일정 클릭 시 상세 모달 열기
  const openDetailModal = (info) => {
    const event = info.event;

    setSelectedEvent(event);
    setModalMode("detail");

    setForm({
      eventType: event.extendedProps.eventType || "PERSONAL",
      title: event.title || "",
      start: event.startStr ? event.startStr.slice(0, 16) : "",
      end: event.endStr
        ? event.endStr.slice(0, 16)
        : event.startStr?.slice(0, 16) || "",
      content: event.extendedProps.content || "",
    });

    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalMode("insert");

    setForm({
      eventType: "PERSONAL",
      title: "",
      start: "",
      end: "",
      content: "",
    });
  };

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 입력값 검증
  const validateForm = () => {
    if (!form.title.trim()) {
      alert("일정 제목을 입력하세요.");
      return false;
    }
    if (!form.start || !form.end) {
      alert("시작일과 종료일을 입력하세요.");
      return false;
    }
    if (new Date(form.end) < new Date(form.start)) {
      alert("종료일은 시작일보다 빠를 수 없습니다.");
      return false;
    }

    return true;
  };

  // 일정 등록
  const handleInsert = async () => {
    if (!validateForm()) {
      return;
    }

    const requestData = {
      eventType: form.eventType,
      title: form.title,
      start: form.start,
      end: form.end,
      content: form.content,
    };

    try {
      await jwtAxios.post(`${API_URL}/api/schedule/insert`, requestData);

      await getCalendarList();
      closeModal();
    } catch (err) {
      console.error("일정 등록 실패:", err);
      alert("일정 등록에 실패했습니다.");
    }
  };

  // 수정 모드 전환
  const changeUpdateMode = () => {
    if (!selectedEvent) {
      return;
    }
    const editable = selectedEvent.extendedProps.editable;

    if (editable === false) {
      alert("수정할 수 없는 일정입니다.");
      return;
    }

    setModalMode("update");
  };

  // 일정 수정
  const handleUpdate = async () => {
    if (!selectedEvent) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // 실제 PersonalScheduleEntity의 ID
    const scheduleId = selectedEvent.extendedProps.sourceId || selectedEvent.id;

    const requestData = {
      eventType: form.eventType,
      title: form.title,
      start: form.start,
      end: form.end,
      content: form.content,
    };

    try {
      await jwtAxios.put(
        `${API_URL}/api/schedule/update/${scheduleId}`,
        requestData,
      );

      await getCalendarList();
      closeModal();
    } catch (err) {
      console.error("일정 수정 실패:", err);
      alert("일정 수정에 실패했습니다.");
    }
  };

  // 일정 삭제
  const handleDelete = async () => {
    if (!selectedEvent) {
      return;
    }

    const editable = selectedEvent.extendedProps.editable;

    if (editable === false) {
      alert("삭제할 수 없는 일정입니다.");
      return;
    }

    if (!window.confirm("일정을 삭제하시겠습니까?")) {
      return;
    }

    const scheduleId = selectedEvent.extendedProps.sourceId || selectedEvent.id;

    try {
      await jwtAxios.delete(`${API_URL}/api/schedule/delete/${scheduleId}`);

      await getCalendarList();
      closeModal();
    } catch (err) {
      console.error("일정 삭제 실패:", err);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="member-schedule">
        <div className="member-schedule-wrap">
          <div className="member-schedule-title">
            <h2>My Schedule</h2>

            <div className="member-schedule-filter">
              <button type="button" onClick={() => setEventType("ALL")}>
                전체
              </button>

              <button type="button" onClick={() => setEventType("WORKOUT")}>
                운동
              </button>

              <button type="button" onClick={() => setEventType("PERSONAL")}>
                개인
              </button>
            </div>
          </div>

          <div className="member-schedule-con">
            <div className="member-schedule-top">
              <div className="member-schedule-calendar">
                <CommonCalendar
                  events={calendarEvents}
                  onDateClick={openInsertModal}
                  onEventClick={openDetailModal}
                />
              </div>
            </div>

            <div className="member-schedule-bottom">
              <div className="member-schedule-today">
                <div className="member-schedule-today-con">
                  스케줄(ToDoList)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="schedule-modal">
          <div className="schedule-modal-wrap">
            <div className="schedule-modal-title">
              <h3>
                {modalMode === "insert" && "일정 등록"}
                {modalMode === "detail" && "일정 상세"}
                {modalMode === "update" && "일정 수정"}
              </h3>

              <button type="button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="schedule-modal-con">
              <div>
                <label>일정 유형</label>

                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  disabled={modalMode === "detail"}
                >
                  <option value="PERSONAL">개인 일정</option>
                  <option value="WORKOUT">운동 일정</option>
                </select>
              </div>

              <div>
                <label>제목</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>

              <div>
                <label>시작일</label>

                <input
                  type="datetime-local"
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>

              <div>
                <label>종료일</label>

                <input
                  type="datetime-local"
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>

              <div>
                <label>내용</label>

                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>
            </div>

            <div className="schedule-modal-buttons">
              {modalMode === "insert" && (
                <>
                  <button type="button" onClick={handleInsert}>
                    등록
                  </button>

                  <button type="button" onClick={closeModal}>
                    취소
                  </button>
                </>
              )}

              {modalMode === "detail" && (
                <>
                  {selectedEvent?.extendedProps?.editable !== false && (
                    <>
                      <button type="button" onClick={changeUpdateMode}>
                        수정
                      </button>

                      <button type="button" onClick={handleDelete}>
                        삭제
                      </button>
                    </>
                  )}

                  <button type="button" onClick={closeModal}>
                    닫기
                  </button>
                </>
              )}

              {modalMode === "update" && (
                <>
                  <button type="button" onClick={handleUpdate}>
                    수정 완료
                  </button>

                  <button type="button" onClick={() => setModalMode("detail")}>
                    취소
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MySchedule;
