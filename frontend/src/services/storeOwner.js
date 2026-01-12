import axios from "axios";

class StoreOwnerService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  async getDashboard() {
    try {
      const res = await axios.get(
        `${this.baseUrl}/store-owner/dashboard/store-details`,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch store owner dashboard"
      );
    }
  }
}

export const storeOwnerService = new StoreOwnerService();
