import { useEffect, useState } from 'react';
import { Book } from '../types/Book.ts';
import './BooksList.css'; // Import external CSS for styling
import { useNavigate } from 'react-router-dom';

const BooksList = ({selectedCategories}: {selectedCategories: string[]}) => {
  // State variables for storing book data, pagination, and sorting
  const [books, setBooks] = useState<Book[]>([]); // Stores the list of books
  const [loading, setLoading] = useState(true); // Tracks if data is still loading
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of books (for pagination)
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Controls sorting order (ascending or descending)
  const navigate = useNavigate();
  

  // Fetches books from the backend when page number, page size, or sort order changes
  useEffect(() => {
    const fetchBooks = async () => {

      const categoryParams = selectedCategories.map((cat) => `bookCategories=${encodeURIComponent(cat)}`).join('&')

        const response = await fetch(
            `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`,
        );
        const data = await response.json();
        setBooks(data.books); // Updates books state with the fetched data
        setLoading(false); // Data is loaded, so stop showing "Loading..."
        setTotalItems(data.totalNumBooks); // Updates total book count
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Calculates the number of pages
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortOrder, selectedCategories]); // Dependencies trigger a re-fetch when changed

  // Goes back to page 1 when the user selects a filter
  useEffect(() => {
    setPageNum(1);
  }, [selectedCategories]);

  // If data is still loading, display a loading message
  if (loading) return <p>Loading books...</p>;

  // Toggles sorting order and triggers a refetch
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Switch between ascending and descending order
  };

  return (
        <>
          {books.map((b) => (
            <div id='bookCard' className='card' key={b.bookId}>
                <h3 className='card-title'>{b.title}</h3>
                <div className='card-body'>
                    <ul className='list-unstyled'>
                        <li><strong>Title: </strong>{b.title}</li>
                        <li><strong>Author: </strong>{b.author}</li>
                        <li><strong>Publisher: </strong>{b.publisher} Individuals Served</li>
                        <li><strong>ISBN: </strong>{b.isbn}</li>
                        <li><strong>Category: </strong>{b.category}</li>
                        <li><strong>Classification: </strong>{b.classification}</li>
                        <li><strong>Pages: </strong>{b.pageCount}</li>
                        <li><strong>Price ($): </strong>{b.price}</li>
                    </ul>

                    <button className='btn btn-success' onClick={() => navigate(`/purchase/${b.title}/${b.price}/${b.bookId}`)}>Purchase</button>
                </div>
            </div>
            ))}

      {/* Pagination Controls */}
      <nav aria-label="Book pagination">
        <ul className="pagination justify-content-center mt-4">

          {/* Previous Button */}
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>
              Previous
            </button>
          </li>

          {/* Page Number Buttons */}
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i + 1}
              className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

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
    </>
  );
};

export default BooksList;