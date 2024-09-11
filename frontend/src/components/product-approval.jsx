import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingProducts = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await axios.get(
          "https://eteanepalbackend-production.up.railway.app/api/admin/products/pending",
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        setPendingProducts(response.data);
      } catch (err) {
        setError("Failed to fetch pending products.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProducts();
  }, []);

  const handleVerifyProduct = async (productId) => {
    try {
      const response = await axios.put(
        `https://eteanepalbackend-production.up.railway.app/api/admin/verify/product/${productId}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        }
      );
      setPendingProducts(
        pendingProducts.map((product) =>
          product._id === productId ? response.data : product
        )
      );
      alert("Product Verified Successfully ✅");
      window.location.reload();
    } catch (err) {
      setError("Failed to update product verification status.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Pending Products</h2>
      {pendingProducts.length === 0 ? (
        <p>No pending products found.</p>
      ) : (
        <ul>
          {pendingProducts.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: Rs{product.price}</p>
              <img
                src={`https://eteanepalbackend-production.up.railway.app/public/${product.image}`}
                alt="tea"
              />
              <button onClick={() => handleVerifyProduct(product._id)}>
                Verify
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingProducts;
