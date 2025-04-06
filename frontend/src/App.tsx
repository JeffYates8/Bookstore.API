import './App.css'
import CartPage from './components/CartPage';
import { CartProvider } from './context/CartContext';
import BuyBooksPage from './pages/BuyBooksPage';
import BookListPage from './pages/BookListPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BookListPage />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/purchase/:title/:price/:bookId" element={<BuyBooksPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminbooks" element={<AdminBooksPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}

export default App