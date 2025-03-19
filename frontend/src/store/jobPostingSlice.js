import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/jobpostings";

// Async Thunk for Fetching Job Postings
export const fetchJobPostings = createAsyncThunk(
  "jobPostings/fetchJobPostings",
  async (_, { rejectWithValue }) => {
    try {
      // 🔥 Get token from local storage (or Redux state)
      const token = localStorage.getItem("token");
      
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      console.log(token)
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 Attach token to request
        },
      });
      console.log(response.data)
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch jobs.");
    }
  }
);

const jobPostingSlice = createSlice({
  name: "jobPostings",
  initialState: {
    jobPostings: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobPostings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobPostings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobPostings = action.payload;
      })
      .addCase(fetchJobPostings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default jobPostingSlice.reducer;