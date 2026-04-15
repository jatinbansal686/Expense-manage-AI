import axios from "axios";
const Navbar = () => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5173/api/upload/statement", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Uploaded successfully");
  };
  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <h2 className="text-lg font-semibold text-gray-800">Welcome back 👋</h2>

      <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition">
        Upload CSV
        <input type="file" accept=".csv" onChange={handleUpload} hidden />
      </label>
      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <input
          placeholder="Search..."
          className="border px-3 py-1 rounded-lg"
        />

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">
            J
          </div>
          <span className="text-sm font-medium">Jatin</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
