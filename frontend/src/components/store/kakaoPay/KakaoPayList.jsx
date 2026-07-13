import React, { useEffect, useState } from 'react'

const KakaoPayList = () => {

  const [data, setData] = useState()

  useEffect(() => {

    const fetchPaymentList = async (e) => {
      try {
        const response = await fetch("http://localhost:8090/api/payment/list",
          {
            credentials: "include"
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPaymentList()
  }, [])


  return (
    <>
      <div className="kakaoPayList">
        <div className="kakaoPayList-con">
          <h3>KakoPay 결제 목록</h3>
          <ul>
            <li>
              <span>결제아이디</span>
              <span>상품명</span>
              <span>결제금액</span>
              <span>결제상태</span>
            </li>
            {data.map((payment) => {
              return (
                <li key={payment.id}>
                  <span>{payment.id}</span>
                  <span>{payment.productName}</span>
                  <span>{payment.amount?.toLocaleString()}원</span>
                  <span>{payment.paymentStatus}</span>
                </li>
              )
            })}
            
          </ul>
        </div>
      </div>
    </>
  )
}

export default KakaoPayList