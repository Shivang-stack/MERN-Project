import React, { useEffect, useState } from "react";
import ImageHelper from "../helper/ImageHelper";
import { addItemToCart,removeItemFromCart,getCartItemCount } from "../helper/CartHelper";

const Card = ({ product }) => {
  const initialCount = parseInt(localStorage.getItem(`product_${product._id}`)) || 0;
  const [count, setCount] = useState(initialCount);

  const updateCountInLocalStorage = (newCount) => {
    localStorage.setItem(`product_${product._id}`, newCount.toString());
  };

  
  const addToCart = () => {
    const newCount = count + 1;
    setCount(newCount);
    updateCountInLocalStorage(newCount);
    addItemToCart(product, () => {});
    getCartItemCount();
  };

  const removeFromCart = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      updateCountInLocalStorage(newCount);
      removeItemFromCart(product, () => {});
      getCartItemCount();
    }
  };

  useEffect(() => {
    // Update the count when the component mounts
    setCount(initialCount);
  }, [initialCount]);

  return (
    <div className="card text-white bg-success border-success mb-3">
      <ImageHelper
        productId={product._id}
        className="rounded card-img-top card-img"
      />
      <div className="card-body card-size">
        <h5 className="card-title text-capitalize">{product.name}</h5>
        <p className="card-text  font-weight-light">
          {product.description}
        </p>
        <p>Rs {product.price}</p>
        {count > 0 ? (
          <div>
            <button className="btn btn-danger" onClick={removeFromCart}>
              -
            </button>
            <span className="count pl-2 pr-2">{count}</span>
            <button className="btn btn-danger" onClick={addToCart}>
              +
            </button>
          </div>
        ) : (
          <button className="btn btn-danger" onClick={addToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
