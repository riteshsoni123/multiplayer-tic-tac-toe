import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("authToken") ? children : <Navigate to="/game" />;
};

export default PrivateRoute;
