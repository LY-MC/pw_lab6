import React, { useState } from "react";
import "./header.css";
import { motion } from "framer-motion";
import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.PNG";
import cart from "../../assets/images/cart.svg";
import profile from "../../assets/images/profile.svg";

const Header = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigateToCart = () => {
    navigate("/cart");
  };

  const handleProfileClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <Container>
        <Row>
          <div className="wapper">
            <Link to="/home" className="logo">
              <img src={logo} alt="logo" />
              <div className="name">
                <h1>Vintage Room</h1>
                <p>Selected vintage made in France</p>
              </div>
            </Link>
            <div className="icons">
              <span className="cart" onClick={navigateToCart}>
                <motion.img whileTap={{ scale: 1.2 }} src={cart} alt="cart" />
                <span className="counter">{totalQuantity}</span>
              </span>
              <span className="profile" onClick={handleProfileClick}>
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={profile}
                  alt="profile"
                />
                {isMenuOpen && (
                  <div className="menu">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">SignUp</Link>
                  </div>
                )}
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
