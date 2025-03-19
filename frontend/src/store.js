import { configureStore } from '@reduxjs/toolkit';
import jobApplicationReducer from './store/jobApplicationSlice';
import jobPostingReducer from "./store/jobPostingSlice"; // Import the jobPostingSlice
import authReducer from "./store/authSlice";

export default configureStore({
    reducer: {
        jobApplications: jobApplicationReducer,
        auth: authReducer,
        jobPostings: jobPostingReducer, // Add the jobPostingSlice
    },
});