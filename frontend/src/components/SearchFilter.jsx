export default function SearchFilter({ search, setSearch, category, setCategory, setShowAll }) {
  return (
    <div className="flex justify-center gap-4 mb-10">
      <input
        type="text"
        placeholder="Search sweets"
        className="w-1/3 px-4 py-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="px-4 py-2 border rounded"
        onChange={(e) => {
          setCategory(e.target.value);
          setShowAll(true);
        }}
        value={category}
      >
        <option value="all">All</option>
        <option value="cake">Cake</option>
        <option value="chocolate">Chocolate</option>
        <option value="sweet">Sweet</option>
      </select>
    </div>
  );
}
