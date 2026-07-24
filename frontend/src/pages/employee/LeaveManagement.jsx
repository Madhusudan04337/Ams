import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { applyLeaveAPI, getMyLeavesAPI } from "../../api/leave.api";
import { formatDate, getStatusColor, capitalize } from "../../utils/helpers";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const LeaveManagement = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "casual",
    from: "",
    to: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    setIsLoading(true);
    try {
      const response = await getMyLeavesAPI({ limit: 20 });
      setLeaves(response.data.data.leaves);
    } catch (error) {
      toast.error("Failed to load leave requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = "From date is required.";
    if (!formData.to) newErrors.to = "To date is required.";
    if (formData.from && formData.to && formData.from > formData.to)
      newErrors.to = "To date must be after from date.";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await applyLeaveAPI(formData);
      toast.success("Leave application submitted successfully!");
      setFormData({ type: "casual", from: "", to: "", reason: "" });
      setShowForm(false);
      loadLeaves();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to apply for leave.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title mb-0">Leave Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ Apply for Leave"}
        </button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { type: "Casual", value: user?.leaveBalance?.casual, color: "bg-blue-500" },
          { type: "Sick", value: user?.leaveBalance?.sick, color: "bg-red-500" },
          { type: "Earned", value: user?.leaveBalance?.earned, color: "bg-green-500" },
        ].map((leave) => (
          <div key={leave.type} className="card text-center">
            <div className={`text-2xl font-bold text-white ${leave.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
              {leave.value}
            </div>
            <p className="font-medium text-slate-700">{leave.type} Leave</p>
            <p className="text-sm text-slate-400">days remaining</p>
          </div>
        ))}
      </div>

      {/* Apply Form */}
      {showForm && (
        <div className="card mb-6 border-2 border-blue-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Apply for Leave
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Leave Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                </select>
              </div>
              <div />
              <div>
                <label className="label">From Date</label>
                <input
                  type="date"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`input ${errors.from ? "border-red-400" : ""}`}
                />
                {errors.from && <p className="error-text">{errors.from}</p>}
              </div>
              <div>
                <label className="label">To Date</label>
                <input
                  type="date"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  min={formData.from || new Date().toISOString().split("T")[0]}
                  className={`input ${errors.to ? "border-red-400" : ""}`}
                />
                {errors.to && <p className="error-text">{errors.to}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a reason for your leave..."
                rows={3}
                className={`input resize-none ${errors.reason ? "border-red-400" : ""}`}
              />
              {errors.reason && <p className="error-text">{errors.reason}</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave History */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Leave History
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🏖️</p>
            <p className="text-slate-500">No leave requests yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td className="capitalize font-medium">{leave.type}</td>
                  <td>{formatDate(leave.from)}</td>
                  <td>{formatDate(leave.to)}</td>
                  <td>{leave.totalDays}</td>
                  <td className="text-sm text-slate-500 max-w-xs truncate">
                    {leave.reason}
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(leave.status)}`}>
                      {capitalize(leave.status)}
                    </span>
                  </td>
                  <td className="text-sm text-slate-400">
                    {leave.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </DashboardLayout>
  );
};

export default LeaveManagement;