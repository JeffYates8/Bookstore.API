// Import React hooks and components used on the main book listing page
import { useState } from "react";
import CartSummary from "../components/CartSummary";
import WelcomeBand from "../components/WelcomeBand";
import BooksList from "../components/BooksList";
import CategoryFilter from "../components/CategoryFilter";

function BookListPage () {
  // Local state to keep track of which book categories are currently selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      {/* Bootstrap container to center content with default margins */}
      <div className='container mt-4'>
        {/* Floating cart summary button at top-right */}
        <CartSummary />

        {/* Welcome header/banner at the top of the page */}
        <WelcomeBand />

        {/* Bootstrap grid row for layout */}
        <div className='row'>

          {/* Sidebar filter: 3 columns wide on medium+ screens */}
          <div className='col-md-3'>
            <CategoryFilter 
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          {/* Main content area for displaying books: 9 columns wide */}
          <div className='col-md-9 books-list-container'>
            <BooksList selectedCategories={selectedCategories} />
          </div>

        </div>
      </div>
    </>
  );
}

export default BookListPage;
