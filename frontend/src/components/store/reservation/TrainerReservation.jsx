import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerReservation = () => {

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getReservationList();
  }, []);

  // 트레이너 예약 조회
  const getReservationList = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8090/api/reservation/trainer"
      );
      setReservations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 예약 상태 변경
  const changeStatus = async (id, status) => {

    try {
      await axios.put(
        `http://localhost:8090/api/reservation/${id}`,
        {
          reservationStatus: status
        }
      );
      getReservationList();

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="trainer-reservation">
      <h2>
        PT 예약 관리
      </h2>
      {
        reservations.length === 0 ? (
          <p>
            예약된 PT가 없습니다.
          </p>
        ) : (
          reservations.map((reservation) => (

            <div
              key={reservation.id}
              className="reservation-card"
            >
              <h3>{reservation.memberName}</h3>

              <p>
                예약 시간 :
                {" "}
                {reservation.reservationTime}
              </p>

              <p>
                요청사항 :
                {" "}
                {reservation.memo || "없음"}
              </p>

              <p>
                상태 :
                {" "}
                {reservation.reservationStatus}
              </p>

              {reservation.reservationStatus === "RESERVED" && (
                <>
                  <button
                    onClick={() =>
                      changeStatus(
                        reservation.id,
                        "COMPLETE"
                      )}>
                    완료
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        reservation.id,
                        "CANCEL"
                      )}>
                    취소
                  </button>
                </>
              )}
            </div>
          ))
        )}
    </div>
  );
};

export default TrainerReservation;