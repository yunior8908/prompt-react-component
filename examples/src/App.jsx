import React, { useEffect } from "react";
import { Prompt } from "prompt-react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>prompt-react-router-dom</h1>
      <Prompt disabledNavigation>
        {({ onCancel, onOk }) => (
          <dialog open>
            <p>Are you sure you want to leave?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                gap: "1rem",
              }}
            >
              <button onClick={onCancel}>cancel</button>
              <button onClick={onOk}>ok</button>
            </div>
          </dialog>
        )}
      </Prompt>
    </div>
  );
}

export default App;
