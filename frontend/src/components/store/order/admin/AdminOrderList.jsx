import { useEffect, useState } from "react";
import axios from "../../../../apis/util/jwtUtil";
import "../../../../components/css/store/order/admin/adminOrderList.css";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8090/admin/orderList");

      setOrders(res.data);
    } catch (error) {
      console.log("주문 조회 실패", error);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8090/admin/orderList/${id}`, {
        orderStatus: status,
      });

      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-order-page">
      <h2 className="admin-order-title">주문 관리</h2>

      <table className="admin-order-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>회원</th>
            <th>상품명</th>
            <th>금액</th>
            <th>주문일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>{order.memberEmail}</td>

              <td>{order.productName}</td>

              <td>{order.amount?.toLocaleString()}원</td>

              <td>{order.createdDate}</td>

              <td>{order.orderStatus}</td>

              <td>
                <select
                  value={order.orderStatus}
                  onChange={(e) => changeStatus(order.id, e.target.value)}
                >
                  <option value="PAYMENT_COMPLETE">결제완료</option>

                  <option value="READY">준비중</option>

                  <option value="COMPLETE">완료</option>

                  <option value="CANCEL">취소</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList;
