import React, { useEffect, useState } from 'react'

const KakaoPayList = () => {

  const [data, setData] = useState()

  useEffect(() => {

    const fn1 = async (e) => {
      const response = await fetch("http://localhost:8095/payment/list")
      const result = await response.json();
      setData(result.payRsList)
    }

    fn1()
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