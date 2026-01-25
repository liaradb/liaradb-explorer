"use server";

// TODO: This is likely only needed when linking locally
import { credentials } from "definitions_ts/node_modules/@grpc/grpc-js";

import { EventSourceServiceClient } from "definitions_ts/src/generated/eventsource_grpc_pb";
import {
  CreateOutboxRequest,
  CreateTenantRequest,
  GetOutboxRequest,
  ListTenantsRequest,
} from "definitions_ts/src/generated/eventsource_pb";

import {
  serverStreamCallToPromise,
  unaryCallToPromise,
} from "./unaryCallToPromise";

const client = new EventSourceServiceClient(
  "localhost:50055",
  credentials.createInsecure(),
);

const service = {
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

export async function createTenant(tenantId: string, name: string) {
  const request = new CreateTenantRequest();
  request.setTenantId(tenantId);
  request.setName(name);

  const response = await service.createTenant(request);

  return response.getTenantId();
}

export async function listTenants() {
  const request = new ListTenantsRequest();

  const response = await service.listTenants(request);

  return response.map((t) => ({
    id: t.getTenantId(),
    name: t.getName(),
  }));
}

export async function createOutbox(
  outboxId: string,
  tenantId: string,
  low: number,
  high: number,
) {
  const request = new CreateOutboxRequest();
  request.setOutboxId(outboxId);
  request.setTenantId(tenantId);
  request.setLow(low);
  request.setHigh(high);

  const response = await service.createOutbox(request);

  return response.getOutboxId();
}

export async function getOutbox(outboxId: string, tenantId: string) {
  const request = new GetOutboxRequest();
  request.setOutboxId(outboxId);
  request.setTenantId(tenantId);

  const response = await service.getOutbox(request);

  return {
    globalVersion: response.getGlobalVersion(),
    low: response.getLow(),
    high: response.getHigh(),
  };
}
