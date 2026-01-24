"use server";

// TODO: This is likely only needed when linking locally
import { credentials } from "definitions_ts/node_modules/@grpc/grpc-js";

import { EventSourceServiceClient } from "definitions_ts/src/generated/eventsource_grpc_pb";

import {
  serverStreamCallToPromise,
  unaryCallToPromise,
} from "./unaryCallToPromise";

const eventSourceClient = new EventSourceServiceClient(
  "localhost:50055",
  credentials.createInsecure(),
);

const eventSourceService = {
  append: unaryCallToPromise(eventSourceClient.append.bind(eventSourceClient)),
  createOutbox: unaryCallToPromise(
    eventSourceClient.createOutbox.bind(eventSourceClient),
  ),
  createTenant: unaryCallToPromise(
    eventSourceClient.createTenant.bind(eventSourceClient),
  ),
  deleteTenant: unaryCallToPromise(
    eventSourceClient.deleteTenant.bind(eventSourceClient),
  ),
  get: serverStreamCallToPromise(eventSourceClient.get.bind(eventSourceClient)),
  getAfterGlobalVersion: serverStreamCallToPromise(
    eventSourceClient.getAfterGlobalVersion.bind(eventSourceClient),
  ),
  getByAggregateIDAndName: serverStreamCallToPromise(
    eventSourceClient.getByAggregateIDAndName.bind(eventSourceClient),
  ),
  getByOutbox: serverStreamCallToPromise(
    eventSourceClient.getByOutbox.bind(eventSourceClient),
  ),
  getOutbox: unaryCallToPromise(
    eventSourceClient.getOutbox.bind(eventSourceClient),
  ),
  getTenant: unaryCallToPromise(
    eventSourceClient.getTenant.bind(eventSourceClient),
  ),
  listTenants: serverStreamCallToPromise(
    eventSourceClient.listTenants.bind(eventSourceClient),
  ),
  renameTenant: unaryCallToPromise(
    eventSourceClient.renameTenant.bind(eventSourceClient),
  ),
  testIdempotency: unaryCallToPromise(
    eventSourceClient.testIdempotency.bind(eventSourceClient),
  ),
  updateOutboxPosition: unaryCallToPromise(
    eventSourceClient.updateOutboxPosition.bind(eventSourceClient),
  ),
};
