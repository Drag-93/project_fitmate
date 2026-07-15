import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail } from "../../../apis/store/orderApi";
import OrderDetail from "../../../components/store/order/OrderDetail";

const OrderDetailPage = () => {

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetail(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return <OrderDetail order={order} />;
};

export default OrderDetailPage;