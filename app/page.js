"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    
    // Immediately change the quantity of the product with given slug in Products

    let index = products.findIndex((item)=> item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus"){
      newProducts[index].quantity = parseInt(initialQuantity) + 1
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }

    setProducts(newProducts);

    // Immediately change the quantity of the product with given slug in DropDown

    let indexdrop = dropdown.findIndex((item)=> item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))

    if (action == "plus"){
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }

    setDropdown(newDropdown);

    setLoadingaction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({action, slug, initialQuantity}),
    });
    let r = await response.json()
    console.log(r)
    setLoadingaction(false);
  };

  const addProduct = async (e) => {    
    
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Product added successfully
        console.log("Product added successfully");
        setAlert("Your Product has been added!");
        setProductForm({});
      } else {
        // Handle error case
        console.log("Error adding product");
      }
    } catch (error) {
      console.error("Error", error);
    }
    // Fetch all the products again to sync back
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value);
    if (query.length>3) {
      setDropdown([]);
      setLoading(true);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    }
    else {
      setDropdown([])
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto my-8">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-bold mb-6">Search a product</h1>
        <div className="flex my-2">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter product name..."
            className="flex-1 border border-gray-300 px-4 py-2 rounded-r-md"
          />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="all">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="40px"
              height="40px"
              viewBox="0 0 128 128"
              fill="#000000"
            >
              <g>
                <circle cx="16" cy="64" r="14" fill="#000000">
                  <animate
                    attributeName="r"
                    from="14"
                    to="14"
                    begin="0s"
                    dur="0.8s"
                    values="14;10;4;14"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="64" cy="64" r="14" fill="#000000">
                  <animate
                    attributeName="r"
                    from="14"
                    to="14"
                    begin="0.2s"
                    dur="0.8s"
                    values="14;10;4;14"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="112" cy="64" r="14" fill="#000000">
                  <animate
                    attributeName="r"
                    from="14"
                    to="14"
                    begin="0.4s"
                    dur="0.8s"
                    values="14;10;4;14"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </svg>
          </div>
        )}

        <div className="dropcontainer absolute border-1 container bg-purple-100 rounded-md">
          {dropdown.map((item) => {
            return ( <div
                key={item.slug}
                className="container flex justify-between my-1 p-2 border-b-2"
              >
                {item.slug}
                <span className="slug">
                  {item.slug} ({item.quantity} available for ₹{item.price})
                </span>
                <div className="mx-5">
                  <button
                    onClick={() => {
                      buttonAction("minus", item.slug, item.quantity)
                    }}                    
                    disabled={loadingAction}
                    className="subtract inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200"
                  > - </button>
                  <span className="quantity mx-3 inline-block w-6">
                    {item.quantity}
                  </span>
                  <button
                  onClick={() => {
                    buttonAction("plus", item.slug, item.quantity)
                  }}
                    disabled={setLoadingaction}
                    className="add inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200"
                  > + </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add a Product</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">
              Product Slug
            </label>
            <input
              type="text"
              value={productForm?.slug || ""}
              name="slug"
              onChange={handleChange}
              id="productName"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={productForm?.quantity || ""}
              name="quantity"
              onChange={handleChange}
              id="quantity"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              type="number"
              value={productForm?.price || ""}
              name="price"
              onChange={handleChange}
              id="price"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Display Current Stock</h1>

        <table className="table-auto w-full text-start">
          <thead>
            <tr>
              <th className="px-4 py-2 text-start">Product Name</th>
              <th className="px-4 py-2 text-start">Quantity</th>
              <th className="px-4 py-2 text-start">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.slug}>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                </tr>
              );
            })}
          </tbody>
          {/* <tbody>
            {stock.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
    </>
  );
}
