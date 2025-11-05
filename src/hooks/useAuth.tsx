import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  role: "admin" | "staff" | "student";
  loginTime: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, role?: string) => Promise<boolean>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("syllabox_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("syllabox_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const mockUsers = {
        "admin@syllabox.com": { password: "admin123", role: "admin" as const },
        "staff@syllabox.com": { password: "staff123", role: "staff" as const },
        "student@syllabox.com": { password: "student123", role: "student" as const },
      };

      const mock = mockUsers[email as keyof typeof mockUsers];

      let resolvedRole: User["role"] | undefined;
      if (mock && mock.password === password) {
        resolvedRole = mock.role;
      } else {
        const existingUsers = JSON.parse(localStorage.getItem("syllabox_users") || "[]");
        const found = existingUsers.find((u: any) => u.email === email && u.password === password);
        if (found) resolvedRole = (found.role || "student") as User["role"];
      }

      if (!resolvedRole) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      const userData: User = {
        email,
        role: resolvedRole,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("syllabox_user", JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${resolvedRole}!`,
      });

      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${resolvedRole}`);

      return true;
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("syllabox_user");
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const signup = async (email: string, password: string, role: string = "student"): Promise<boolean> => {
    try {
      setIsLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return false;
      }

      if (password.length < 8) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        return false;
      }

      const existingUsers = JSON.parse(localStorage.getItem("syllabox_users") || "[]");
      if (existingUsers.find((u: any) => u.email === email)) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        return false;
      }

      const newUser = {
        email,
        password, // In real app, hash this password
        role,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      localStorage.setItem("syllabox_users", JSON.stringify(existingUsers));

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });

      return true;
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An error occurred during signup",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
  };
};
