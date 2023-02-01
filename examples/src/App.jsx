import React from "react";
import { Prompt } from "prompt-react-component";
import { useNavigate } from "react-router-dom";

import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>prompt-react-router-dom</h1>
      <h3>now depends of the current routing feature is used</h3>
      <Prompt disabledNavigation navigate={navigate}>
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
