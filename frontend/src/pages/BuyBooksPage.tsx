// Import React tools, routing helpers, and shared components
import { useState } from "react";
import WelcomeBand from "../components/WelcomeBand";
import { CartItem } from "../types/CartItem";
import { useCart } from "../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";

function BuyBooksPage () {
  const navigate = useNavigate(); // Used to redirect the user to another page
  const { title, price, bookId } = useParams(); // Extract URL parameters
  const { addToCart } = useCart(); // Access add-to-cart function from context

  // Parse price string to number, fallback to 0 if missing
  const parsedPrice = price ? parseFloat(price) : 0;

  // Local state to hold user-specified quantity of books to purchase
  const [quantity, setQuantity] = useState(1);

  // When the user clicks "Add to Cart", create a CartItem object and save it
  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || "No Book Found",
      price: parsedPrice,
      quantity: quantity,
      subtotal: parsedPrice * quantity, // Total price for this item
    };

    addToCart(newItem);   // Add item to the cart context
    navigate('/cart');    // Redirect user to the cart page
  };

  return (
    <>
      <WelcomeBand /> {/* Renders the welcome banner/header */}
      <h2> Purchase <i>{title}</i></h2>

      {/* Purchase form layout */}
      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          value={parsedPrice}
          readOnly // Prevent user from modifying the price
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))} // Update quantity
        />

        {/* Action buttons */}
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
};

export default BuyBooksPage;