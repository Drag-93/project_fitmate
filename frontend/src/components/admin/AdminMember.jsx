import "../../css/admin/AdminMember.css";
import { useSelector } from "react-redux";
import AdminMemberView from "./member/AdminMemberView";
import TrainerMemberView from "./member/TrainerMemberView";

const AdminMember = () => {
  const { memberData } = useSelector((state) => state.loginSlice); //user 정보
  return (
    <>
      <div className="admin-member">
        <div className="admin-member-con">
          {memberData?.result?.role === "ADMIN" ? (
            <AdminMemberView />
          ) : (
            memberData?.result?.role === "TRAINER" && <TrainerMemberView />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMember;
