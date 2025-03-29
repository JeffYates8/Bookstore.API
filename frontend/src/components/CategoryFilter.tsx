// Import React hooks and custom CSS for the category filter styling
import { useEffect, useState } from "react";
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  // Local state to store the list of available book categories
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch the list of distinct book categories from the backend on initial render
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:5000/Books/GetBookCategories');
        const data = await response.json();
        console.log('Fetched categories: ', data); // For debugging
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  // Handles when a checkbox is clicked — adds or removes the category from the selected list
  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((c) => c !== target.value) // Remove if already selected
      : [...selectedCategories, target.value];              // Add if not selected

    setSelectedCategories(updatedCategories);
  }

  return (
    // Outer card for styling and layout
    <div className="card mb-4 shadow-sm" style={{ minWidth: "220px", width: "100%" }}>
      
      {/* Card header with title */}
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Filter by Category</h5>
      </div>

      {/* Scrollable body for category checkboxes */}
      <div
        className="card-body"
        style={{ maxHeight: "250px", overflowY: "auto" }}
      >
        {/* Map through each category and render a checkbox */}
        {categories.map((c) => (
          <div className="form-check" key={c}>
            <input
              className="form-check-input"
              type="checkbox"
              id={c}
              value={c}
              checked={selectedCategories.includes(c)}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor={c}>
              {c}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;