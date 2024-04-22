import React from "react";
import "./entry.css";

import WebName from "../components/WebName/WebName";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <WebName title="SignUp">
      <div className="entry-container">
        <div className="entry-frame">
          <h2>Sign Up</h2>
          <form className="entry__form">
            <div className="form-group">
              <label className="entry__label" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="entry__input"
              />
            </div>
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
              Sign Up
            </button>
          </form>
          <div className="entry__signup">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </WebName>
  );
};

export default SignUp;
