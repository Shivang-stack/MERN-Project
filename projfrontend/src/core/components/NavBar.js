import React from "react";
import { Link,NavLink, withRouter } from "react-router-dom";
import { isAuthenticated, signout, isUser, isAdmin } from "../../auth/helper";
import { getCartItemCount } from "../helper/CartHelper";
import { useState, useEffect } from "react";
import { getAllProducts } from "../../admin/helper/adminapicall";

const Menu = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [searchResults, setSearchResults] = useState([]); // State for search results (product links)
  const [showSearchResults, setShowSearchResults] = useState(false); // State to show/hide search results dropdown

  // Function to handle search input changes
  const handleSearchInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    try {
      // Fetch all products
      const allProducts = await getAllProducts();

      // Filter products based on the search term
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );

      // Extract product links and names from the filtered products
      const productLinksAndNames = filteredProducts.map((product) => ({
        id: product._id,
        name: product.name,
      }));

      setSearchResults(productLinksAndNames);
      setShowSearchResults(true); // Show search results dropdown
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to render search results dropdown
  const renderSearchResults = () => {
    if (showSearchResults && searchResults.length > 0) {
      return (
        <div className="search-results dropdown">
          {searchResults.map((productData, index) => (
            <Link
              to={`/product/${productData.id}`}
              key={index}
              className="dropdown-item text-success rounded"
            >
              {productData.name}
            </Link>
          ))}
        </div>
      );
    } else {
      return null;
    }
  }

  return(
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow">
    <a className="navbar-brand" href="/">
      Grocer
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink
            exact
            className="nav-link"
            activeClassName="active-nav-link"
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            activeClassName="active-nav-link"
            to="/cart"
          >
            Cart <span className="text-light bg-danger rounded-circle pl-2 pr-2 pb-1">{getCartItemCount()}</span> 
          </NavLink>
        </li>
        <li>
            <div className="navbar-nav ml-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="rounded"
              />
            </div>
            {renderSearchResults()}
          </li>
        {isUser() && (
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active-nav-link"
              to="/user/dashboard"
            >
              Dashboard
            </NavLink>
          </li>
        )}

        {isAdmin() && (
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active-nav-link"
              to="/admin/dashboard"
            >
              Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </div>

    {isAuthenticated() ? (
      <button
        className="btn btn-success nav-btn"
        onClick={() => {
          signout(() => history.push("/"));
        }}
      >
        Sign Out
      </button>
    ) : (
      <div>
        <button
          className="btn btn-success nav-btn"
          onClick={() => history.push("/signup")}
        >
          Sign Up
        </button>
        <button
          className="btn btn-success nav-btn"
          onClick={() => history.push("/signin")}
        >
          Sign In
        </button>
      </div>
    )}
  </nav>
  )
};

export default withRouter(Menu);
