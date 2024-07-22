import { useState } from "react";
import Loader from "./components/Loader";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validations, setValidation] = useState({
    query: false,
  });

  const getQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCopySuccess(false);
    setQuery(e.target.value);
    setValidation({
      query: e.target.value.length > 0,
    });
  };

  const generateQuery = async () => {
    setCopySuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setLoading(false);

      // Format data if necessary
      if (Array.isArray(data.results)) {
        setResult(data.results);
      } else {
        setResult([]);
      }
    } catch (error) {
      setLoading(false);
      setResult([]);
      console.error("Error generating or executing query:", error);
    }
  };

  return (
    <div className="App">
      <h1>Database Query Generator!</h1>
      <div className="app-inner">
        <textarea
          rows={4}
          className="query-input"
          placeholder={`Enter your request. For example, "Provide all details from table food_tbl".`}
          onChange={getQuery}
        />

        <button
          disabled={!validations.query}
          onClick={generateQuery}
          className="generate-query"
        >
          Generate and Execute Query
        </button>
        {!loading ? (
          result.length > 0 ? (
            <div className="result-text">
              <div className="clipboard">
                <p>Here is your Result!</p>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                    setCopySuccess(true);
                  }}
                >
                  {copySuccess ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>{formatResults(result)}</pre> {/* Format the result */}
            </div>
          ) : (
            <p>No result found.</p>
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

// Helper function to format results
const formatResults = (results: any[]) => {
  if (results.length === 0) {
    return "No results to display.";
  }
  
  return results.map((item, index) => (
    <div key={index} className="result-item">
      {Object.entries(item).map(([key, value]) => (
        <div key={key} className="result-entry">
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  ));
};

export default App;
