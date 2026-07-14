import { useEffect, useState } from "react";
import { getOrderList } from "../../../apis/store/orderApi";


const OrderListPage = () => {


  const [orders, setOrders] = useState([]);


  useEffect(() => {
    loadOrders();
  }, []);


  const loadOrders = async () => {
    try {
      const data = await getOrderList();
      setOrders(data);
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div className="order-list">
      <div className="order-list-con">
        <h1>주문 내역</h1>
        {
          orders.length === 0
            ?
            <p>주문 내역이 없습니다.</p>
            : orders.map(order => (
              <div
                key={order.id}
                className="order-card">

                <h3>
                  주문번호 : {order.id}
                </h3>

                <p>
                  주문금액 : {order.totalPrice.toLocaleString()}원
                </p>

                <p>
                  주문상태 : {order.orderStatus}
                </p>

                <p>
                  배송상태 : {order.deliveryStatus}
                </p>

                <div>
                  {
                    order.orderItemDtos?.map(item => (
                      <div key={item.id}>
                        {item.productName} / {item.quantity}개
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default OrderListPage;