using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookDbContext _bookContext;

        public BooksController(BookDbContext context)
        {
            _bookContext = context;
        }

        // GET /Books/AllBooks
        [HttpGet("AllBooks")]
        public IActionResult GetAllBooks(
            int pageSize = 10, // default page size
            int pageNum = 1,
            string sortOrder = "asc",
            [FromQuery] List<string>? bookCategories = null) 
        {
            var query = _bookContext.Books.AsQueryable(); // IQueryable allows for deferred execution

            if (bookCategories != null && bookCategories.Any()) 
            {
                query = query.Where(b => bookCategories.Contains(b.Category)); // filter by categories
            }

            if (sortOrder == "desc")
            {
                query = query.OrderByDescending(b => b.Title); // sort by title descending
            }
            else
            {
                query = query.OrderBy(b => b.Title); // sort by title ascending
            }

            var totalNumBooks = query.Count(); // total number of books after filtering

            var books = query
                .Skip((pageNum - 1) * pageSize) // skip to the correct page
                .Take(pageSize) // take the page size
                .Select(b => new {
                    bookId = b.BookID,
                    title = b.Title,
                    author = b.Author,
                    publisher = b.Publisher,
                    isbn = b.ISBN,
                    category = b.Category,
                    classification = b.Classification,
                    pageCount = b.PageCount,
                    price = b.Price
                })
                .ToList(); 

            var result = new // object
            {
                books,
                totalNumBooks
            };

            return Ok(result); // return the result
        }

        // GET /Books/GetBookCategories
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var categories = _bookContext.Books // get all books
                .Select(b => b.Category)
                .Distinct() // get distinct categories
                .ToList();

            return Ok(categories);
        }


        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            if (newBook == null)
            {
                return BadRequest("Book cannot be null.");
            }

            _bookContext.Books.Add(newBook); // add the book to the context
            _bookContext.SaveChanges(); // save changes to the database

            return Ok(newBook); // return the created book
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
            
            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book ==null)
            {
                return NotFound(new {message = "Book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}