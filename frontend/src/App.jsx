import { RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import root from "./router/root";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadMemberInit } from "./store/slices/loginSlice";

function App() {
  const dispatch = useDispatch();

  const { memberData } = useSelector((state) => state.loginSlice);

  useEffect(() => {
    if (!memberData) {
      dispatch(loadMemberInit());
    }
  }, [dispatch, memberData]);
  console.log(memberData);
  return (
    <>
      <RouterProvider router={root}>
        <Main />
      </RouterProvider>
    </>
  );
}
export default App;
