import { Outlet } from "react-router-dom";
import { ComplexHeader } from "./ComplexHeader";
import { Footer } from "./Footer";

export const HomePageLayout = () => {
  return (
    <div>
      <ComplexHeader />
      <Outlet />
      <Footer />
    </div>
  );
};
