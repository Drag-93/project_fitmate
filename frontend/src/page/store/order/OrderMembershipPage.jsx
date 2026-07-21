import { useLocation } from "react-router-dom";
import OrderMembership from "../../../components/store/order/OrderMembership";
import "../../../components/css/store/order/OrderMembership.css"


const OrderMembershipPage = () => {

  const location = useLocation();
  const product = location.state?.product;
  return (
    <OrderMembership product={product} />
  )
}

export default OrderMembershipPage;