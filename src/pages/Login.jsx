/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Base } from "../Components/Base";
import { ErrorToast } from "../Components/Errors/ErrorToast";
import { doLogin } from "../Auth";

const Login = () => {
  // Styles
  const centerDiv = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate(); // Use useNavigate to handle navigation
  // ERRORS
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState({});

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Save the user data to the state
      } else {
        // Handle error
        const errorMessage = await response.text();
        setError(errorMessage);
        setShowError(true);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("User data retrieval error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:8080/api/auth/authenticate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          userPassword: password,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const token = data.token; // Extract the token from the response
      setToken(token);
      localStorage.setItem("token", token);
      getUser();
    } else {
      // Handle error
      const errorMessage = await response.text();
      setError(errorMessage);
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  //RESET Fields
  const resetFields = () => {
    setUsername("");
    setPassword("");
  };

  // --------------------------------RETURN STATEMENT------------------------------------------
  return (
    <>
      <Base>
        <br />
        <div>
          <h1 className="text-center">Login</h1>
          <form
            className="container text-start bg-white "
            style={{ width: "50vw" }}
            onSubmit={handleLogin}
          >
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                required
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={centerDiv}>
              <div>
                <button type="submit" className="btn text-center" id="myButton">
                  Submit
                </button>
                &nbsp;
                <button
                  onClick={resetFields}
                  className="btn text-center myButton"
                >
                  Reset
                </button>
              </div>
              <br />
              <p>OR</p>
              <p>
                Create an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <ErrorToast
              show={showError}
              onClose={handleCloseError}
              message={error}
            ></ErrorToast>
          </form>
        </div>
      </Base>
    </>
  );
};

export default Login;
