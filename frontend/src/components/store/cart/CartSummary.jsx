import React from "react";
import { useNavigate } from "react-router-dom";


const CartSummary = ({cartItems}) => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );
  const handleBuy = () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }
    navigate("/order", {
      state: {
        cartItems,
        totalPrice
      }
    });
  };
  
  return (
    <div className="cart-summary">
      <h3> 총 결제금액 </h3>
      <p>
        {totalPrice.toLocaleString()}원
      </p>
      <button onClick={handleBuy}>
        바로 구매
      </button>
    </div>
  );
};

export default CartSummary;