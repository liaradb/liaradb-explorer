"use server";

// TODO: This is likely only needed when linking locally
import { credentials } from "definitions_ts/node_modules/@grpc/grpc-js";

import { EventSourceServiceClient } from "definitions_ts/src/generated/eventsource_grpc_pb";

import {
  serverStreamCallToPromise,
  unaryCallToPromise,
} from "./unaryCallToPromise";
import {
  CreateOutboxRequest,
  CreateTenantRequest,
  GetOutboxRequest,
  ListTenantsRequest,
  Tenant as TenantMessage,
} from "definitions_ts/src/generated/eventsource_pb";
import { Tenant } from "../domain";

export class EventSourceService {
  constructor(private href: string) {
    this.client = new EventSourceServiceClient(
      href,
      credentials.createInsecure(),
    );
    this.service = createService(this.client);
  }

  private client: EventSourceServiceClient;
  private service: ReturnType<typeof createService>;

  async createOutbox(
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

    const response = await this.service.createOutbox(request);

    return response.getOutboxId();
  }

  async getOutbox(outboxId: string, tenantId: string) {
    const request = new GetOutboxRequest();
    request.setOutboxId(outboxId);
    request.setTenantId(tenantId);

    const response = await this.service.getOutbox(request);

    return {
      globalVersion: response.getGlobalVersion(),
      low: response.getLow(),
      high: response.getHigh(),
    };
  }

  async createTenant(tenantId: string, name: string) {
    const request = new CreateTenantRequest();
    request.setTenantId(tenantId);
    request.setName(name);

    const response = await this.service.createTenant(request);

    return response.getTenantId();
  }

  async listTenants() {
    const request = new ListTenantsRequest();

    const response = await this.service.listTenants(request);

    return response.map(this.messageToTenant);
  }

  messageToTenant = (t: TenantMessage) =>
    new Tenant(t.getTenantId(), t.getName());
}

function createService(client: EventSourceServiceClient) {
  return {
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
}
