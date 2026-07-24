import { lazy } from "react";

const ReservationPage = lazy(
  () => import("../../page/shop/reservation/ReservationPage")
);

const ReservationDetailPage = lazy(
  () => import("../../page/shop/reservation/ReservationDetailPage")
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