import { useEffect, useState } from 'react';
import { Book } from '../types/Book.ts';
import './BooksList.css'; // Import external CSS for styling

const BooksList = () => {
  // State variables for storing book data, pagination, and sorting
  const [books, setBooks] = useState<Book[]>([]); // Stores the list of books
  const [loading, setLoading] = useState(true); // Tracks if data is still loading
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of books (for pagination)
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Controls sorting order (ascending or descending)

  // Fetches books from the backend when page number, page size, or sort order changes
  useEffect(() => {
    const fetchBooks = async () => {
        const response = await fetch(
            `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`
        );
        const data = await response.json();
        setBooks(data.books); // Updates books state with the fetched data
        setLoading(false); // Data is loaded, so stop showing "Loading..."
        setTotalItems(data.totalNumBooks); // Updates total book count
        setTotalPages(Math.ceil(totalItems / pageSize)); // Calculates the number of pages
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortOrder]); // Dependencies trigger a re-fetch when changed

  // If data is still loading, display a loading message
  if (loading) return <p>Loading books...</p>;

  // Toggles sorting order and triggers a refetch
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Switch between ascending and descending order
  };

  return (
    <div className="container mt-4">
      {/* Table displaying book information */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>{book.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

      {/* Generate pagination buttons dynamically */}
      {[...Array(totalPages)].map((_, i) => (
        <button key={i + 1} onClick={() => setPageNum(i + 1)} disabled={pageNum === (i + 1)}>
          {i + 1}
        </button>
      ))}

      <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

      {/* Button to toggle sorting */}
      <button className="btn btn-primary" onClick={handleSort}>
        Sort by Title {sortOrder === 'asc' ? '(Z-A)' : '(A-Z)'}
      </button>

      {/* Dropdown to select books per page */}
      <div>
        <label className="me-2">Books per page:
          <select value={pageSize} onChange={(p) => {
              setPageSize(Number(p.target.value)); // Updates books per page
              setPageNum(1); // Reset to first page when changing page size
          }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default BooksList;