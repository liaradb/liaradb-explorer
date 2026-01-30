import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";

import { ActionButton, TextField } from "../../components";
import { useMessenger } from "../../messenger_context";

export type EventLogPageRoute = {
  route: "eventlog";
  params: EventLogPageParams;
};

export type EventLogPageParams = {
  tenantId: string;
};

export const EventLogPage: FC<EventLogPageParams> = (params) => {
  const messenger = useMessenger();

  const [aggregateId, setAggregateId] = useState("");

  const getAggregate = useCallback(async () => {
    const result = await messenger.sendRequest<
      GetAggregateRequest,
      GetAggregateResponse
    >({
      method: "getAggregate",
      message: {
        tenantId: params.tenantId,
        partitionId: 0,
        aggregateId,
      },
    });

    console.log(result);
  }, [params.tenantId, aggregateId]);

  return (
    <Container>
      <h1>Event Log</h1>
      <FormContainer
        onSubmit={(event) => {
          event.preventDefault();
          getAggregate();
        }}
      >
        <TextField
          label="Aggregate Id"
          after={<ActionButton title="Search" icon="search" type="submit" />}
          value={aggregateId}
          onChange={(event) => {
            setAggregateId(event.target.value);
          }}
        />
      </FormContainer>
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

const FormContainer = styled.form`
  max-width: 1024px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & .vscode-form-group {
    margin: 0;
  }
`;

type GetAggregateRequest = {
  method: "getAggregate";
  message: {
    tenantId: string;
    partitionId: number;
    aggregateId: string;
  };
};

type GetAggregateResponse = {
  events: any[];
};
