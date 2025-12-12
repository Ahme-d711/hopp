import clientAxios from "@/lib/clientAxios";

// Types
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
  role: "admin" | "user";
  gender: "male" | "female" | "other";
  isActive: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LogoutResponse {
  status: string;
  message: string;
}

// Services
export const authServices = {
  // Admin login
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const response = await clientAxios.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<LogoutResponse> => {
    const response = await clientAxios.post<LogoutResponse>("/auth/logout");
    return response.data;
  },
};

