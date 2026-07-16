import { useEffect, useState } from "react";
import OrderList from "../../../components/store/order/OrderList";
import jwtAxios from "../../../apis/util/jwtUtil";
import "../../../components/css/store/order/OrderList.css";

const OrderListPage = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await jwtAxios.get("http://localhost:8090/api/order/list");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
      <OrderList orders={orders} />
  );
};

export default OrderListPage;