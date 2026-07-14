const OrderDetail = ({ order }) => {

  if (!order) {
    return <p>주문 정보를 불러오는 중...</p>;
  }

  return (
    <div className="order-detail">

      <h2>주문 상세</h2>

      <div className="order-info">
        <p><strong>주문번호</strong> : {order.id}</p>
        <p><strong>주문일</strong> : {order.orderDate?.substring(0, 10)}</p>
        <p><strong>주문상태</strong> : {order.orderStatus}</p>
      </div>

      <h3>주문 상품</h3>

      <ul className="order-product-list">
        {order.orderItems?.map((item) => (
          <li key={item.id}>
            <span>{item.productName}</span>
            <span>{item.quantity}개</span>
            <span>{item.price.toLocaleString()}원</span>
          </li>
        ))}
      </ul>

      <div className="payment-info">
        <p><strong>총 결제금액</strong> : {order.totalPrice?.toLocaleString()}원</p>
        <p><strong>결제수단</strong> : {order.paymentMethod}</p>
        <p><strong>결제상태</strong> : {order.paymentStatus}</p>
      </div>

      <div className="delivery-info">
        <h3>배송 정보</h3>

        <p><strong>받는 사람</strong> : {order.receiverName}</p>
        <p><strong>연락처</strong> : {order.receiverPhone}</p>
        <p><strong>주소</strong> : {order.address}</p>
        <p><strong>배송메모</strong> : {order.deliveryMemo}</p>
      </div>

    </div>
  );
};

export default OrderDetail;