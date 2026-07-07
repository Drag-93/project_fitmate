import { useEffect, useState } from "react";

import CartItem from "../../../components/store/cart/CartItem";
import CartSummary from "../../../components/store/cart/CartSummary";
import "../../../components/css/store/cart/Cart.css";

import {
  getCartList,
  updateCartQuantity,
  deleteCartItem
} from "../../../apis/store/cartApi";


const CartPage = () => {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCartList();
      setCartItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // 수량 변경
  const changeQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    await updateCartQuantity(
      cartItemId,
      quantity
    );
    loadCart();
  };

  // 삭제
  const removeItem = async (cartItemId) => {
    await deleteCartItem(cartItemId);
    loadCart();
  };

  return (
    <div className="cart-page">
      <h2>장바구니</h2>
      <div className="cart-list">
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            changeQuantity={changeQuantity}
            removeItem={removeItem}
          />
        ))
        }
      </div>
      <CartSummary
        cartItems={cartItems}/>
    </div>
  );
};


export default CartPage;