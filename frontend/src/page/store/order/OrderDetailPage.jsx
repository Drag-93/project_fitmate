import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jwtAxios from "../../../apis/util/jwtUtil";
import OrderDetail from "../../../components/store/order/OrderDetail";

const OrderDetailPage = () => {

  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await jwtAxios.get(`http://localhost:8090/api/order/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  return <OrderDetail order={order} />;
};

export default OrderDetailPage;