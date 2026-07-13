import React, { useState } from 'react';

const BuyerInfo = ({ orderInfo, setOrderInfo }) => {

  const handleChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="buyerInfo">

      <h2>주문자 정보</h2>

      <div className="inputBox">
        <label>이름</label>
        <input
          name="receiverName"
          value={orderInfo.receiverName}
          onChange={handleChange}
          placeholder="이름 입력"
        />
      </div>

      <div className="inputBox">
        <label>연락처</label>
        <input
          name="receiverPhone"
          value={orderInfo.receiverPhone}
          onChange={handleChange}
          placeholder="전화번호 입력"
        />
      </div>


      <h2>배송 정보</h2>

      <div className="inputBox">
        <label>주소</label>
        <input
          name="address"
          value={orderInfo.address}
          onChange={handleChange}
          placeholder="주소 입력"
        />
      </div>

      
      <div className="inputBox">
        <label>배송 요청사항</label>
        <input
          name="delibetyMemo"
          value={orderInfo.delibetyMemo}
          onChange={handleChange}
          placeholder="배송 요청사항"
        />
      </div>

    </div>
  );
};

export default BuyerInfo;