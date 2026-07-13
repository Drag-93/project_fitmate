import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const CartItem = ({
  item,
  checked,
  onSelect,
  changeQuantity,
  removeItem
}) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="cart-item">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onSelect(item.id, e.target.checked)
        }
      />
      <img className="productImage"
        src={`http://localhost:8090/upload/product/${item.productImage}`}
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
          onClick={() => setShowModal(true)}> 삭제 </button>
      </div>
      {
        showModal &&
        <ConfirmModal
          message="상품을 삭제하시겠습니까?"

          onConfirm={() => {
            removeItem(item.id);
            setShowModal(false);
          }}

          onCancel={() => {
            setShowModal(false);
          }}
        />
      }

    </div>
  );
};


export default CartItem;