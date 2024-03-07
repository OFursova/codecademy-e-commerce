import React from 'react';

const Product = ({ name, description, image }) => {
  return (
    <div className="product">
      <img src={image} alt={name} />
      <div className="product-info">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Product;
