import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { css } from "@emotion/react";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./helper/auth";

function App() {
  const [count, setCount] = useState(0);
  const [resp, setResp] = useState("");
  useEffect(() => {
    void (async () => {
      const resp = await fetch("/api/hello");
      if (resp.ok) {
        setResp(await resp.text());
      }
    })();
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <LoginPage />
        <div>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>{resp ?? "Vite + React"}</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>

        <div
          css={css`
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
          `}
        >
          EMOTION INSTALLED
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
