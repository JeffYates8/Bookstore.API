// Import necessary tools from React Router and custom cart context
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function CartPage() {
  const navigate = useNavigate();

  // Get cart items and cart functions from context
  const { cart, removeFromCart } = useCart();

  // Calculate the overall cart total by summing each item's subtotal
  const overallTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div>
      <h2>Your Cart</h2>

      {/* Show a message if the cart is empty, otherwise list the items */}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {/* Map through each cart item and display its details */}
            {cart.map((item: CartItem) => (
              <li key={item.bookId} style={{ marginBottom: "1rem" }}>
                <h4>{item.title}</h4>
                <p>Price per book: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total for this book: ${item.subtotal.toFixed(2)}</p>

                {/* Button to remove item from cart */}
                <button onClick={() => removeFromCart(item.bookId)}>Remove</button>
              </li>
            ))}
          </ul>

          {/* Display the total for all items in the cart */}
          <h3>Cart Subtotal: ${overallTotal.toFixed(2)}</h3>
        </>
      )}

      {/* Checkout and navigation buttons */}
      <button>Checkout</button>
      <button onClick={() => navigate("/")}>Continue Shopping</button>
    </div>
  );
}

export default CartPage;
