import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommunityDetail = () => {
  const { id } = useParams();
  const navigatge = useNavigate();

  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCommunityDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8090/community/detail/${id}`,
      );
      console.log("상세 데이터 응답 : ", res, data);
      if (res.data?.result) {
        setCommunity(res.data.result);
      }
    } catch (error) {
      console.error("상세정보 로드 실패 : ", error);
      alert("존재하지 않는 게시글입니다");
      navigatge("/community/communityList");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCommunityDetail();
  }, [id]);

  return <div>CommunityDetail</div>;
};

export default CommunityDetail;
