import React from "react";
import "../css/admin/Admin.css";
const AdminIndex = () => {
  return (
    <>
      <div className="admin-main">
        <div className="adminIndex">
          <div className="adminIndex-wrap">
            <div className="adminIndex-top">
              <div className="adminIndex-top-con"></div>
            </div>
            <div className="adminIndex-left">
              <div className="adminIndex-left-con">Admin Contents</div>
            </div>

            <div className="adminIndex-right">
              <div className="adminIndex-right-con"></div>
            </div>
            <div className="adminIndex-bottom">
              <div className="adminIndex-bottom-con"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminIndex;
