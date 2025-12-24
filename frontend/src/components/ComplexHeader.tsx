import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";
import { NotificationBell } from "./NotificationBell";
import { User, Menu, ClipboardPlus, Bell, Archive, Heart, Bolt, LogOut } from "lucide-react";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { getUserRecipesCount } from "@/services/recipe.service";

export const ComplexHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [userRecipesCount, setUserRecipesCount] = useState<number | null>(null);

  // Fetch user recipes count on mount
  useEffect(() => {
    // Fetch user recipes count
    const fetchUserRecipesCount = async () => {
      if (user) {
        try {
          const response = await getUserRecipesCount(Number(user.id));
          if (response && response.status === "success") {
            setUserRecipesCount(response.data.count);
          }
        } catch (error) {
          console.error("Failed to fetch user recipes count:", error);
        }
      }
    };

    // Call the function to fetch count
    fetchUserRecipesCount();
  }, [user]);

  // Navigate to home
  const goHome = () => {
    navigate("/");
  };

  // Helper function to extract first and last initials from user name
  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials[0] + (initials[initials.length - 1] || "ER");
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

        {!isAuthenticated ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAuthDialogOpen(true)}
            className="rounded-full cursor-pointer text-dark-blue hover:bg-dark-blue-light hover:text-white"
          >
            <User className="size-5" />
          </Button>
        ) : (
          // User menu when authenticated
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Sheet>
              <SheetTrigger>
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="gap-0 pb-0">
                  {/* User basic info */}
                  <SheetTitle>
                    <div className="flex flex-col">
                      <Avatar className="w-10 h-10 mb-2 border-1 border-dark-blue-dark">
                        <AvatarFallback>{getInitials(user?.name || "ER")}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-md text-dark-blue pl-1">{user?.name}</p>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground pl-1">
                    {userRecipesCount !== null ?
                      `${userRecipesCount} recipe${userRecipesCount !== 1 ? 's' : ''}`
                      : 'Loading...'}
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-5 p-5 pt-0 font-medium text-dark-blue-dark">
                  <p
                    className="flex flex-row items-center cursor-pointer hover:text-dark-blue-light transition"
                    onClick={() => navigate('/recipes/create')}>
                    <ClipboardPlus className="size-5 mr-3" />
                    Create Recipe
                  </p>
                  <p
                    className="flex flex-row items-center cursor-pointer hover:text-dark-blue-light transition"
                    onClick={() => navigate('/your-recipes')}>
                    <Archive className="size-5 mr-3" />
                    Your Recipes
                  </p>
                  <p
                    className="flex flex-row items-center cursor-pointer hover:text-dark-blue-light transition"
                    onClick={() => navigate('/favorite-recipes')}>
                    <Heart className="size-5 mr-3" />
                    Favorite Recipes
                  </p>
                  <p
                    className="flex flex-row items-center cursor-pointer hover:text-dark-blue-light transition"
                    onClick={() => navigate('/settings')}>
                    <Bolt className="size-5 mr-3" />
                    Setting
                  </p>
                  <p
                    className="flex flex-row items-center cursor-pointer hover:text-dark-blue-light transition"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}>
                    <LogOut className="size-5 mr-3" />
                    Logout
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      <AuthCard open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </header>
  );
};