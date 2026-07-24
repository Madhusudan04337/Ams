import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyAttendanceAPI } from "../../api/attendance.api";
import { formatDate, formatDateTime, getStatusColor, capitalize } from "../../utils/helpers";
import toast from "react-hot-toast";

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadAttendance();
  }, [filters.page, filters.status, filters.from, filters.to]);

  const loadAttendance = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await getMyAttendanceAPI(params);
      setAttendance(response.data.data.attendance);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error("Failed to load attendance history.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({ status: "", from: "", to: "", page: 1, limit: 10 });
  };

  return (
    <DashboardLayout>

      <h1 className="page-title">Attendance History</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="on_leave">On Leave</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
          <div>
            <label className="label">From Date</label>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">To Date</label>
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button onClick={clearFilters} className="btn-secondary w-full">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-slate-500">No attendance records found.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td className="font-medium">{formatDate(record.date)}</td>
                    <td>
                      <span className={`badge ${getStatusColor(record.status)}`}>
                        {capitalize(record.status.replace("_", " "))}
                      </span>
                    </td>
                    <td>{formatDateTime(record.checkIn)}</td>
                    <td>{formatDateTime(record.checkOut)}</td>
                    <td className="text-slate-400 text-sm">
                      {record.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} records)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </DashboardLayout>
  );
};

export default AttendanceHistory;