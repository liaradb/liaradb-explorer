import React, { FC, useState } from "react";
import styled from "styled-components";

import "./styles";

import { useMessenger } from "./messenger_context";
import { Messenger } from "./messenger";
import { Button } from "./components";

export const App = () => {
  const messenger = useMessenger();

  const [results, setResult] = useState<GetOutboxResponse[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [outboxId, setOutboxId] = useState("");
  const [tenantId, setTenantId] = useState("");

  return (
    <Container>
      <h1>Outbox</h1>
      <FormContainer>
        <input
          type="text"
          className="vscode-textfield"
          value={outboxId}
          onChange={(event) => {
            setOutboxId(event.target.value);
          }}
        />
        <input
          type="text"
          className="vscode-textfield"
          value={tenantId}
          onChange={(event) => {
            setTenantId(event.target.value);
          }}
        />
        <Button
          block
          onClick={async () => {
            const { outboxId, tenantId } = globalParams;
            try {
              const result = await getOutbox(messenger, outboxId, tenantId);
              setResult([...results, result]);
            } catch (err) {
              setErrors([...errors, `${err}`]);
            }
          }}
        >
          Button
        </Button>
      </FormContainer>
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 1024px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px;
`;

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
