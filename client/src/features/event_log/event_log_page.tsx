import React, { FC } from "react";
import styled from "styled-components";

import { ActionButton, TextField } from "../../components";
import { useEventLogForm } from "./event_log_form";

export type EventLogPageRoute = {
  route: "eventlog";
  params: EventLogPageParams;
};

export type EventLogPageParams = {
  tenantId: string;
};

export const EventLogPage: FC<EventLogPageParams> = ({ tenantId }) => {
  const { register, getAggregate } = useEventLogForm(tenantId);

  return (
    <Container>
      <h1>Event Log</h1>
      <FormContainer onSubmit={getAggregate}>
        <TextField
          {...register("aggregateId")}
          label="Aggregate Id"
          after={<ActionButton title="Search" icon="search" type="submit" />}
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
