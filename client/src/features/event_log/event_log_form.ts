import { useCallback } from "react";
import { array, date, number, object, string } from "yup";

import { useYupForm } from "../../components";
import { useMessenger } from "../../messenger_context";
import { Messenger } from "../../messenger";

const EventSchema = object({});

const AppendEventSchema = object({
  events: array().of(EventSchema).required(),
  aggregateId: string().default(""),
  correlationId: string(),
  requestId: string(),
  time: date(),
  userId: string(),
  partitionId: number(),
  tenantId: string(),
});

export const useEventLogForm = (tenantId: string) => {
  const messenger = useMessenger();
  const { register, handleSubmit } = useYupForm(AppendEventSchema);

  const onSubmit = useCallback(
    handleSubmit((data) => {}),
    [],
  );

  const getAggregate = handleSubmit(
    useCallback(
      async (data) => {
        console.log(data);
        const result = await messenger.sendRequest<
          GetAggregateRequest,
          GetAggregateResponse
        >({
          method: "getAggregate",
          message: {
            tenantId,
            partitionId: 0,
            ...data,
          },
        });

        console.log(result);
      },
      [tenantId, messenger],
    ),
  );

  return {
    getAggregate,
    onSubmit,
    register,
  };
};

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

const append = async (
  messenger: Messenger,
  message: {
    events: EventDto[];
    correlationId: string;
    requestId: string;
    time: Date;
    userId: string;
    partitionId: number;
    tenantId: string;
  },
) => {
  return messenger.sendRequest<AppendEventRequest, AppendEventResponse>({
    method: "append",
    message,
  });
};

type AppendEventRequest = {
  method: "append";
  message: {
    events: EventDto[];
    correlationId: string;
    requestId: string;
    time: Date;
    userId: string;
    partitionId: number;
    tenantId: string;
  };
};

type EventDto = {
  aggregateId: string;
  aggregateName: string;
  data: string | Uint8Array<ArrayBufferLike>;
  id: string;
  name: string;
  schema: string;
  version: number;
};

type AppendEventResponse = {};
