import axios from "axios";

class AdminService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  async registerUsers({ name, email, address, password, role }) {
    console.log(name, email);
    try {
      const response = await axios.post(
        `${this.baseUrl}/admin/registerUser`,
        {
          name,
          email,
          address,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Register API error:", error);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async fetchStoreOwners() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/admin/fetch-store-owners`,
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "failed to fetch store owners"
      );
    }
  }

  async createStore({ name, email, address, owner_id }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/admin/createstore`,
        {
          name,
          email,
          address,
          owner_id,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "failed to create a store"
      );
    }
  }

   async adminLogOut() {
    try {
      const response = await axios.get(`${this.baseUrl}/admin/logout`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("ADMIN GOT LOGOUT FAILED API error:", error);
      throw new Error(error.response?.data?.message || "Admin Logout failed");
    }
  }
 
     async getAllStores(){
      try {
          const response = await axios.get(`${this.baseUrl}/admin/getallstores`,{
          withCredentials:true
      })
      return response;
      } catch (error) {
          console.error("GET ALL STORE DATA API error:", error);
        throw new Error(error.response?.data?.message || "Admin failed to get a all store data");
      }
    }

     async getDashboardStats() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/admin/dashboard-stats`,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.error("DASHBOARD STATS API error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
  async getAllUsers() {
  try {
    return await axios.get(
      `${this.baseUrl}/admin/users`,
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
}

}

export const adminService = new AdminService();
