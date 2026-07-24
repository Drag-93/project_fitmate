import { lazy } from "react";

const ReservationPage = lazy(
  () => import("../../page/store/reservation/ReservationPage")
);

const ReservationDetailPage = lazy(
  () => import("../../page/store/reservation/ReservationDetailPage")
);

const toReservationRouter = () => {

  return [
    {
      path: "",
      element: <ReservationPage />
    },
    {
      path: ":id",
      element: <ReservationDetailPage />
    },

  ];

};

export default toReservationRouter;