import React, { useState } from 'react';
import AddressModal from "../../../components/common/map/AddressModal";

const BuyerInfo = ({ member, orderInfo, setOrderInfo }) => {

  const [addressOpen, setAddressOpen] = useState(false);
  const handleChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="buyerInfo">

      <h2>
        배송 정보
      </h2>


      <div className="inputBox">
        <label>받는 분</label>
        <input
          name="receiverName"
          value={orderInfo.receiverName || ""}
          onChange={handleChange}
        />
      </div>


      <div className="inputBox">
        <label>연락처</label>
        <input
          name="receiverPhone"
          value={orderInfo.receiverPhone || ""}
          onChange={handleChange}
        />
      </div>


      <div className="inputBox">
        <label>주소</label>
        <button
          type="button"
          onClick={() => setAddressOpen(true)}
        >
          주소 찾기
        </button>
        <input
          name="receiverAddress"
          value={orderInfo.receiverAddress || ""}
          readOnly
        />

      </div>


      <div className="inputBox">
        <label>배송 요청사항</label>
        <input
          name="deliveryMemo"
          value={orderInfo.deliveryMemo || ""}
          onChange={handleChange}
        />
      </div>
      <AddressModal
        open={addressOpen}
        onClose={() => setAddressOpen(false)}
        onSelect={({ zonecode, address }) => {
          setOrderInfo({
            ...orderInfo,
            receiverAddress: `${address} (${zonecode})`
          });
        }}
      />
    </div>

  );
};


export default BuyerInfo;