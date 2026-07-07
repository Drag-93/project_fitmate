import React from "react";

const CartItem = ({
  item,
  changeQuantity,
  removeItem
}) => {

  return (
    <div className="cart-item">
      <img className="productImage"
        src={item.productImage}
        alt={item.productName} />
      <div>
        <h3 className="productName">
          {item.productName}
        </h3>
        <p className="price">
          {item.price.toLocaleString()}원
        </p>
        <div>
          <button className="minus"
            onClick={() =>
              changeQuantity(
                item.id,
                item.quantity - 1)}> - </button>

          <span className="quantity">
            {item.quantity}
          </span>

          <button className="plus"
            onClick={() =>
              changeQuantity(
                item.id,
                item.quantity + 1)}> + </button>
        </div>
        <button className="delete"
          onClick={() =>
            removeItem(item.id)}> 삭제 </button>
      </div>
    </div>
  );
};


export default CartItem;