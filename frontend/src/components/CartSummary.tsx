// Import tools for navigation and accessing cart data from context
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartSummary = () => {
  const navigate = useNavigate(); // Used to redirect user to the cart page
  const { cart } = useCart();     // Get current cart items from context

  // Calculate the total dollar amount of all items in the cart
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Calculate the total quantity of all items in the cart
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // Floating summary button that displays quantity and total price
    <div
      style={{
        position: 'fixed',              // Stays in place when scrolling
        top: '10px',                    // Positioned near top right of page
        right: '20px',
        background: '#f8f9fa',          // Light gray background
        padding: '10px 15px',           // Internal spacing
        borderRadius: '8px',            // Rounded corners
        cursor: 'pointer',              // Makes it look clickable
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Subtle shadow
        fontSize: '16px',
      }}
      onClick={() => navigate('/cart')} // Navigate to cart when clicked
    >
      {/* Emoji icon + dynamic item count and total price */}
      🛒 <strong>{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</strong> – ${totalAmount.toFixed(2)}
    </div>
  );
};

export default CartSummary;
