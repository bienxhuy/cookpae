import { useNavigate } from "react-router-dom";

export const SimpleHeader = () => {
  const navigate = useNavigate();
  
  const goHome = () => {
    navigate("/");
  }

  return (
    <header>
      <p
        className="scroll-m-20 text-left sm:text-3xl sm:px-10 sm:py-5 text-2xl p-3 font-extrabold tracking-tight text-dark-blue-dark cursor-pointer"
        onClick={goHome}>
        Cookpae
      </p>
    </header>
  );
}