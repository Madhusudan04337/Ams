import axiosInstance from "./axiosInstance";

export const applyLeaveAPI = (data) =>
  axiosInstance.post("/leave/apply", data);

export const getMyLeavesAPI = (params) =>
  axiosInstance.get("/leave/my", { params });

export const getAllLeavesAPI = (params) =>
  axiosInstance.get("/leave/all", { params });

export const approveLeaveAPI = (id, data) =>
  axiosInstance.put(`/leave/${id}/approve`, data);

export const rejectLeaveAPI = (id, data) =>
  axiosInstance.put(`/leave/${id}/reject`, data);