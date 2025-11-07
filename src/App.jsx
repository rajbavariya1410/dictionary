import React, { useState } from "react";
import axios from "axios";

export default function DictionaryApp() {
  const [word, setWord] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getMeaning = async () => {
    if (!word.trim()) {
      setError("Please enter a word.");
      return;
    }

    setError("");
    setData(null);
    setLoading(true);

    try {
      const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      setData(res.data[0]);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Word not found 😕");
      } else {
        setError("Error fetching data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">📘 Dictionary</h1>

        {/* Input Field */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            onClick={getMeaning}
            className="bg-blue-500 text-white px-2 lg:px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            🔍
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500 text-center">Loading...</p>}

        {/* Error */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Word Data */}
        {data && !loading && (
          <div className="mt-4 space-y-2">
            <h2 className="text-xl font-semibold capitalize">{data.word}</h2>

            {data.phonetics[0]?.text && (
              <p className="text-gray-600 ">Pronunciation: {data.phonetics[0].text}</p>
            )}

            {data.phonetics[0]?.audio && (
              <audio controls className="mt-2 w-60 lg:w-100">
                <source src={data.phonetics[0].audio} type="audio/mpeg" />
              </audio>
            )}

            {data.meanings.map((meaning, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-blue-600">{meaning.partOfSpeech}</p>
                <ul className="list-disc pl-5 text-gray-700">
                  {meaning.definitions.slice(0, 2).map((def, i) => (
                    <li key={i}>{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
