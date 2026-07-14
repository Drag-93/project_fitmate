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

  // 장바구니 주문 데이터
  const cartItems = location.state?.cartItems || [];
  const cartIds = location.state?.cartIds || [];
  const totalPrice = location.state?.totalPrice || 0;
  // 바로구매 데이터
  const directItem = location.state?.directItem;

  const isDirect = !!directItem;

  const orderData = {
    ...orderInfo,

    orderItemDtos: directItem
      ? [
        {
          productId: directItem.productId,
          quantity: directItem.quantity
        }
      ]
      : []
      
  };

  return (
    <div className="orderPage">
      <div className="orderPage-con">
        <h1>주문하기</h1>
        <div className="orderContainer">
          <div className="left">
            <ProductList
              cartItems={
                directItem
                  ? [directItem]
                  : cartItems} />
            <BuyerInfo
              orderInfo={orderInfo}
              setOrderInfo={setOrderInfo} />
            <PaymentMethod />
          </div>

          <div className="right">
            <OrderRight
              cartIds={cartIds}
              orderData={orderData}
              totalPrice={
                directItem
                  ? directItem.price * directItem.quantity
                  : totalPrice
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage;