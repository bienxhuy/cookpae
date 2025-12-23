import { Outlet } from "react-router-dom";
import { SimpleHeader } from "./SimpleHeader";
import { Footer } from "./Footer";

export const CommonLayout = () => {
  return (
    <div>
      <SimpleHeader />
      <Outlet />
      <Footer />
    </div>
  );
};
