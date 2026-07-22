import { useSelector } from "react-redux";
import AdminMemberViewDetail from "./member/detail/AdminMemberViewDetail";
import TrainerMemberViewDetail from "./member/detail/TrainerMemberViewDetail";

const AdminMemberDetail = () => {
  const { memberData } = useSelector((state) => state.loginSlice); //user 정보
  return (
    <>
      <div className="admin-member">
        {memberData?.result?.role === "ADMIN" ? (
          <AdminMemberViewDetail />
        ) : (
          memberData?.result?.role === "TRAINER" && <TrainerMemberViewDetail />
        )}
      </div>
    </>
  );
};

export default AdminMemberDetail;
