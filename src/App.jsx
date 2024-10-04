import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState([]);

  const fetchQuoteData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://ron-swanson-quotes.herokuapp.com/v2/quotes");
      setQuote(res.data[0]);
    } catch (error) {
      console.log("No Quote Available: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
    setSave(savedQuotes);
    fetchQuoteData();
  }, []);

  useEffect(() => {
    if (save.length > 0) {
      localStorage.setItem("savedQuotes", JSON.stringify(save));
    }
  }, [save]);

  const handleSavedQuote = () => {
    if (quote && !save.includes(quote)) {
      setSave((prevSave) => [...prevSave, quote]);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl mb-20 md:text-9xl font-bold text-gray-800 absolute top-10 text-center md:top-32">React Quote Generator</h1>
      <div className="w-full max-w-lg mt-20 bg-white shadow-lg rounded-lg p-8 text-center">
        {loading ? (
          <h1 className="text-xl font-semibold text-gray-800 italic">Loading...</h1>
        ) : (
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 italic mb-6">
              {quote || "No Quote Available"}
            </h1>
            <button
              onClick={fetchQuoteData}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 mr-5"
            >
              Get Another Quote
            </button>
            <button
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
              onClick={handleSavedQuote}
            >
              Save Quote
            </button>
          </div>
        )}
      </div>
      <div className="mt-10 w-full max-w-5xl border border-gray-800 rounded-lg overflow-hidden shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-center w-4/5">Quotes</th>
              <th className="px-4 py-2 text-center w-1/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {save.length > 0 ? (
              save.map((quote, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border-b border-gray-300 px-4 py-2">{quote}</td>
                  <td className="border-b border-gray-300 border-l-2 px-4 py-2 text-center">
                    <span
                      onClick={() => setSave(save.filter((q) => q !== quote))}
                      className="text-red-600 hover:cursor-pointer hover:underline"
                    >
                      Remove
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="2">
                  No Saved Quotes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
