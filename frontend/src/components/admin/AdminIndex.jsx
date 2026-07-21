import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/admin/Admin.css";
import jwtAxios from "../../apis/util/jwtUtil";

const AdminIndex = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalMemberCount: 0,
      totalProductCount: 0,
      todayCommunityCount: 0,
      todaySales: 0,
      monthlySales: 0,
    },

    member: {
      activeSubscriptionCount: 0,
      expiringSubscriptionCount: 0,
      expiredSubscriptionCount: 0,
      inactiveMemberCount: 0,
    },

    interestChart: [],
    communityChart: [],
    salesChart: [],

    communityList: [],
    productList: [],
  });

  /* ===================== 대시보드 조회 ===================== */
  const getDashboardData = async () => {
    try {
      const res = await jwtAxios.get("/admin/dashboard");

      setDashboardData({
        summary: res.data.summary || {
          totalMemberCount: 0,
          totalProductCount: 0,
          todayCommunityCount: 0,
          todaySales: 0,
          monthlySales: 0,
        },

        member: res.data.member || {
          activeSubscriptionCount: 0,
          expiringSubscriptionCount: 0,
          expiredSubscriptionCount: 0,
          inactiveMemberCount: 0,
        },

        interestChart: res.data.interestChart || [],
        communityChart: res.data.communityChart || [],
        salesChart: res.data.salesChart || [],

        communityList: res.data.communityList || [],
        productList: res.data.productList || [],
      });
      console.log(res.data);
    } catch (err) {
      console.error("대시보드 조회 실패", err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  /* ===================== 응답 데이터 분리 ===================== */
  const {
    summary,
    member,
    interestChart,
    communityChart,
    salesChart,
    communityList,
    productList,
  } = dashboardData;

  return (
    <div className="admin-main">
      <main className="adminIndex">
        <div className="adminIndex-wrap">
          {/* ===================== 페이지 상단 ===================== */}
          <div className="adminIndex-top">
            <div className="adminIndex-top-con">
              <div className="title">
                <h1>관리자 대시보드</h1>
                <p>FitMate 서비스의 주요 운영 현황</p>
              </div>
            </div>
          </div>

          {/* ===================== 주요 현황 ===================== */}
          <section className="adminIndex-dashboard-wrap">
            <div className="title">
              <h2>주요 현황</h2>
            </div>

            <div className="adminIndex-summary-list">
              {/* 전체 회원 */}
              <Link to="/admin/member" className="adminIndex-summary-card">
                <span>전체 회원</span>

                <strong>
                  {(summary.totalMemberCount ?? 0).toLocaleString()}명
                </strong>
              </Link>

              {/* 전체 상품 */}
              <Link to="/admin/product" className="adminIndex-summary-card">
                <span>전체 상품</span>

                <strong>
                  {(summary.totalProductCount ?? 0).toLocaleString()}개
                </strong>
              </Link>

              {/* 오늘 게시글 */}
              <Link to="/admin/community" className="adminIndex-summary-card">
                <span>오늘 게시글</span>

                <strong>
                  {(summary.todayCommunityCount ?? 0).toLocaleString()}건
                </strong>
              </Link>

              {/* 오늘 매출 */}
              <Link to="/admin/payment" className="adminIndex-summary-card">
                <span>오늘 매출</span>

                <strong>{(summary.todaySales ?? 0).toLocaleString()}원</strong>
              </Link>

              {/* 이번 달 매출 */}
              <Link to="/admin/payment" className="adminIndex-summary-card">
                <span>이번 달 매출</span>

                <strong>
                  {(summary.monthlySales ?? 0).toLocaleString()}원
                </strong>
              </Link>
            </div>
          </section>

          {/* ===================== 회원 CRM ===================== */}
          <section className="adminIndex-member-wrap">
            <div className="title">
              <h2>회원 CRM</h2>
            </div>

            <div className="adminIndex-member-con">
              {/* 회원 및 구독 현황 */}
              <div className="adminIndex-card adminIndex-member-left-con">
                <div className="adminIndex-card-header">
                  <h3>회원 및 구독 현황</h3>

                  <Link to="/admin/member" className="adminIndex-more-link">
                    전체보기
                  </Link>
                </div>

                <ul>
                  <li>
                    <span>구독 유지 회원</span>

                    <strong>
                      {(member.activeSubscriptionCount ?? 0).toLocaleString()}명
                    </strong>
                  </li>

                  <li>
                    <span>7일 내 구독 만료</span>

                    <strong>
                      {(member.expiringSubscriptionCount ?? 0).toLocaleString()}
                      명
                    </strong>
                  </li>

                  <li>
                    <span>구독 만료 회원</span>

                    <strong>
                      {(member.expiredSubscriptionCount ?? 0).toLocaleString()}
                      명
                    </strong>
                  </li>

                  <li>
                    <span>비활성 회원</span>

                    <strong>
                      {(member.inactiveMemberCount ?? 0).toLocaleString()}명
                    </strong>
                  </li>
                </ul>
              </div>

              {/* 관심사별 회원 분포 */}
              <div className="adminIndex-card adminIndex-member-right-con">
                <h3>관심사별 회원 분포</h3>

                <div className="adminIndex-chart">
                  {interestChart.length > 0 ? (
                    <ul className="adminIndex-chart-list">
                      {interestChart.map((chart, index) => (
                        <li key={`${chart.label}-${index}`}>
                          <span>{chart.label}</span>
                          <strong>
                            {(chart.value ?? 0).toLocaleString()}명
                          </strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="adminIndex-empty">
                      관심사 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ===================== 커뮤니티 ===================== */}
          <section className="adminIndex-community-wrap">
            <div className="title">
              <h2>커뮤니티</h2>
            </div>

            <div className="adminIndex-community-con">
              {/* 조회수 TOP 5 */}
              <div className="adminIndex-card adminIndex-community-left-con">
                <div className="adminIndex-card-header">
                  <h3>조회수 TOP 5</h3>

                  <Link to="/admin/community" className="adminIndex-more-link">
                    전체보기
                  </Link>
                </div>

                {communityList.length > 0 ? (
                  <ul>
                    {communityList.map((community, index) => (
                      <li key={community.id}>
                        <span className="rank">{index + 1}</span>

                        <Link
                          to={`/admin/community/${community.id}`}
                          className="item-title"
                        >
                          {community.title}
                        </Link>

                        <span className="item-count">
                          조회 {(community.hit ?? 0).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="adminIndex-empty">
                    등록된 게시글이 없습니다.
                  </div>
                )}
              </div>

              {/* 게시글 등록 추이 */}
              <div className="adminIndex-card adminIndex-community-right-con">
                <h3>최근 7일 게시글 등록 추이</h3>

                <div className="adminIndex-chart">
                  {communityChart.length > 0 ? (
                    <ul className="adminIndex-chart-list">
                      {communityChart.map((chart, index) => (
                        <li key={`${chart.label}-${index}`}>
                          <span>{chart.label}</span>
                          <strong>
                            {(chart.value ?? 0).toLocaleString()}건
                          </strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="adminIndex-empty">
                      게시글 추이 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ===================== 상품 및 매출 ===================== */}
          <section className="adminIndex-product-wrap">
            <div className="title">
              <h2>상품 및 매출</h2>
            </div>

            <div className="adminIndex-product-con">
              {/* 상품 판매량 TOP 5 */}
              <div className="adminIndex-card adminIndex-product-left-con">
                <div className="adminIndex-card-header">
                  <h3>상품 판매량 TOP 5</h3>

                  <Link to="/admin/product" className="adminIndex-more-link">
                    전체보기
                  </Link>
                </div>

                {productList.length > 0 ? (
                  <ul>
                    {productList.map((product, index) => (
                      <li key={product.id}>
                        <span className="rank">{index + 1}</span>

                        <Link
                          to={`/admin/product/${product.id}`}
                          className="item-title"
                        >
                          {product.productName}
                        </Link>

                        <span className="item-count">
                          {(product.salesCount ?? 0).toLocaleString()}개
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="adminIndex-empty">
                    판매된 상품이 없습니다.
                  </div>
                )}
              </div>

              {/* 매출 추이 */}
              <div className="adminIndex-card adminIndex-product-right-con">
                <h3>최근 7일 매출 추이</h3>

                <div className="adminIndex-chart">
                  {salesChart.length > 0 ? (
                    <ul className="adminIndex-chart-list">
                      {salesChart.map((chart, index) => (
                        <li key={`${chart.label}-${index}`}>
                          <span>{chart.label}</span>
                          <strong>
                            {(chart.value ?? 0).toLocaleString()}원
                          </strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="adminIndex-empty">
                      매출 추이 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="adminIndex-bottom">
            <div className="adminIndex-bottom-con"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminIndex;
