import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialInputData = {
  productId: '',
  memberId: '',
  productPrice: '',
  productName: ''
};

const KakaoPay = () => {
  const [inData, setInData] = useState(initialInputData);
  const navigate = useNavigate();

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    setInData((prev) => ({ ...prev, [name]: value }));
  };

  const kakaoPayFn = () => {
    const { productId, memberId, productPrice, productName } = inData;
    if (!productId || !memberId || !productPrice || !productName) {
      alert("모든 결제 정보를 입력해주세요.");
      return;
    }

    fetch(`http://localhost:8095/payment/kakao/pg?productId=${productId}&memberId=${memberId}&productPrice=${productPrice}&productName=${productName}`)
      .then(res => res.json())
      .then(json => {
        if (json.approvalUrl) {
          window.location.href = json.approvalUrl;
        } else {
          alert("결제 URL을 전송받지 못했습니다.");
        }
      });
  };

  return (
    <div className="kakaoPay">
      <div className="kakaoPay-con">
        <h1>카카오페이 결제</h1>
        <div className="form">
          <ul>
            <li>
              <label htmlFor="productId">상품 번호 (Product ID)</label>
              <input 
                type="text" name="productId" id="productId" 
                value={inData.productId} onChange={handleChangeProduct}
                placeholder="주문할 상품 번호를 입력하세요" 
              />
            </li>
            <li>
              <label htmlFor="memberId">회원 번호 (Member ID)</label>
              <input 
                type="text" name="memberId" id="memberId" 
                value={inData.memberId} onChange={handleChangeProduct}
                placeholder="주문자 회원 번호를 입력하세요" 
              />
            </li>
            <li>
              <label htmlFor="productPrice">결제 금액 (Price)</label>
              <input 
                type="text" name="productPrice" id="productPrice" 
                value={inData.productPrice} onChange={handleChangeProduct}
                placeholder="결제할 총 금액을 입력하세요" 
              />
            </li>
            <li>
              <label htmlFor="productName">상품명 (Product Name)</label>
              <input 
                type="text" name="productName" id="productName" 
                value={inData.productName} onChange={handleChangeProduct}
                placeholder="주문 상품 이름을 입력하세요" 
              />
            </li>
          </ul>
        </div>
        <button onClick={kakaoPayFn}>카카오페이로 안전결제</button>
        <button onClick={() => navigate('/react/kakaoPay/list')}>결제 내역 목록 보기</button>
      </div>
    </div>
  );
};

export default KakaoPay;