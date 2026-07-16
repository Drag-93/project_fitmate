import React, { useState } from 'react';

const BuyerInfo = ({ member, orderInfo, setOrderInfo }) => {

  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value
    });
  };


  return (
    <div className="buyerInfo">

      <h2>
        배송 정보
        <button
          type="button"
          onClick={() => setIsEdit(!isEdit)}
        >
          {isEdit ? "완료" : "변경하기"}
        </button>
      </h2>


      <div className="inputBox">
        <label>받는 분</label>
        <input
          name="receiverName"
          value={orderInfo.receiverName || ""}
          onChange={handleChange}
          readOnly={!isEdit}
        />
      </div>


      <div className="inputBox">
        <label>연락처</label>
        <input
          name="receiverPhone"
          value={orderInfo.receiverPhone || ""}
          onChange={handleChange}
          readOnly={!isEdit}
        />
      </div>


      <div className="inputBox">
        <label>주소</label>
        <input
          name="receiverAddress"
          value={orderInfo.receiverAddress || ""}
          onChange={handleChange}
          readOnly={!isEdit}
        />
      </div>


      <div className="inputBox">
        <label>배송 요청사항</label>
        <input
          name="deliveryMemo"
          value={orderInfo.deliveryMemo || ""}
          onChange={handleChange}
          readOnly={!isEdit}
        />
      </div>

    </div>
  );
};


export default BuyerInfo;