import * as SecureStore from "expo-secure-store";
import ApiService from "../services/api";

export const logout = async () => {
  try {
    await ApiService.logout();
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("access_token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};
