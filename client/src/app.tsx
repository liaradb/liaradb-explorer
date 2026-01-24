import React, { FC, useState } from "react";

import { useMessenger } from "./messenger_context";
import { Messenger } from "./messenger";

export const App = () => {
  const messenger = useMessenger();

  const [results, setResult] = useState<GetOutboxResponse[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [outboxId, setOutboxId] = useState("");
  const [tenantId, setTenantId] = useState("");

  return (
    <>
      <img
        src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
        width="300"
      />
      <h1 id="lines-of-code-counter">0</h1>
      <input
        type="text"
        value={outboxId}
        onChange={(event) => {
          setOutboxId(event.target.value);
        }}
      />
      <input
        type="text"
        value={tenantId}
        onChange={(event) => {
          setTenantId(event.target.value);
        }}
      />
      <button
        id="send"
        onClick={async () => {
          try {
            const result = await getOutbox(messenger, outboxId, tenantId);
            setResult([...results, result]);
          } catch (err) {
            setErrors([...errors, `${err}`]);
          }
        }}
      >
        Button
      </button>
      <h1>Hello, world</h1>
      <ul>
        {results.map((r, i) => (
          <li key={i}>{`Outbox: ${r.globalVersion}, ${r.low}, ${r.high}`}</li>
        ))}
      </ul>
      <h2>Errors</h2>
      <ul>
        {errors.map((e, i) => (
          <li key={i}>{`${e}`}</li>
        ))}
      </ul>
    </>
  );
};

const getOutbox = async (
  messenger: Messenger,
  outboxId: string,
  tenantId: string,
) => {
  return messenger.sendRequest<GetOutboxRequest, GetOutboxResponse>({
    method: "getOutbox",
    message: {
      outboxId,
      tenantId,
    },
  });
};

type GetOutboxRequest = {
  method: "getOutbox";
  message: {
    outboxId: string;
    tenantId: string;
  };
};

type GetOutboxResponse = {
  globalVersion: number;
  low: number;
  high: number;
};
