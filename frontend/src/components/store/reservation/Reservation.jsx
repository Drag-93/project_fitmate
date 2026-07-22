import React, { useEffect, useState } from "react";
import jwtAxios from "../../../apis/util/jwtUtil";
import "../../../components/css/store/reservation/reservation.css";
import CommonCalendar from "../../common/calendar/CommonCalendar";


const Reservation = () => {

  const [myProducts, setMyProducts] = useState([]); // 보유한 Active PT 이용권 목록
  const [selectedProduct, setSelectedProduct] = useState(null); // 선택한 이용권
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const [selectedDate, setSelectedDate] = useState(""); // 선택한 날짜 (YYYY-MM-DD)
  const [availableSlots, setAvailableSlots] = useState([]); // 해당 날짜의 예약 가능 시간 목록
  const [reservationTime, setReservationTime] = useState(""); // 최종 선택한 시간 (HH:mm)
  const [memo, setMemo] = useState("");

  // 초기 데이터 조회: 트레이너 목록 & 내 보유 PT 이용권 목록
  useEffect(() => {
    getTrainerList();
    getMyPtProducts();
  }, []);


  // 트레이너 목록 조회
  const getTrainerList = async () => {
    try {
      const res = await jwtAxios.get("http://localhost:8090/api/trainer/list");
      setTrainers(res.data);
    } catch (error) {
      console.log("트레이너 목록 조회 실패:", error);
    }
  };
  // 내 활성 PT 이용권 조회 (remainingCount > 0 인 것만)
  const getMyPtProducts = async () => {
    try {
      const res = await jwtAxios.get("http://localhost:8090/api/member-products/active-pt");
      setMyProducts(res.data);
      // 이용권이 1개만 있다면 자동 선택
      if (res.data.length === 1) {
        setSelectedProduct(res.data[0]);
      }
    } catch (error) {
      console.log("보유 이용권 조회 실패:", error);
    }
  };
  // 날짜 선택 시 해당 트레이너의 예약 가능 타임슬롯 조회
  const handleDateClick = async (info) => {
    const dateStr = info.dateStr;
    setSelectedDate(dateStr);
    setReservationTime(""); // 날짜 바뀌면 선택했던 시간 초기화

    if (!selectedTrainer) {
      alert("트레이너를 먼저 선택해 주세요.");
      return;
    }

    try {
      // 해당 트레이너 + 해당 날짜의 가능 시간대 API 호출 (예시)
      const res = await Jwt.get(
        `http://localhost:8090/api/reservation/available-slots`,
        { params: { trainerId: selectedTrainer.id, date: dateStr } }
      );
      // 예: ["09:00", "10:00", "14:00", "15:00"]
      setAvailableSlots(res.data);
    } catch (error) {
      // API 준비 전 테스트용 더미 타임슬롯 (필요시 제거)
      setAvailableSlots(["10:00", "11:00", "14:00", "15:00", "16:00", "19:00"]);
    }
  };
  // 예약 신청
  const handleReservation = async () => {
    if (!selectedProduct) {
      alert("사용할 PT 이용권을 선택해 주세요.");
      return;
    }
    if (selectedProduct.remainingCount <= 0) {
      alert("해당 이용권의 잔여 횟수가 없습니다.");
      return;
    }
    if (!selectedTrainer) {
      alert("트레이너를 선택해 주세요.");
      return;
    }
    if (!selectedDate || !reservationTime) {
      alert("예약 날짜와 시간을 선택해 주세요.");
      return;
    }

    // 백엔드로 보낼 DTO 구조
    const data = {
      memberProductId: selectedProduct.id, // 핵심: 횟수 차감 대상 이용권 PK
      trainerId: selectedTrainer.id,
      reservationDate: selectedDate,       // LocalDate (YYYY-MM-DD)
      reservationTime: reservationTime,   // LocalTime (HH:mm)
      memo: memo
    };

    try {
      await jwtAxios.post("http://localhost:8090/api/reservation", data);
      alert("PT 예약이 성공적으로 완료되었습니다!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "예약에 실패했습니다.");
    }
  };

  return (
    <div className="reservation">
      <div className="reservation-con">
        <h2>PT 예약하기</h2>

        {/* 1. 보유 PT 이용권 선택 */}
        <section className="product-section">
          <h3>사용할 이용권 선택</h3>
          {myProducts.length === 0 ? (
            <p className="no-product">보유 중인 활성 PT 이용권이 없습니다. 먼저 이용권을 구매해 주세요.</p>
          ) : (
            <div className="product-list">
              {myProducts.map((prod) => (
                <div
                  key={prod.id}
                  className={selectedProduct?.id === prod.id ? "product-card active" : "product-card"}
                  onClick={() => setSelectedProduct(prod)}
                >
                  <h4>{prod.productName}</h4>
                  <p>잔여 횟수: <strong>{prod.remainingCount}회</strong></p>
                  <p>유효기간: ~ {prod.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. 트레이너 선택 */}
        <section>
          <h3>트레이너 선택</h3>
          <div className="trainer-list">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className={selectedTrainer?.id === trainer.id ? "trainer-card active" : "trainer-card"}
                onClick={() => {
                  setSelectedTrainer(trainer);
                  setSelectedDate("");
                  setReservationTime("");
                }}
              >
                <img
                  src={
                    trainer.profileImage
                      ? `http://localhost:8090${trainer.profileImage}`
                      : "/images/default.png"
                  }
                  alt="trainer"
                />
                <h4>{trainer.name}</h4>
                <p>{trainer.specialty}</p>
                <p>{trainer.career}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 날짜 및 시간 선택 */}
        {selectedTrainer && (
          <section className="datetime-section">
            <h3>예약 날짜 및 시간 선택</h3>
            <div className="calendar-box">
              <CommonCalendar
                events={[]}
                onDateClick={handleDateClick}
                validRange={{ start: new Date() }}
              />
            </div>

            {selectedDate && (
              <div className="time-slot-box">
                <h4>{selectedDate} 예약 가능 시간</h4>
                <div className="time-slots">
                  {availableSlots.map((timeStr) => (
                    <button
                      key={timeStr}
                      type="button"
                      className={reservationTime === timeStr ? "time-btn active" : "time-btn"}
                      onClick={() => setReservationTime(timeStr)}
                    >
                      {timeStr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 4. 요청사항 */}
        <section>
          <h3>요청사항 (선택)</h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="운동 목적이나 주의해야 할 건강 상태(통증, 부상 등)를 적어주세요."
          />
        </section>

        {/* 예약 확정 버튼 */}
        <div className="reservation-action">
          <button
            className="reserve-submit-btn"
            onClick={handleReservation}
            disabled={!selectedProduct || !selectedTrainer || !selectedDate || !reservationTime}
          >
            PT 1회 차감 후 예약 확정하기
          </button>
        </div>
      </div>
    </div>
  );

};


export default Reservation;