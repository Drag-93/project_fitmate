import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../components/css/store/reservation/reservation.css";

const Reservation = () => {

  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [reservationTime, setReservationTime] = useState("");
  const [memo, setMemo] = useState("");


  // 트레이너 목록 조회
  useEffect(() => {

    getTrainerList();

  }, []);


  const getTrainerList = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8090/api/trainer"
      );

      setTrainers(res.data);

    } catch (error) {
      console.log(error);
    }
  };


  // 예약 신청
  const handleReservation = async () => {

    if (!selectedTrainer) {
      alert("트레이너를 선택해주세요.");
      return;
    }

    if (!reservationTime) {
      alert("예약 시간을 선택해주세요.");
      return;
    }

    const data = {
      trainerId: selectedTrainer.id,
      reservationTime: reservationTime,
      memo: memo
    };

    try {
      await axios.post(
        "http://localhost:8090/api/reservation",
        data
      );
      alert("예약 완료");
    } catch (error) {
      console.log(error);
      alert("예약 실패");
    }
  };

  return (

    <div className="reservation">
      <div className="reservation-con">

        <h2>PT 예약</h2>
        {/* 트레이너 선택 */}
        <section>

          <h3>트레이너 선택</h3>
          <div className="trainer-list">
            {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className={
                    selectedTrainer?.id === trainer.id
                      ? "trainer-card active"
                      : "trainer-card"
                  }
                  onClick={() => setSelectedTrainer(trainer)}>
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

        {/* 예약 시간 */}
        <section>
          <h3>예약 시간 선택</h3>
          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
          />
        </section>

        {/* 요청사항 */}
        <section>
          <h3>요청사항</h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="트레이너에게 전달할 내용을 입력하세요."
          />
        </section>

        <button
          onClick={handleReservation}
        >
          예약하기
        </button>
      </div>
    </div>
  );

};


export default Reservation;