import React from 'react';

const ProductList = ({ cartItems }) => {
  return (
    <div className="productList">
      <h2>주문 상품</h2>

      {cartItems.map((item) => (
        <div className="productItem" key={item.id}>

          <img
            src={`http://localhost:8090/upload/product/${item.productImage}`}
            alt={item.productName}
          />

          <div className="productInfo">
            <h3>{item.productName}</h3>
            <p>수량 : {item.quantity}개</p>
          </div>

          <div className="productPrice">
            {(item.price * item.quantity).toLocaleString()}원
          </div>

        </div>
      ))}
    </div>
  );
};

export default ProductList;