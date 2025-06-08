import { Outlet, useMatch } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutDashboardProps {
  isAdmin?: boolean; 
}

export const LayoutDashboard = ({ isAdmin = true }: LayoutDashboardProps) => { // Menerima prop isAdmin dari router.
  const isPreviewPage = useMatch("/manager/courses/:id/preview");

  return (
    <>
      {isPreviewPage !== null ? (
        <Outlet />
      ) : (
        <section className="flex min-h-screen">
          <Sidebar isAdmin={isAdmin}/>
          <main className="flex flex-col flex-1 gap-[30px] p-[30px] ml-[290px]">
            <Header />
            <Outlet />
          </main>
        </section>
      )}
    </>
  );
};
