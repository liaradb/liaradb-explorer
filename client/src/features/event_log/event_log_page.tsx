import React, { FC, useState } from "react";
import styled from "styled-components";

import { ActionButton, TextField } from "../../components";

export type EventLogPageRoute = {
  route: "eventlog";
  params: EventLogPageParams;
};

export type EventLogPageParams = {
  tenantId: string;
};

export const EventLogPage: FC<EventLogPageParams> = (params) => {
  const [aggregateId, setAggregateId] = useState("");

  return (
    <Container>
      <h1>Event Log</h1>
      <FormContainer
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextField
          label="Aggregate Id"
          after={<ActionButton title="Search" icon="search" />}
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
