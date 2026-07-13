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
              <span>회원아이디</span>
            </li>
            {data && data.map((el, idx) => {
              return (
                <li key={el.paymentResultId}>
                  <span>{el.memberId}</span>
                  <span>{el.productName}</span>
                  <span>{el.productPrice}</span>
                  <span>{el.paymentId}</span>
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