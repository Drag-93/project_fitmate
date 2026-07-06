import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import "../css/admin/Admin.css";

const AdminCalendar = () => {
  // 분류별 메뉴 변수 선언
  const [selectMenu, setSelectMenu] = useState("my-schedule");

  const filteredEvents = events.filter((event) => {
    if (selectMenu === "whole-schedule") return true;
    return event.type === selectMenu;
  });

  //기본 일정 추가 -> 변동 가능
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "일정",
      start: "2026-07-06T10:00",
      end: "2026-07-06T11:00",
      content: "기본 일정입니다.",
      type: "my-schedule",
    },
  ]);

  //입력 default
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
    content: "",
  });

  //모달 관련 변수 선언
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("insert"); // insert, detail, update
  const [selectedEvent, setSelectedEvent] = useState(null);

  //모달 open
  const openInsertModal = (info) => {
    setModalMode("insert");
    setSelectedEvent(null);
    setForm({
      title: "",
      start: `${info.dateStr}T09:00`,
      end: `${info.dateStr}T10:00`,
      content: "",
    });
    setIsModalOpen(true);
  };

  const openDetailModal = (info) => {
    const event = info.event;

    setSelectedEvent(event);
    setModalMode("detail");
    setForm({
      title: event.title,
      start: event.startStr.slice(0, 16),
      end: event.endStr
        ? event.endStr.slice(0, 16)
        : event.startStr.slice(0, 16),
      content: event.extendedProps.content || "",
    });
    setIsModalOpen(true);
  };
  //모달 close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalMode("insert");
    setForm({
      title: "",
      start: "",
      end: "",
      content: "",
    });
  };

  //onchange -> 입력값 유지
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  //모달 crud
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

  const handleInsert = () => {
    if (!validateForm()) return;

    const newEvent = {
      id: Date.now().toString(),
      title: form.title,
      start: form.start,
      end: form.end,
      content: form.content,
      type: selectMenu === "whole-schedule" ? "my-schedule" : selectMenu,
    };

    setEvents([...events, newEvent]);
    closeModal();
  };

  const handleUpdate = () => {
    if (!selectedEvent) return;
    if (!validateForm()) return;

    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: form.title,
              start: form.start,
              end: form.end,
              content: form.content,
            }
          : event,
      ),
    );

    closeModal();
  };

  const handleDelete = () => {
    if (!selectedEvent) return;

    if (!window.confirm("일정을 삭제하시겠습니까?")) return;

    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    closeModal();
  };

  return (
    <div className="admin-main">
      <div className="adminCalendar-wrap">
        {/* 메뉴  */}
        <div className="adminCalendar-left">
          <ul>
            <li
              onClick={() => setSelectMenu("my-schedule")}
              className={selectMenu === "my-schedule" ? "active" : ""}
            >
              내 일정
            </li>
            <li
              onClick={() => setSelectMenu("team-schedule")}
              className={selectMenu === "team-schedule" ? "active" : ""}
            >
              팀 일정
            </li>
            <li
              onClick={() => setSelectMenu("whole-schedule")}
              className={selectMenu === "whole-schedule" ? "active" : ""}
            >
              전체 일정
            </li>
          </ul>
        </div>
        {/* 캘린더 메인 */}
        <div className="adminCalendar">
          <div className="adminCalendar-con">
            <div className="adminCalendar-title">
              <h2>
                {selectMenu === "my-schedule" && "내 일정"}
                {selectMenu === "team-schedule" && "팀 일정"}
                {selectMenu === "whole-schedule" && "전체 일정"}
              </h2>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={koLocale}
              height="75vh"
              events={filteredEvents}
              dateClick={openInsertModal}
              eventClick={openDetailModal}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "오늘",
                month: "월",
                week: "주",
                day: "일",
              }}
            />
          </div>
        </div>
      </div>
      {/* crud 모달 통합 */}
      {isModalOpen && (
        <div className="calendar-modal-bg" onClick={closeModal}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <h3>
                {modalMode === "insert" && "일정 등록"}
                {modalMode === "detail" && "일정 상세"}
                {modalMode === "update" && "일정 수정"}
              </h3>
              <button type="button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="calendar-modal-body">
              <label>일정 제목</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={modalMode === "detail"}
              />

              <label>시작일</label>
              <input
                type="datetime-local"
                name="start"
                value={form.start}
                onChange={handleChange}
                disabled={modalMode === "detail"}
              />

              <label>종료일</label>
              <input
                type="datetime-local"
                name="end"
                value={form.end}
                onChange={handleChange}
                disabled={modalMode === "detail"}
              />

              <label>내용</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                disabled={modalMode === "detail"}
              />
            </div>

            <div className="calendar-modal-footer">
              {modalMode === "insert" && (
                <button type="button" onClick={handleInsert}>
                  등록
                </button>
              )}

              {modalMode === "detail" && (
                <>
                  <button type="button" onClick={() => setModalMode("update")}>
                    수정
                  </button>
                  <button type="button" onClick={handleDelete}>
                    삭제
                  </button>
                </>
              )}

              {modalMode === "update" && (
                <button type="button" onClick={handleUpdate}>
                  수정 완료
                </button>
              )}

              <button type="button" onClick={closeModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
