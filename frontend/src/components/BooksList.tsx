import { useEffect, useState } from 'react';
import { Book } from '../types/Book.ts';
import './BooksList.css'; // Import external CSS for styling
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination.tsx';
import { fetchBooks } from '../api/BooksAPI.ts';

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
//   const fetchBooks = async () => {

  //     const categoryParams = selectedCategories.map((cat) => `bookCategories=${encodeURIComponent(cat)}`).join('&')

  //       const response = await fetch(
  //           `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`,
  //       );
  //       const data = await response.json();
  //       setBooks(data.books); // Updates books state with the fetched data
  //       setLoading(false); // Data is loaded, so stop showing "Loading..."
  //       setTotalItems(data.totalNumBooks); // Updates total book count
  //       setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Calculates the number of pages
  //   };

  //   fetchBooks();
  // }, [pageSize, pageNum, totalItems, sortOrder, selectedCategories]); // Dependencies trigger a re-fetch when changed

  // // Goes back to page 1 when the user selects a filter
  // useEffect(() => {
  //   setPageNum(1);
  // }, [selectedCategories]);

  // // If data is still loading, display a loading message
  // if (loading) return <p>Loading books...</p>;

  // // Toggles sorting order and triggers a refetch
  // const handleSort = () => {
  //   setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Switch between ascending and descending order
  // };

  
