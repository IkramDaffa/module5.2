import Spotify from "../../module/spotify";
import { createBrowserRouter } from "react-router-dom";

const RouterList = createBrowserRouter([
  {
    path: "/",
    element: <Spotify />,
  },
]);
export default RouterList;
