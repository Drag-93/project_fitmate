import { useSelector } from "react-redux";
import "../css/admin/AdminMember.css";
import AdminMemberViewDetail from "./member/detail/AdminMemberViewDetail";

const AdminMemberDetail = () => {
  const { memberData } = useSelector((state) => state.loginSlice); //user 정보
  return (
    <>
      <div className="admin-member">
        <div className="admin-memberDetail-con">
          {memberData?.result?.role === "ADMIN" ? (
            <AdminMemberViewDetail />
          ) : (
            memberData?.result?.role === "TRAINER" && <TrainerMemberView />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMemberDetail;
