import axiosInstance from "./axiosInstance";

export const getMySummaryAPI = (params) =>
  axiosInstance.get("/analytics/summary", { params });

export const getDepartmentSummaryAPI = (params) =>
  axiosInstance.get("/analytics/department", { params });