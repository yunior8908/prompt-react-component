import React from "react";
import { Prompt } from "prompt-react-component";

import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>prompt-react-router-dom</h1>
      <h3>now depends of the current routing feature is used</h3>
      <Prompt disabledNavigation>
        {({ cancelFn, acceptFn }) => (
          <dialog open>
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
        )}
      </Prompt>
    </div>
  );
}

export default App;
