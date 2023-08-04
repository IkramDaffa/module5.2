import RouterList from "./router-list";
import { RouterProvider } from "react-router-dom";

function Routers() {
  return (
    <>
      <RouterProvider router={RouterList} />
    </>
  );
}

export default Routers;
