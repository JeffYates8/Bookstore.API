import { useEffect, useState } from 'react';
import { Book } from '../types/Book.ts';
import './BooksList.css'; // Import external CSS for styling
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination.tsx';
import { fetchBooks } from '../api/BooksAPI.tsx';

const BooksList = ({selectedCategories}: {selectedCategories: string[]}) => {
  // State variables for storing book data, pagination, and sorting
  const [books, setBooks] = useState<Book[]>([]); // Stores the list of books
  const [loading, setLoading] = useState(true); // Tracks if data is still loading
  const [error, setError] = useState<string | null>(null); // Stores any error messages
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const navigate = useNavigate();
  

  // Fetches books from the backend when page number, page size, or sort order changes
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, selectedCategories);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, selectedCategories]); // Dependencies trigger a re-fetch when changed
  // Fetches books from the backend API
  if (loading) return <p>Loading books...</p>; // If data is still loading, display a loading message
  if (error) return <p className="text-red-500">Error: {error}</p>; // If there's an error, display it

  return (
          <>
            {books.map((b) => (
              <div id='bookCard' className='card' key={b.bookId}>
                  <h3 className='card-title'>{b.title}</h3>
                  <div className='card-body'>
                      <ul className='list-unstyled'>
                          <li><strong>Title: </strong>{b.title}</li>
                          <li><strong>Author: </strong>{b.author}</li>
                          <li><strong>Publisher: </strong>{b.publisher}</li>
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

              <Pagination
                      currentPage={pageNum}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      onPageChange={setPageNum}
                      onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setPageNum(1);
                      }}
                    />
                  </>
  );
};

export default BooksList;  