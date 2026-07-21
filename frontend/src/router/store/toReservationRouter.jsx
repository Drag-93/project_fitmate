import { lazy } from "react";

const ReservationPage = lazy(
  () => import("../../page/store/reservation/ReservationPage")
);

const ReservationDetailPage = lazy(
  () => import("../../page/store/reservation/ReservationDetailPage")
);
const TrainerReservationPage = lazy(
  () => import("../../page/store/reservation/TrainerReservationPage")
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
    {
      path: "trainer",
      element: <TrainerReservationPage />
    }
  ];

};

export default toReservationRouter;