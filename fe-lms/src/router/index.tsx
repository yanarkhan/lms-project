import { createBrowserRouter } from "react-router-dom";
import { ManagerHome } from "../pages/ManagerHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHome />,
  },
]);
