import React from "react";
import { Link } from "react-router-dom";
import "../css/admin/Admin.css";

const AdminIndex = () => {
  /*
    추후 대시보드 API를 연결하면 해당 데이터로 교체
    예시:
    const [dashboardData, setDashboardData] = useState({});
   
    const getDashboardData = async () => {
      const res = await jwtAxios.get("/admin/dashboard");
      setDashboardData(res.data);
    };
   */

  // 주요 현황 데이터
  const summaryData = {
    totalMemberCount: 0,
    todayMemberCount: 0,
    todayOrderCount: 0,
    todaySalesAmount: 0,
    todayCommunityCount: 0,
    unansweredInquiryCount: 0,
  };

  // 회원 CRM 데이터
  const memberCrmData = {
    totalMemberCount: 0,
    memberCount: 0,
    trainerCount: 0,
    weeklyNewMemberCount: 0,
    monthlyNewMemberCount: 0,
    activeSubscriptionMemberCount: 0,
    expiringSubscriptionMemberCount: 0,
  };

  // 커뮤니티 조회수 TOP 5
  const communityTop5 = [
    // {
    //   id: 1,
    //   title: "운동 루틴 질문드립니다.",
    //   viewCount: 254,
    // },
  ];

  // 상품 판매량 TOP 5
  const productTop5 = [
    // {
    //   id: 1,
    //   productName: "FitMate 구독 상품",
    //   salesQuantity: 120,
    // },
  ];

  // 관리자 알림
  const adminAlerts = [
    {
      id: 1,
      type: "inquiry",
      content: `미처리 문의가 ${summaryData.unansweredInquiryCount}건 있습니다.`,
      link: "/admin/community",
    },
    {
      id: 2,
      type: "subscription",
      content: `7일 내 구독이 만료되는 회원이 ${memberCrmData.expiringSubscriptionMemberCount}명 있습니다.`,
      link: "/admin/member",
    },
    {
      id: 3,
      type: "popup",
      content: "종료 예정인 팝업을 확인해 주세요.",
      link: "/admin/popup",
    },
    {
      id: 4,
      type: "product",
      content: "판매 및 상품 상태를 확인해 주세요.",
      link: "/admin/product",
    },
  ];

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
                  {summaryData.totalMemberCount.toLocaleString()}명
                </strong>
              </Link>

              {/* 오늘 신규 회원 */}
              <Link to="/admin/member" className="adminIndex-summary-card">
                <span>오늘 신규 회원</span>
                <strong>
                  {summaryData.todayMemberCount.toLocaleString()}명
                </strong>
              </Link>

              {/* 오늘 주문 */}
              <Link to="/admin/payment" className="adminIndex-summary-card">
                <span>오늘 주문</span>
                <strong>
                  {summaryData.todayOrderCount.toLocaleString()}건
                </strong>
              </Link>

              {/* 오늘 매출 */}
              <Link to="/admin/payment" className="adminIndex-summary-card">
                <span>오늘 매출</span>
                <strong>
                  {summaryData.todaySalesAmount.toLocaleString()}원
                </strong>
              </Link>

              {/* 오늘 게시글 */}
              <Link to="/admin/community" className="adminIndex-summary-card">
                <span>오늘 게시글</span>
                <strong>
                  {summaryData.todayCommunityCount.toLocaleString()}건
                </strong>
              </Link>

              {/* 미처리 문의 */}
              <Link to="/admin/community" className="adminIndex-summary-card">
                <span>미처리 문의</span>
                <strong>
                  {summaryData.unansweredInquiryCount.toLocaleString()}건
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
                    <span>전체 회원</span>
                    <strong>
                      {memberCrmData.totalMemberCount.toLocaleString()}명
                    </strong>
                  </li>

                  <li>
                    <span>일반 회원</span>
                    <strong>
                      {memberCrmData.memberCount.toLocaleString()}명
                    </strong>
                  </li>

                  <li>
                    <span>트레이너</span>
                    <strong>
                      {memberCrmData.trainerCount.toLocaleString()}명
                    </strong>
                  </li>

                  <li>
                    <span>이번 주 신규 가입</span>
                    <strong>
                      {memberCrmData.weeklyNewMemberCount.toLocaleString()}명
                    </strong>
                  </li>

                  <li>
                    <span>이번 달 신규 가입</span>
                    <strong>
                      {memberCrmData.monthlyNewMemberCount.toLocaleString()}명
                    </strong>
                  </li>

                  <li>
                    <span>구독 유지 회원</span>
                    <strong>
                      {memberCrmData.activeSubscriptionMemberCount.toLocaleString()}
                      명
                    </strong>
                  </li>

                  <li>
                    <span>7일 내 구독 만료</span>
                    <strong>
                      {memberCrmData.expiringSubscriptionMemberCount.toLocaleString()}
                      명
                    </strong>
                  </li>
                </ul>
              </div>

              {/* 관심사별 회원 분포 */}
              <div className="adminIndex-card adminIndex-member-right-con">
                <h3>관심사별 회원 분포</h3>

                <div className="adminIndex-chart">
                  {/* 추후 Chart.js 또는 Recharts 그래프 적용 */}
                  관심사별 회원 분포 그래프 영역
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

                {communityTop5.length > 0 ? (
                  <ul>
                    {communityTop5.map((community, index) => (
                      <li key={community.id}>
                        <span className="rank">{index + 1}</span>

                        <Link
                          to={`/admin/community/${community.id}`}
                          className="item-title"
                        >
                          {community.title}
                        </Link>

                        <span className="item-count">
                          조회 {community.viewCount.toLocaleString()}
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
                  {/* 추후 일별 게시글 등록 수 그래프 적용 */}
                  게시글 등록 추이 그래프 영역
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

                {productTop5.length > 0 ? (
                  <ul>
                    {productTop5.map((product, index) => (
                      <li key={product.id}>
                        <span className="rank">{index + 1}</span>

                        <Link
                          to={`/admin/product/${product.id}`}
                          className="item-title"
                        >
                          {product.productName}
                        </Link>

                        <span className="item-count">
                          {product.salesQuantity.toLocaleString()}개
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
                  {/* 추후 일별 매출 그래프 적용 */}
                  매출 추이 그래프 영역
                </div>
              </div>
            </div>
          </section>

          {/* ===================== 관리자 알림 ===================== */}
          <section className="adminIndex-alert-wrap">
            <div className="title">
              <h2>관리자 알림</h2>
            </div>

            <div className="adminIndex-card adminIndex-alert-con">
              <ul className="adminIndex-alert-list">
                {adminAlerts.map((alert) => (
                  <li key={alert.id} className={`alert-${alert.type}`}>
                    <Link to={alert.link}>
                      <span className="adminIndex-alert-point"></span>
                      <span className="adminIndex-alert-content">
                        {alert.content}
                      </span>
                      <span className="adminIndex-alert-arrow">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
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
