import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { Button } from "./ui/button";

export const ComplexHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const goHome = () => {
    navigate("/");
  };

  return (
    <header>
      <div className="flex justify-between items-center p-4 sm:px-15 border-b border-gray-200">
        <p
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-dark-blue cursor-pointer h-[36px]"
          onClick={goHome}
        >
          Cookpae
        </p>

        {isAuthenticated ? (
          <div>Menu</div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAuthDialogOpen(true)}
            className="rounded-full cursor-pointer text-dark-blue hover:bg-dark-blue-light hover:text-white"
          >
            <User className="size-5" />
          </Button>
        )}
      </div>

      <AuthCard open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </header>
  );
};