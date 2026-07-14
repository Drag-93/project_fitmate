import { Link } from "react-router-dom";
import "../../css/store/order/OrderList.css"

const OrderList = ({ orders }) => {

  if (!orders || orders.length === 0) {
    return <p className="no-orders">주문 내역이 없습니다.</p>;
  }
  // 주문건 날짜별로 그룹화
  const groupedOrders = orders.reduce((groups, order) => {
    // createTime이 없거나 짧을 경우를 대비한 안전장치 포함
    const date = order.createTime ? order.createTime.substring(0, 10) : "날짜 미상";

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});

  // 그룹화된 객체의 키(날짜)를 배열로 만들어 정렬. (최신 날짜가 위로 오도록 내림차순)
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => b.localeCompare(a));

  return (
    <div className="order-list">
      {sortedDates.map((date) => (
        // 날짜별 그룹을 감싸는 컨테이너
        <div key={date} className="order-date-group">

          {/* 같은 날짜에 주문한 것들의 공통 헤더 */}
          <div className="order-group-header">
            주문일 {date}
          </div>

          {/* 해당 날짜에 속한 주문 카드들을 반복 출력 */}
          <div className="order-cards-container">
            {groupedOrders[date].map((order) => {
              const item = order.orderItemDtos?.[0];

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-content">

                    <img
                      src={item?.productImage}
                      alt={item?.productName}
                      className="order-thumbnail"
                    />

                    <div className="order-info">
                      <h4>{item?.productName}</h4>
                      <p>{order.totalPrice?.toLocaleString()}원</p>
                    </div>

                    <div className="order-status">
                      <span>배송: {order.deliveryStatus}</span>
                      <Link to={`/order/${order.id}`}>주문상세</Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
};

export default OrderList;