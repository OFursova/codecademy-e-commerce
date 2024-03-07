import React, { useState, useEffect } from 'react';
import Product from './Product';
import '../css/Product.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false); 

  useEffect(() => {
    if (!loaded) { 
      fetchProducts();
      setLoaded(true); 
    }
  }, [loaded]); 

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <Product
          key={product.id}
          name={product.name}
          description={product.description}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductList;
