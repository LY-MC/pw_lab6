import React from "react";
import { motion } from "framer-motion";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import "./productCard.css";

const ProductCard = ({ item, id }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const addToCart = () => {
    const itemAlreadyInCart = cartItems.some((item) => item.id === id);

    if (itemAlreadyInCart) {
      toast.error("Item is already in the cart");
    } else {
      dispatch(
        cartActions.addItem({
          id: item.id,
          imgUrl: item.imgUrl,
          productName: item.productName,
          price: item.price,
          size: item.size,
        })
      );

      toast.success("Product added succesfully");
    }
  };
  return (
    <Col lg="3" md="4" sm="6" xs="12">
      <div className="product item">
        <div className="product img">
          <Link to={`/home/${item.id}`}>
            <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
          </Link>
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/home/${item.id}`}>{item.productName}</Link>
          </h3>
          <span className="product__category">
            {item.category}. Size: {item.size}
          </span>
          <div className="product card-bottom d-flex align-items-center justify-content-between p-2">
            <span className="price">€{item.price}</span>
            <motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
              <i className="ri-add-line"></i>
            </motion.span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
