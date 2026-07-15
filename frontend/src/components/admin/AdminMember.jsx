import React, { useEffect, useState } from "react";
import "../css/admin/AdminMember.css";
import { API_SERVER_URL } from "../../apis/commonApi";
import axios from "axios";

const AdminMember = () => {
  const [memberList, setMemberList] = useState(null);
  const getMemberList = async () => {
    const url = `${API_SERVER_URL}/api/member/memberList`;
    try {
      const res = await axios.get(url);
      setMemberList(res.result);
    } catch (err) {
      alert("에러발생 : " + err);
    }
  };
  useEffect(() => {
    getMemberList();
  }, []);
  return (
    <>
      <div className="admin-main">
        <div className="admin-main-con">
          {memberList !== null ? (
            <>회원정보 get</>
          ) : (
            <>회원정보를 불러오는 중입니다.</>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMember;
