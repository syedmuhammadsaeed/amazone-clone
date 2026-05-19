const LoadingSpinner = ({ label = 'Loading' }) => (
  <div className="loading" role="status">
    <span className="spinner" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
