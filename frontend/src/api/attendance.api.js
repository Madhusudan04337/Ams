import axiosInstance from "./axiosInstance";

export const markAttendanceAPI = (data) =>
  axiosInstance.post("/attendance/mark", data);

export const getMyAttendanceAPI = (params) =>
  axiosInstance.get("/attendance/my", { params });

export const getAllAttendanceAPI = (params) =>
  axiosInstance.get("/attendance/all", { params });

export const rectifyAttendanceAPI = (id, data) =>
  axiosInstance.put(`/attendance/rectify/${id}`, data);

export const exportAttendanceAPI = (params) =>
  axiosInstance.get("/attendance/export", {
    params,
    responseType: "blob", // important for file download
  });

export const checkOutAPI = () =>
  axiosInstance.put("/attendance/checkout");