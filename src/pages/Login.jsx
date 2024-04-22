import React from "react";
import "./entry.css";

import WebName from "../components/WebName/WebName";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <WebName title="Login">
      <div className="entry-container">
        <div className="entry-frame">
          <h2>Login</h2>
          <form className="entry__form">
            <div className="form-group">
              <label className="entry__label" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="entry__input"
              />
            </div>
            <div className="form-group">
              <label className="entry__label" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="entry__input"
              />
            </div>
            <button type="submit" className="buy__btn">
              Log In
            </button>
            <div className="entry__forgot">
              <Link to="#">Forgot password?</Link>
            </div>
          </form>
          <div className="entry__signup">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </WebName>
  );
};

export default Login;
