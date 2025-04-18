import './App.css'
import CartPage from './components/CartPage';
import { CartProvider } from './context/CartContext';
import BuyBooksPage from './pages/BuyBooksPage';
import BookListPage from './pages/BookListPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BookListPage />} />
            <Route path="/projects" element={<BookListPage />} />
            <Route path="/purchase/:title/:price/:bookId" element={<BuyBooksPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}

export default App



