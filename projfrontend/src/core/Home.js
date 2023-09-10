import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./components/Card";
import { getAllProducts, getAllCategories } from "../admin/helper/adminapicall"; // You may need to create this function to fetch all categories.

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(false);

  const preloadData = () => {
    getAllProducts().then((data) => {
      if (data.err) {
        console.log(data.err);
      } else {
        setProducts(data);
      }
    });

    getAllCategories().then((data) => {
      if (data.err) {
        console.log(data.err);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    preloadData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const renderProductCards = () => {
    const categoriesMap = {};

    if (selectedCategory) {
      const filteredProducts = products.filter(
        (product) => product.category._id === selectedCategory._id
      );

      return (
        <div>
          <h4 className="text-success text-sm-center">
            {selectedCategory.name}
          </h4>
          <div className="row">
            {filteredProducts.map((product, index) => (
              <div key={index} className="col-sm-12 col-md-4 col-lg-3">
                <Card product={product} />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      products.forEach((product) => {
        const categoryName = product.category.name;
        if (!categoriesMap[categoryName]) {
          categoriesMap[categoryName] = [];
        }
        categoriesMap[categoryName].push(product);
      });

      return Object.keys(categoriesMap).map((categoryName, index) => (
        <div key={index}>
          <div className="pb-1 pt-1">
            <h4 className="text-white bg-success text-sm-center rounded  p-2">{categoryName}</h4>
          </div>
          <div className="row">
            {categoriesMap[categoryName].slice(0, 4).map((product, index) => (
              <div key={index} className="col-sm-12 col-md-4 col-lg-3">
                <Card product={product} />
              </div>
            ))}
          </div>
        </div>
      ));
    }
  };

  return (
    <Base
      title="Home"
      description="Welcome, Happy Shopping!"
      className="container"
    >
      <div>
        <button className="btn btn-primary pb-2" data-toggle="dropdown">
          Shop by Category &#8659;
        </button>
        <ul className="dropdown-menu">
          {categories.map((category) => (
            <li key={category._id}>
              <button
                className="dropdown-item"
                onClick={() => handleCategoryChange(category)}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {renderProductCards()}
    </Base>
  );
};

export default Home;
