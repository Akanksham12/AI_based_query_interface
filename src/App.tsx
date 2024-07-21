import { useState } from "react";
import Select from "react-select";
import Loader from "./components/Loader";

import "./App.css";

const options = [
  { value: "MongoDB", label: "MongoDB" },
  { value: "SQL", label: "SQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MariaDB", label: "MariaDB" },
  { value: "Firebase", label: "Firebase" },
  { value: "Prisma", label: "Prisma" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "DynamoDB", label: "DynamoDB" },
];

function App() {
  const [DB, setDB] = useState({ label: "", value: "" });
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validations, setValidation] = useState({
    db: false,
    query: false,
  });

  const getDB = (param) => {
    setCopySuccess(false);
    setDB({ label: param.label, value: param.value });
    setValidation({ query: validations.query, db: true });
  };

  const getQuery = (e) => {
    setCopySuccess(false);
    setQuery(e.target.value);
    setValidation({
      query: e.target.value.length > 0,
      db: validations.db,
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
          database: DB.value,
          query: query,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setLoading(false);
      setResult(data.query || "No query generated.");
    } catch (error) {
      setLoading(false);
      setResult("Failed to generate query.");
      console.error("Error generating query:", error);
    }
  };

  return (
    <div className="App">
      <h1>Database Query Generator!</h1>
      <div className="app-inner">
        <Select
          placeholder="Select Your Database.."
          options={options}
          className="react-select"
          onChange={getDB}
        />

        <textarea
          rows={4}
          className="query-input"
          placeholder={`Enter your Database Query. \n\nFor Example, find all users who live in California and have over 1000 credits..`}
          onChange={getQuery}
        />

        <button
          disabled={!(validations.db && validations.query)}
          onClick={generateQuery}
          className="generate-query"
        >
          Generate Query
        </button>
        {!loading ? (
          result.length > 0 ? (
            <div className="result-text">
              <div className="clipboard">
                <p>Here is your Query!</p>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    setCopySuccess(true);
                  }}
                >
                  {copySuccess ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>{result}</pre> {/* Preserve formatting */}
            </div>
          ) : (
            <></>
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

export default App;
