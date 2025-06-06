import { Outlet, useMatch } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export const LayoutDashboard = () => {
  const isPreviewPage = useMatch("/manager/courses/:id/preview");
  console.log("is Preview Page", isPreviewPage);

  return (
    <>
      {isPreviewPage !== null ? (
        <Outlet />
      ) : (
        <section className="flex min-h-screen">
          <Sidebar />
          <main className="flex flex-col flex-1 gap-[30px] p-[30px] ml-[290px]">
            <Header />
            <Outlet />
          </main>
        </section>
      )}
    </>
  );
};
