import React from "react";
import { usePrompt } from "prompt-react-component";

import "./App.css";

function App() {
  const { canRender, cancelFn, acceptFn } = usePrompt(true);

  return (
    <div className="App">
      <h1>prompt-react-router-dom</h1>
      <h3>now depends of the current routing feature is used</h3>

      <dialog open={canRender}>
        <p>Are you sure you want to leave?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "1rem",
          }}
        >
          <button onClick={cancelFn}>cancel</button>
          <button onClick={acceptFn}>ok</button>
        </div>
      </dialog>
    </div>
  );
}

export default App;
