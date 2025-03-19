import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/jobapplications";

// ✅ Helper Function: Get Auth Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// ✅ Handle Unauthorized Access (Auto Logout)
const handleUnauthorized = (error) => {
  if (error.response && error.response.status === 401) {
    console.error("Unauthorized! Logging out...");
    localStorage.removeItem("token"); // 🔴 Clear token
    window.location.href = "/login"; // 🔄 Redirect to login page
  }
};

// ✅ Fetch Job Applications (With Token)
export const fetchJobApplications = createAsyncThunk(
  "jobApplications/fetchJobApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders(),
        withCredentials: true, // ✅ Ensure cookies & credentials are sent
      });
      return response.data;
    } catch (error) {
      handleUnauthorized(error);
      return rejectWithValue(error.response?.data || "Error fetching job applications");
    }
  }
);

// ✅ Add a Job Application (With Token)
export const addJobApplication = createAsyncThunk(
  "jobApplications/addJobApplication",
  async (application, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL, application, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleUnauthorized(error);
      return rejectWithValue(error.response?.data || "Error adding job application");
    }
  }
);

// ✅ Redux Slice
const jobApplicationSlice = createSlice({
  name: "jobApplications",
  initialState: {
    jobApplications: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobApplications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addJobApplication.fulfilled, (state, action) => {
        state.jobApplications.push(action.payload);
      });
  },
});

export default jobApplicationSlice.reducer;
