import { api } from "./api";
import type { User } from "../types/utility";

type LoginPayload = {
  email: string;
  password: string;
  role?: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "citizen" | "technician" | "admin";
  skill?: "water" | "gas" | "electricity";
  area?: string;
};

type UpdateProfilePayload = {
  name: string;
  email: string;
  phone?: string;
};

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User; token: string }> {
    const { data } = await api.post("/auth/login", payload);
    if (data.token) {
      localStorage.setItem("smartUtilityToken", data.token);
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ user?: User; token?: string; requiresVerification?: boolean; message?: string; email?: string }> {
    const { data } = await api.post("/auth/register", payload);
    if (data.token) {
      localStorage.setItem("smartUtilityToken", data.token);
    }
    return data;
  },

  async verifyEmail(email: string, code: string, role?: string): Promise<{ message: string }> {
    const { data } = await api.post("/auth/verify-email", { email, code, role });
    return data;
  },

  async resendVerification(email: string, role?: string): Promise<{ message: string }> {
    const { data } = await api.post("/auth/resend-verification", { email, role });
    return data;
  },

  async me(): Promise<{ user: User }> {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<{ user: User }> {
    const { data } = await api.patch("/auth/profile", payload);
    return data;
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const { data } = await api.patch("/auth/password", payload);
    return data;
  },

  async updateLocation(latitude: number, longitude: number): Promise<{ user: User }> {
    const { data } = await api.patch("/auth/location", { latitude, longitude });
    return data;
  },

  logout() {
    localStorage.removeItem("smartUtilityToken");
  },
};
