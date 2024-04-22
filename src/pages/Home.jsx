import React, { useState } from "react";
import WebName from "../components/WebName/WebName";
import { Container, Row, Col } from "reactstrap";
import ProductList from "../components/UI/ProductList";
import products from "../assets/data/products";
import "./home.css";

const Home = () => {
  const [productsData, setProductsData] = useState(products);
  const [filterValue, setFilterValue] = useState("default");

  const handleFilter = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "default") {
      setProductsData(products);
      setFilterValue("default");
    } else {
      const [category, size] = filterValue.split("-");
      let filteredProducts = products.filter(
        (item) => item.category === category
      );
      if (size !== "all") {
        filteredProducts = filteredProducts.filter(
          (item) => item.size === size
        );
      }
      setProductsData(filteredProducts);
      setFilterValue(filterValue);
    }
  };

  const handlerSearch = (e) => {
    const searchTerm = e.target.value;

    const searchedProducts = products.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setProductsData(searchedProducts);
    setFilterValue("default");
  };

  return (
    <WebName title={"Home"}>
      <section className="search">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="filter">
                <label htmlFor="categories">Filter by category:</label>
                <select
                  name="categories"
                  onChange={handleFilter}
                  value={filterValue}
                >
                  <option value="default">Default</option>
                  <optgroup label="Sweater">
                    <option value="Sweater-all">All Sizes</option>
                    <option value="Sweater-S">Small</option>
                    <option value="Sweater-M">Medium</option>
                    <option value="Sweater-L">Large</option>
                    <option value="Sweater-XL">Extra Large</option>
                  </optgroup>
                  <optgroup label="Shirt">
                    <option value="Shirt-all">All Sizes</option>
                    <option value="Shirt-S">Small</option>
                    <option value="Shirt-M">Medium</option>
                    <option value="Shirt-L">Large</option>
                    <option value="Shirt-XL">Extra Large</option>
                  </optgroup>
                </select>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search for items"
                  onChange={handlerSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            {productsData.length === 0 ? (
              <h1>No products are found.</h1>
            ) : (
              <ProductList data={productsData} />
            )}
          </Row>
        </Container>
      </section>
    </WebName>
  );
};

export default Home;
