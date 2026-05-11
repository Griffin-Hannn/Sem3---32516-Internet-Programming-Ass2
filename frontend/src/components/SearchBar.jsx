export default function SearchBar({ value, onChange }) {
  return (
    <div className="filter-control">
      <label htmlFor="expense-search">Search</label>
      <input
        id="expense-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search title, description, category"
      />
    </div>
  );
}
