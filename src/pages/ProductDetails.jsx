import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import products from "../assets/data/products";
import WebName from "../components/WebName/WebName";
import ProductList from "../components/UI/ProductList";
import "./productDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const product = products.find((item) => item.id === id);

  const { imgUrl, productName, size, category, price, shortDesc, description } =
    product;

  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const relatedProducts = products.filter(
    (prod) => prod.category === product.category && prod.id !== product.id
  );

  const addToCart = () => {
    const itemAlreadyInCart = cartItems.some((item) => item.id === id);

    if (itemAlreadyInCart) {
      toast.error("Item is already in the cart");
    } else {
      dispatch(
        cartActions.addItem({
          id,
          imgUrl,
          productName,
          price,
          size,
        })
      );
      toast.success("Product added succesfully");
    }
  };

  return (
    <WebName title={productName}>
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <img className="product__image" src={imgUrl} alt={productName} />
            </Col>
            <Col lg="6">
              <div className="details">
                <h2 className="product__name">{productName}</h2>
              </div>
              <span className="product__price">€{price}</span>
              <div className="product__size">Size: {size}</div>
              <div className="product__category">Category: {category}</div>
              <p className="product__description">
                Descriprion:
                <br />
                {showDescription ? description : shortDesc}
              </p>

              <button className="show-more__btn" onClick={toggleDescription}>
                {showDescription ? "Show Less" : "Show More"}
              </button>

              <button className="buy__btn" onClick={addToCart}>
                Add to Cart
              </button>
            </Col>

            <Col lg="12">
              <h2 className="related__title">You might also like:</h2>
            </Col>
            <ProductList data={relatedProducts}></ProductList>
          </Row>
        </Container>
      </section>
    </WebName>
  );
};

export default ProductDetails;
