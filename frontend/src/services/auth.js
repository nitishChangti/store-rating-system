import axios from "axios";

class AuthService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  async login(email, password) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register({ name, email, address, password }) {
    console.log(name, email, address, password);
    try {
      const response = await axios.post(
        `${this.baseUrl}/register`,
        {
          name,
          email,
          address,
          password,
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

  async getCurrentUser() {
    try {
      const response = await axios.get(`${this.baseUrl}/getcurrentuser`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("GET CURRENT USER DATA API error:", error);
      throw new Error(
        error.response?.data?.message || "Get current User failed"
      );
    }
  }

  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/update-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error("UPDATE USER PASSWORD API error:", error);
      throw new Error(
        error.response?.data?.message || "Update User Password failed"
      );
    }
  }
  async getProfileData() {
    try {
      const response = await axios.get(`${this.baseUrl}/profile`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("GET USER PROFILE API error:", error);
      throw new Error(
        error.response?.data?.message || "get user profile data failed"
      );
    }
  }

  async UserLogOut() {
    try {
      const response = await axios.get(`${this.baseUrl}/logout`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("GET USER LOGOUT API error:", error);
      throw new Error(error.response?.data?.message || "User Logout failed");
    }
  }

   async getAllStores(){
      try {
          const response = await axios.get(`${this.baseUrl}/getallstores`,{
          withCredentials:true
      })
      return response;
      } catch (error) {
          console.error("GET ALL STORE DATA API error:", error);
        throw new Error(error.response?.data?.message || "Admin failed to get a all store data");
      }
    }

  async getStoreById(storeId) {
    try {
      console.log(storeId);
      const response = await axios.get(`${this.baseUrl}/stores/${storeId}`,{
        withCredentials:true
      })
          return response;
    } catch (error) {
      // Normalize error
      throw new Error(error.response?.data?.message || "failed to Fetch store Details");
    }
  }

  async submitRating(storeId, rating) {
  try {
    const response = await axios.post(
      `${this.baseUrl}/ratings`,
      { storeId, rating },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit rating"
    );
  }
}

}

export const authService = new AuthService();
