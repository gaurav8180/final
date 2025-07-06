import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (protectedRoute) {
      // If route requires auth and no token => redirect to login
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      // If route does NOT require auth and token exists => redirect to /
      if (token) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
