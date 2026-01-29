import React, { FC, useState } from "react";
import styled from "styled-components";

import { ActionButton, Button, Icon, TextField } from "../../components";
import { useMessenger } from "../../messenger_context";
import { Messenger } from "../../messenger";

export type OutboxPageRoute = {
  route: "outbox";
  params: OutboxPageParams;
};

export type OutboxPageParams = {
  tenantId: string;
  outboxId: string;
};

export const OutboxPage: FC<OutboxPageParams> = (params) => {
  const messenger = useMessenger();

  const [results, setResult] = useState<GetOutboxResponse[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [outboxId, setOutboxId] = useState(params.outboxId);
  const [tenantId, setTenantId] = useState(params.tenantId);

  return (
    <Container>
      <h1>Outbox</h1>
      <FormContainer>
        <TextField
          label="Outbox Id"
          after={<ActionButton title="Math Case" icon="case-sensitive" />}
          value={outboxId}
          onChange={(event) => {
            setOutboxId(event.target.value);
          }}
        />
        <TextField
          label="Tenant Id"
          value={tenantId}
          onChange={(event) => {
            setTenantId(event.target.value);
          }}
        />
        <Button
          block
          onClick={async () => {
            const { outboxId, tenantId } = params;
            try {
              const result = await getOutbox(messenger, outboxId, tenantId);
              setResult([...results, result]);
            } catch (err) {
              setErrors([...errors, `${err}`]);
            }
          }}
        >
          <Icon type="account" /> Button
        </Button>
      </FormContainer>
      <div className="vscode-form-group">
        <label htmlFor="textfield1" className="vscode-label">
          Label example
        </label>{" "}
        <div className="vscode-textfield">
          <i className="codicon codicon-search"></i>
          <input type="text" required />
          <button className="vscode-action-button" title="Math Case">
            <i className="codicon codicon-case-sensitive"></i>
          </button>
          <button className="vscode-action-button" title="Math Whole Word">
            <i className="codicon codicon-whole-word"></i>
          </button>
          <button
            className="vscode-action-button"
            title="Use Regular Expression"
          >
            <i className="codicon codicon-regex"></i>
          </button>
        </div>
        <div className="vscode-form-helper">
          <p>
            Lorem ipsum <code>let dolor = sit amet</code>, consectetur
            adipiscing elit.
            <span className="error">Suspendisse</span> faucibus imperdiet
            sapien, a gravida <a href="#">dolor</a>.
          </p>
        </div>
      </div>

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
  align-items: stretch;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 1024px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & .vscode-form-group {
    margin: 0;
  }
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
