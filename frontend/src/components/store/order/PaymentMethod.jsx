import React from 'react';

const PaymentMethod = () => {
  return (
    <div className="paymentMethod">

      <h2>결제 방법</h2>

      <div>
        <label>
          <input 
            type="radio"
            name="payment"
            value="kakao"
          />
          카카오페이
        </label>
      </div>


      <div>
        <label>
          <input 
            type="radio"
            name="payment"
            value="card"
          />
          카드 결제
        </label>
      </div>


      <div>
        <label>
          <input 
            type="radio"
            name="payment"
            value="bank"
          />
          계좌이체
        </label>
      </div>

    </div>
  );
};

export default PaymentMethod;