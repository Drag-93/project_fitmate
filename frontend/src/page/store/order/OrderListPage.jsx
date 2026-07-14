import { useEffect, useState } from "react";
import OrderList from "../../../components/store/order/OrderList";
import jwtAxios from "../../../apis/util/jwtUtil";

const OrderListPage = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await jwtAxios.get("http://localhost:8090/api/order/list");
        console.log(res.data);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>주문 내역</h2>
      <OrderList orders={orders} />
    </div>
  );
};

export default OrderListPage;