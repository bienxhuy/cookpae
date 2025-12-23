import { useNavigate } from "react-router-dom";

export const SimpleHeader = () => {
  const navigate = useNavigate();
  
  const goHome = () => {
    navigate("/");
  }

  return (
    <header>
      <div className="flex justify-between items-center p-4 sm:px-15 border-b border-gray-200">
        <p
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-dark-blue cursor-pointer h-[36px]"
          onClick={goHome}
        >
          Cookpae
        </p>
      </div>
    </header>
  );
}