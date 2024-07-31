/*import { useState } from "react";
import Loader from "./components/Loader";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null); // Initialize as null
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
        const errorData = await response.json();
        setLoading(false);
        setResult(errorData.error || "Failed to generate or execute query.");
        return;
      }

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setResult(data.error);
      } else if (data.results) {
        // Format the results to display as styled blocks
        const formattedResults = Array.isArray(data.results)
          ? data.results.map((item: any, index: number) => (
              <div key={index} className="result-item">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="result-entry">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            ))
          : "No result found.";
        setResult(<>{formattedResults}</>);
      } else {
        setResult("No result found.");
      }
    } catch (error) {
      setLoading(false);
      setResult(`Failed to generate or execute query. ${error.message}`);
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
        {loading ? (
          <Loader />
        ) : result ? (
          <div className="result-text">
            <div className="clipboard">
              <p>Here is your Result!</p>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(typeof result === 'string' ? result : (result as JSX.Element).props.children);
                  setCopySuccess(true);
                }}
              >
                {copySuccess ? "Copied" : "Copy"}
              </button>
            </div>
            <div>{result}</div>
          </div>
        ) : (
          <p className="placeholder-text">Please enter a query and click "Generate and Execute Query".</p>
        )}
      </div>
    </div>
  );
}

export default App;
*/
import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null); 
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validations, setValidation] = useState({ query: false });
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);

  useEffect(() => {
    // Fetch list of databases
    fetch("http://localhost:5000/databases")
      .then(response => response.json())
      .then(data => setDatabases(data.databases))
      .catch(error => console.error('Error fetching databases:', error));
  }, []);

  const getQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCopySuccess(false);
    setQuery(e.target.value);
    setValidation({ query: e.target.value.length > 0 });
  };

  const generateQuery = async () => {
    setCopySuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, database: selectedDatabase }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoading(false);
        setResult(errorData.error || "Failed to generate or execute query.");
        return;
      }

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setResult(data.error);
      } else if (data.results) {
        const formattedResults = Array.isArray(data.results)
          ? data.results.map((item: any, index: number) => (
              <div key={index} className="result-item">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="result-entry">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            ))
          : "No result found.";
        setResult(<>{formattedResults}</>);
      } else {
        setResult("No result found.");
      }
    } catch (error) {
      setLoading(false);
      setResult(`Failed to generate or execute query. ${error.message}`);
      console.error("Error generating or executing query:", error);
    }
  };

  return (
    <div className="App">
      <h1>Database Query Generator!</h1>
      <div className="app-inner">
        <select onChange={(e) => setSelectedDatabase(e.target.value)} value={selectedDatabase || ""}>
          <option value="" disabled>Select a Database</option>
          {databases.map((db, index) => (
            <option key={index} value={db}>{db}</option>
          ))}
        </select>
        <textarea
          rows={4}
          className="query-input"
          placeholder="Enter your request. For example, 'Provide all details from table food_tbl'."
          onChange={getQuery}
        />
        <button
          disabled={!validations.query || !selectedDatabase}
          onClick={generateQuery}
          className="generate-query"
        >
          Generate and Execute Query
        </button>
        {loading ? (
          <Loader />
        ) : result ? (
          <div className="result-text">
            <div className="clipboard">
              <p>Here is your Result!</p>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(typeof result === 'string' ? result : (result as JSX.Element).props.children);
                  setCopySuccess(true);
                }}
              >
                {copySuccess ? "Copied" : "Copy"}
              </button>
            </div>
            <div>{result}</div>
          </div>
        ) : (
          <p className="placeholder-text">Please enter a query and select a database.</p>
        )}
      </div>
    </div>
  );
}

export default App;
