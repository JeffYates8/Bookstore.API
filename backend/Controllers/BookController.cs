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
            int pageSize = 10,
            int pageNum = 1,
            string sortOrder = "asc",
            [FromQuery] List<string>? bookCategories = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            if (sortOrder == "desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalNumBooks = query.Count();

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
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

            var result = new
            {
                books,
                totalNumBooks
            };

            return Ok(result);
        }

        // GET /Books/GetBookCategories
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(categories);
        }
    }
}