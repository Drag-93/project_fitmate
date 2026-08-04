import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CommonCalendar from "../common/calendar/CommonCalendar";
import { API_SERVER_URL } from "../../apis/commonApi";
import jwtAxios from "../../apis/util/jwtUtil";
import "../../css/trainer/TrainerSchedule.css";

// 일정 등록·수정 폼 초기값
const initForm = {
  eventType: "PERSONAL",
  title: "",
  startTime: "",
  endTime: "",
  description: "",
  attachFile: null,
  oldFileName: "",
  newFileName: "",
};

const TrainerSchedule = () => {
  // 로그인 회원 정보
  const user = useSelector((state) => state.loginSlice);
  const isLogin = !!user?.userEmail;
  const API_URL = API_SERVER_URL;

  // 조회할 일정 유형: ALL / PT / PERSONAL
  const [eventType, setEventType] = useState("ALL");

  // 캘린더 일정 목록
  const [calendarEvents, setCalendarEvents] = useState([]);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // insert / detail / update
  const [modalMode, setModalMode] = useState("insert");

  // 현재 선택한 캘린더 일정
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 등록·수정 입력값
  const [form, setForm] = useState(initForm);

  // 트레이너가 직접 등록한 개인 일정 조회
  const getPersonalCalendar = async (type = "ALL") => {
    if (!isLogin) {
      return [];
    }

    try {
      const res = await jwtAxios.get(`${API_URL}/api/calendar/scheduleList`, {
        params: {
          eventType: type,
        },
      });

      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("트레이너 개인 일정 조회 실패:", err);
      return [];
    }
  };

  // 트레이너 담당 PT 일정 조회
  const getTrainerCalendar = async () => {
    if (!isLogin) {
      return [];
    }

    try {
      const res = await jwtAxios.get(`${API_URL}/api/calendar/trainer`);

      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("트레이너 PT 일정 조회 실패:", err);
      return [];
    }
  };

  const loadCalendar = async () => {
    if (!isLogin) {
      setCalendarEvents([]);
      return;
    }

    try {
      // PT 일정만
      if (eventType === "PT") {
        const trainerEvents = await getTrainerCalendar();
        setCalendarEvents(trainerEvents);
        return;
      }

      // 개인 일정만
      if (eventType === "PERSONAL") {
        const personalEvents = await getPersonalCalendar("PERSONAL");
        setCalendarEvents(personalEvents);
        return;
      }

      // 전체: 개인 일정 + 담당 PT 일정
      const [personalEvents, trainerEvents] = await Promise.all([
        getPersonalCalendar("ALL"),
        getTrainerCalendar(),
      ]);

      setCalendarEvents([...personalEvents, ...trainerEvents]);
    } catch (err) {
      console.error("트레이너 캘린더 조회 실패:", err);
      setCalendarEvents([]);
    }
  };

  // 로그인 상태 또는 조회 유형 변경 시 재조회
  useEffect(() => {
    loadCalendar();
  }, [isLogin, eventType]);

  // 날짜 클릭 시 등록 모달 열기
  const openInsertModal = (info) => {
    setModalMode("insert");
    setSelectedEvent(null);

    setForm({
      ...initForm,
      startTime: `${info.dateStr}T09:00`,
      endTime: `${info.dateStr}T10:00`,
    });

    setIsModalOpen(true);
  };

  // 모달 닫기 및 상태 초기화
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalMode("insert");
    setForm(initForm);
  };

  // 일반 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 첨부파일 변경
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      attachFile: selectedFile,
    }));
  };

  // 입력값 검증
  const validateForm = () => {
    if (!form.title.trim()) {
      alert("일정 제목을 입력하세요.");
      return false;
    }

    if (!form.startTime || !form.endTime) {
      alert("시작일과 종료일을 입력하세요.");
      return false;
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      alert("종료일은 시작일보다 늦어야 합니다.");
      return false;
    }

    return true;
  };

  // 일정 데이터를 FormData로 생성
  const createScheduleFormData = () => {
    const formData = new FormData();

    formData.append("eventType", form.eventType);
    formData.append("title", form.title);
    formData.append("startTime", form.startTime);
    formData.append("endTime", form.endTime);
    formData.append("description", form.description || "");

    // 수정 시 새 파일을 선택하지 않으면 기존 파일 유지
    if (form.attachFile) {
      formData.append("attachFile", form.attachFile);
    }

    return formData;
  };

  // 일정 등록
  const handleInsert = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = createScheduleFormData();

    try {
      await jwtAxios.post(`${API_URL}/api/calendar/insert`, formData);

      await loadCalendar();
      closeModal();
    } catch (err) {
      console.error("일정 등록 실패:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "일정 등록에 실패했습니다.",
      );
    }
  };

  // 수정 모드 전환
  const changeUpdateMode = () => {
    if (!selectedEvent) {
      return;
    }

    if (selectedEvent.editable === false) {
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

    if (selectedEvent.editable === false) {
      alert("수정할 수 없는 일정입니다.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const scheduleId = selectedEvent.sourceId || selectedEvent.id;
    const formData = createScheduleFormData();

    try {
      await jwtAxios.put(
        `${API_URL}/api/calendar/update/${scheduleId}`,
        formData,
      );

      await loadCalendar();
      closeModal();
    } catch (err) {
      console.error("일정 수정 실패:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "일정 수정에 실패했습니다.",
      );
    }
  };

  // 일정 삭제
  const handleDelete = async () => {
    if (!selectedEvent) {
      return;
    }

    if (selectedEvent.editable === false) {
      alert("삭제할 수 없는 일정입니다.");
      return;
    }

    if (!window.confirm("일정을 삭제하시겠습니까?")) {
      return;
    }

    const scheduleId = selectedEvent.sourceId || selectedEvent.id;

    try {
      await jwtAxios.delete(`${API_URL}/api/calendar/delete/${scheduleId}`);

      await loadCalendar();
      closeModal();
    } catch (err) {
      console.error("일정 삭제 실패:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "일정 삭제에 실패했습니다.",
      );
    }
  };

  // datetime-local 입력값 형식으로 변환
  const formatDateTimeLocal = (dateTime) => {
    if (!dateTime) {
      return "";
    }

    return dateTime.slice(0, 16);
  };

  // CalendarDto 데이터를 상세 모달에 반영
  const openScheduleDetail = (schedule) => {
    const selectedSchedule = {
      id: schedule.id,
      sourceId: schedule.sourceId || schedule.id,
      eventType: schedule.eventType || "PERSONAL",
      title: schedule.title || "",
      start: schedule.start || "",
      end: schedule.end || "",
      description: schedule.description || "",
      editable: schedule.editable ?? false,
      oldFileName: schedule.oldFileName || "",
      newFileName: schedule.newFileName || "",
    };

    setSelectedEvent(selectedSchedule);
    setModalMode("detail");

    setForm({
      ...initForm,
      eventType: selectedSchedule.eventType,
      title: selectedSchedule.title,
      startTime: formatDateTimeLocal(selectedSchedule.start),
      endTime: formatDateTimeLocal(selectedSchedule.end),
      description: selectedSchedule.description,
      oldFileName: selectedSchedule.oldFileName,
      newFileName: selectedSchedule.newFileName,
      attachFile: null,
    });

    setIsModalOpen(true);
  };

  // FullCalendar 일정 클릭
  const openDetailModal = (info) => {
    const event = info.event;

    openScheduleDetail({
      id: event.id,
      sourceId: event.extendedProps.sourceId || event.id,
      eventType: event.extendedProps.eventType,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      description: event.extendedProps.description,
      editable: event.extendedProps.editable,
      oldFileName: event.extendedProps.oldFileName,
      newFileName: event.extendedProps.newFileName,
    });
  };

  // 오늘 날짜(00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // CalendarDto.start 기준 오늘 일정 조회
  const todayScheduleList = calendarEvents.filter((schedule) => {
    if (!schedule.start) {
      return false;
    }

    const scheduleDate = new Date(schedule.start);
    scheduleDate.setHours(0, 0, 0, 0);

    return scheduleDate.getTime() === today.getTime();
  });

  // 시간 표시
  const formatScheduleTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return dateTime.slice(11, 16);
  };

  return (
    <>
      <div className="trainer-schedule">
        <div className="trainer-schedule-wrap">
          <div className="trainer-schedule-title">
            <h2>My Schedule</h2>

            <div className="trainer-schedule-filter">
              <button
                type="button"
                className={eventType === "ALL" ? "active" : ""}
                onClick={() => setEventType("ALL")}
              >
                전체
              </button>

              <button
                type="button"
                className={eventType === "PT" ? "active" : ""}
                onClick={() => setEventType("PT")}
              >
                PT 일정
              </button>

              <button
                type="button"
                className={eventType === "PERSONAL" ? "active" : ""}
                onClick={() => setEventType("PERSONAL")}
              >
                개인 일정
              </button>
            </div>
          </div>

          <div className="trainer-schedule-con">
            <div className="trainer-schedule-top">
              <div className="trainer-schedule-calendar">
                <CommonCalendar
                  events={calendarEvents}
                  onDateClick={openInsertModal}
                  onEventClick={openDetailModal}
                />
              </div>
            </div>

            <div className="trainer-schedule-bottom">
              <div className="trainer-schedule-today">
                <div className="trainer-schedule-today-title">
                  <h3>오늘의 스케줄</h3>
                </div>

                <div className="trainer-schedule-today-con">
                  {todayScheduleList.length === 0 ? (
                    <p>오늘 등록된 일정이 없습니다.</p>
                  ) : (
                    <ul>
                      {todayScheduleList.map((schedule) => (
                        <li
                          key={`${schedule.eventType}-${schedule.sourceId || schedule.id}`}
                        >
                          <button
                            type="button"
                            onClick={() => openScheduleDetail(schedule)}
                          >
                            <span>{schedule.title}</span>

                            <span>{formatScheduleTime(schedule.start)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 일정 등록·상세·수정 모달 */}
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
                  {form.eventType === "PT" && (
                    <option value="PT">PT 일정</option>
                  )}
                  <option value="PERSONAL">개인 일정</option>
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
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>

              <div>
                <label>종료일</label>

                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>

              <div>
                <label>내용</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  readOnly={modalMode === "detail"}
                />
              </div>

              <div>
                <label>첨부 이미지</label>

                {modalMode !== "detail" && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                )}

                {form.attachFile && <p>선택 파일: {form.attachFile.name}</p>}

                {form.newFileName && (
                  <div className="schedule-image-preview">
                    <img
                      src={`${API_URL}/upload/schedule/${form.newFileName}`}
                      alt={form.oldFileName || "일정 이미지"}
                    />

                    {form.oldFileName && <p>기존 파일: {form.oldFileName}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="schedule-modal-buttons">
              {/* 등록 모드 */}
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

              {/* 상세 모드 */}
              {modalMode === "detail" && (
                <>
                  {selectedEvent?.editable !== false && (
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

              {/* 수정 모드 */}
              {modalMode === "update" && (
                <>
                  <button type="button" onClick={handleUpdate}>
                    수정 완료
                  </button>

                  <button type="button" onClick={closeModal}>
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

export default TrainerSchedule;
