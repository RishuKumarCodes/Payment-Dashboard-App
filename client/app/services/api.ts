import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://192.168.53.34:3000";

class ApiService {
  private async getAuthHeaders() {
    const token = await SecureStore.getItemAsync("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    await SecureStore.setItemAsync("access_token", data.access_token);
    return data;
  }

  async getPayments(filters: any = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/payments?${params}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }

    return response.json();
  }

  async getPaymentById(id: string) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payment");
    }

    return response.json();
  }

  async getPaymentStats() {
    const response = await fetch(`${API_BASE_URL}/payments/stats`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return response.json();
  }

  async createPayment(payment: any) {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment");
    }

    return response.json();
  }

  async logout() {
    await SecureStore.deleteItemAsync("access_token");
  }
}

export default new ApiService();
