import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BaseUser } from "@/types/user.type";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions (React Strict Mode)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = () => {
      // Read auth data from cookie
      const cookieData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("google_auth_data="));

      if (cookieData) {
        try {
          const authData = JSON.parse(decodeURIComponent(cookieData.split("=")[1]));
          
          // Delete the cookie immediately
          document.cookie = "google_auth_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          
          // Login with the data
          loginWithGoogle(authData.accessToken, authData.user as BaseUser);
          navigate("/");
        } catch (error) {
          console.error("Error parsing auth data:", error);
          navigate("/");
        }
      } else {
        // No auth data, redirect to home
        navigate("/");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dark-blue"></div>
        <p className="mt-4 text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
