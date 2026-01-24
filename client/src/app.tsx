import React, { FC, useState } from "react";

import { useMessenger } from "./messenger_context";

export const App = () => {
  const messenger = useMessenger();

  const [results, setResult] = useState<unknown[]>([]);

  return (
    <>
      <img
        src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
        width="300"
      />
      <h1 id="lines-of-code-counter">0</h1>
      <button
        id="send"
        onClick={async () => {
          const result = await messenger.sendRequest({
            text: "request",
            requestId: 1,
          });
          setResult([...results, result]);
        }}
      >
        Button
      </button>
      <h1>Hello, world</h1>
      <ul>
        {results.map((r: any, i) => (
          <li key={i}>{`${r.value}`}</li>
        ))}
      </ul>
    </>
  );
};
