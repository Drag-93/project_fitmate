import React, { useEffect, useState } from "react";
import "../css/admin/AdminMember.css";
import { API_SERVER_URL } from "../../apis/commonApi";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminMemberDetail = () => {
  const { id } = useParams();

  const [memberData, setMemberData] = useState(null);
  const getMemberList = async () => {
    const url = `${API_SERVER_URL}/api/member/detail/${id}`;
    try {
      const res = await axios.get(url);
      setMemberData(res.data.result);
      // console.log(res.data);
    } catch (err) {
      alert("에러발생 : " + err);
    }
  };
  useEffect(() => {
    getMemberList();
  }, []);
  return (
    <>
      <div className="admin-member">
        <div className="admin-member-con">
          {memberData !== null ? (
            <>
              <div className="search"></div>
              <div className="memberList">
                <ul className="memberList-head">
                  <li>이름</li>
                  <li>관심사</li>
                  <li>상세보기</li>
                </ul>
                <ul className="memberList-body" key={memberData.id}>
                  <li>{memberData.userName}</li>
                  <li>{memberData.interest}</li>
                  <li>{memberData.userName}</li>
                </ul>
              </div>
            </>
          ) : (
            <>회원정보를 불러오는 중입니다.</>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMemberDetail;
