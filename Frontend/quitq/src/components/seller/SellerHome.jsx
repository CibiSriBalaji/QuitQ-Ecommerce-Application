import React, { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import { useAuth } from "../../context/useAuth";
import "../../css/Home.css";
import { useNavigate } from "react-router-dom";

const productService = new ProductService();

export default function SellerHome() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const { auth } = useAuth();
  const token = auth.token;

  const seller_id = auth.id;
  const productsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("use effect of get all products fired");
    productService
      .getAllProductsBySellerId(seller_id, token)
      .then((response) => {
        setProductList(response.data);
        console.log(response.data);
      });
  }, [seller_id, token]);

  const imgClickHandler = (product_name, product_id) => {
    navigate(`/seller/${product_name}/${product_id}`);
  };

  const totalPages = Math.ceil(productList.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = productList.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container-fluid homecontainer">
      <h2>My Products</h2>
      <div className="row">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div className="custom-col-5 col-md-3" key={product.product_id}>
              <div
                className="card"
                onClick={() =>
                  imgClickHandler(product.product_name, product.product_id)
                }
              >
                <img
                  className="card-img-top"
                  src={product.imgUrl}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {product.brand}
                  </h6>
                  <h5 className="card-title">{product.product_name}</h5>
                  <h5 className="card-title text-success">
                    <b>${product.price}/-</b>
                  </h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>
            <button
              className="btn btn-primary mb-3"
              onClick={() => navigate("/seller/newproduct")}
            >
              Create Your First Product
            </button>
          </p>
        )}
      </div>
      {/* Conditional Rendering for Pagination */}
      {productList.length > productsPerPage && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-4">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                key={index}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
