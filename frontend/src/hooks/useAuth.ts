import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  authServices,
  type LoginInput,
  type User,
} from "@/services/authServices";

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  const axiosError = error as { response?: { data?: { message?: string } } };
  return axiosError?.response?.data?.message || defaultMessage;
};

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// Hook: Admin login
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authServices.login(data),
    onSuccess: (response) => {
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // Store user data in query cache
      queryClient.setQueryData<User>(authKeys.user(), response.data.user);
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to login. Please try again."));
    },
  });
};

// Hook: Logout
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authServices.logout(),
    onSuccess: () => {
      // Clear token from localStorage
      localStorage.removeItem("token");
      // Clear user data from query cache
      queryClient.removeQueries({ queryKey: authKeys.user() });
      toast.success("Logged out successfully");
      navigate("/");
    },
    onError: (error: unknown) => {
      // Even if logout fails on server, clear local state
      localStorage.removeItem("token");
      queryClient.removeQueries({ queryKey: authKeys.user() });
      toast.error(getErrorMessage(error, "Failed to logout"));
      navigate("/");
    },
  });
};

// Hook: Get current user from cache
export const useAuth = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(authKeys.user());
  const token = localStorage.getItem("token");

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === "admin",
  };
};

