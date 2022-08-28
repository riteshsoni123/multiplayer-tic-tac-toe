import { useState, React, useEffect } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/game");
    }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        config
      );

      localStorage.setItem("authToken", data.token);

      navigate("/game");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div>
      <form onSubmit={loginHandler}>
        <h3>Login</h3>
        {error && <span>{error}</span>}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            tabIndex={1}
          />
        </div>

        <div>
          <label htmlFor="password">
            Password:
            <Link to="/forgotpassword" tabIndex={4}>
              Forgot Password
            </Link>
          </label>
          <input
            type="password"
            required
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={2}
          />
        </div>

        <button type="submit" tabIndex={3}>
          Login
        </button>
        <span>
          Don't have an account?<Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
