import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
      navigate("/dashboard");
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

// Hook: Get current user (fetches from API if not in cache)
export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // Fetch user from API if token exists but user not in cache
  const { data: userData, isLoading, error, isFetching } = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await authServices.getMe();
      return response.data.user;
    },
    enabled: !!token, // Only fetch if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle error: clear token and cache if API call fails
  useEffect(() => {
    if (error) {
      // If API call fails (e.g., invalid token), clear token and cache
      localStorage.removeItem("token");
      queryClient.removeQueries({ queryKey: authKeys.user() });
    }
  }, [error, queryClient]);

  // Get user from cache or API response
  const user = userData || queryClient.getQueryData<User>(authKeys.user());

  // Calculate loading state: 
  // - If no token, not loading (we know immediately)
  // - If token exists, check if query is loading or fetching
  const isLoadingState = token ? (isLoading || isFetching) : false;

  // User is authenticated if: no error, user exists, and token exists
  const isAuthenticated = !error && !!user && !!token;

  return {
    user,
    token,
    isLoading: isLoadingState,
    isAuthenticated,
    isAdmin: user?.role === "admin",
  };
};

