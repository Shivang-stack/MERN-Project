import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import { API } from "../backend";
import { addItemToCart,removeItemFromCart,getCartItemCount } from './helper/CartHelper';
import {  getProductById } from "../admin/helper/adminapicall";

const ProductView =({match}) =>{
  const [values, setValues] = useState({
    id:"",
    name: "",
    description:"",
    photo:"",
    price:"",
  });
  const [imageProduct, setImageProduct] = useState([]);
  
  const [error, setError] = useState(false);
  
  const {name,description,price,id} =values;
  
  const loadProduct = ProductId => {
    getProductById(ProductId).then(data => {
      setImageProduct(data);
      if (data.error) {
        setError(data.error);
      } else {
        setValues({
          ...values,
          id:data._id,
          name: data.name,
          description: data.description,
          price: data.price
        });
      }
    });
  };

  const initialCount = parseInt(localStorage.getItem(`product_${values.id}`)) || 0;
  const [count, setCount] = useState(initialCount);

  const updateCountInLocalStorage = (newCount) => {
    localStorage.setItem(`product_${values.id}`, newCount.toString());
  };

  
  const addToCart = () => {
    const newCount = count + 1;
    setCount(newCount);
    updateCountInLocalStorage(newCount);
    addItemToCart(values, () => {});
    getCartItemCount();
  };

  const removeFromCart = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      updateCountInLocalStorage(newCount);
      removeItemFromCart(values, () => {});
      getCartItemCount();
    }
  };

  
  useEffect(() => {
    loadProduct(match.params.productId);
  }, []);
  
  const imgUrl = values.id
  ? `${API}/product/photo/${values.id}`
  : "https://images.pexels.com/photos/3577561/pexels-photo-3577561.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

  return (
    
    <Base title="Grocer" description="Always Fresh">
      <div className=" text-center p-5">
        <div className="p-2 shadow">
          <h3>{name}</h3>
          <img className="border rounded p-1" src={imgUrl} alt={name} width={200} height={200}  />
          <h5 className="pt-3">{description}</h5>
          <h5>Rs {price}</h5>
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
    </Base>
  );
}

export default ProductView