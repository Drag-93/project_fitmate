import React, { useState } from 'react'

import ProductList from "../../../components/store/order/ProductList";
import BuyerInfo from "../../../components/store/order/BuyerInfo";
import PaymentMethod from "../../../components/store/order/PaymentMethod";
import OrderRight from "../../../components/store/order/OrderRight";
import { useLocation } from 'react-router-dom';
import "../../../components/css/store/order/OrderPage.css"

const OrderPage = () => {
  const location = useLocation();

  const [orderInfo, setOrderInfo] = useState({
    receiverName: "",
    receiverPhone: "",
    address: "",
    deliveryMemo: ""
  });

  const cartItems = location.state?.cartItems || [];
  const cartIds = location.state?.cartIds || [];
  const totalPrice = location.state?.totalPrice || 0;

  const orderData = {
    ...orderInfo,
    cartIds
  };
  return (
    <div className="orderPage">
      <div className="orderPage-con">
        <h1>주문하기</h1>
        <div className="orderContainer">
          <div className="left">
            <ProductList cartItems={cartItems} />
            <BuyerInfo 
              orderInfo={orderInfo}
              setOrderInfo={setOrderInfo}/>
            <PaymentMethod />
          </div>

          <div className="right">
            <OrderRight cartIds={cartIds}
              orderData={orderData}
              totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage;