"use server";

// TODO: This is likely only needed when linking locally
import { credentials } from "definitions_ts/node_modules/@grpc/grpc-js";

import { EventSourceServiceClient } from "definitions_ts/src/generated/eventsource_grpc_pb";

import {
  serverStreamCallToPromise,
  unaryCallToPromise,
} from "./unaryCallToPromise";

const client = new EventSourceServiceClient(
  "localhost:50055",
  credentials.createInsecure(),
);

export const service = {
  append: unaryCallToPromise(client.append.bind(client)),
  createOutbox: unaryCallToPromise(client.createOutbox.bind(client)),
  createTenant: unaryCallToPromise(client.createTenant.bind(client)),
  deleteTenant: unaryCallToPromise(client.deleteTenant.bind(client)),
  get: serverStreamCallToPromise(client.get.bind(client)),
  getAfterGlobalVersion: serverStreamCallToPromise(
    client.getAfterGlobalVersion.bind(client),
  ),
  getByAggregateIDAndName: serverStreamCallToPromise(
    client.getByAggregateIDAndName.bind(client),
  ),
  getByOutbox: serverStreamCallToPromise(client.getByOutbox.bind(client)),
  getOutbox: unaryCallToPromise(client.getOutbox.bind(client)),
  getTenant: unaryCallToPromise(client.getTenant.bind(client)),
  listTenants: serverStreamCallToPromise(client.listTenants.bind(client)),
  renameTenant: unaryCallToPromise(client.renameTenant.bind(client)),
  testIdempotency: unaryCallToPromise(client.testIdempotency.bind(client)),
  updateOutboxPosition: unaryCallToPromise(
    client.updateOutboxPosition.bind(client),
  ),
};
