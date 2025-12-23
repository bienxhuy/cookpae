import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginSchema, RegisterSchema } from "@/schemas/user.schema";

interface AuthCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthCard = ({ open, onOpenChange }: AuthCardProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();

  // Login form
  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle form submissions
  const handleLoginSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(values.email, values.password);
      onOpenChange(false);
      loginForm.reset();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register submission
  const handleRegisterSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError(null);
    setIsLoading(true);

    try {
      await register(values.name, values.email, values.password);
      onOpenChange(false);
      registerForm.reset();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-dark-blue">{isLogin ? "Welcome Back" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Fill in your details to create a new account"}
          </DialogDescription>
        </DialogHeader>

        {isLogin ? (
          <Form {...loginForm} key="login-form">
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4 mt-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-dark-blue hover:bg-dark-blue-light cursor-pointer" disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign In"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm} key="register-form">
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4 mt-4">
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Faker"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-dark-blue hover:bg-dark-blue-light cursor-pointer" disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="text-dark-blue hover:underline font-medium cursor-pointer"
            disabled={isLoading}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
