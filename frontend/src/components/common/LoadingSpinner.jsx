const LoadingSpinner = ({ size = "large" }) => {
  const sizeClass = size === "large" ? "w-12 h-12" : "w-6 h-6";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div
        className={`${sizeClass} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;