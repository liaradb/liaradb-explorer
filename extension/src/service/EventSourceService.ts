"use server";

import { credentials } from "@grpc/grpc-js";

import { EventSourceServiceClient } from "../generated/eventsource_grpc_pb";
import {
  AppendEvent,
  AppendOptions,
  AppendRequest,
  CreateOutboxRequest,
  CreateTenantRequest,
  GetOutboxRequest,
  GetRequest,
  ListOutboxesRequest,
  ListTenantsRequest,
  Outbox as OutboxMessage,
  RenameTenantRequest,
  Tenant as TenantMessage,
} from "../generated/eventsource_pb";

import {
  serverStreamCallToPromise,
  unaryCallToPromise,
} from "./unaryCallToPromise";

import { Event, Outbox, Tenant } from "../domain";

import { Timestamp } from "./util";

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

  async append({
    events,
    correlationId,
    requestId,
    time,
    userId,
    partitionId,
    tenantId,
  }: {
    events: Event[];
    correlationId: string;
    requestId: string;
    time: Date;
    userId: string;
    partitionId: number;
    tenantId: string;
  }) {
    const request = new AppendRequest();

    request.setEventsList(events.map(this.createEvent));

    const options = new AppendOptions();
    options.setCorrelationId(correlationId);
    options.setRequestId(requestId);
    options.setTime(Timestamp.fromDate(time).toTimestamp());
    options.setUserId(userId);

    request.setOptions(options);
    request.setPartitionId(partitionId);
    request.setTenantId(tenantId);

    await this.service.append(request);
  }

  private createEvent({
    aggregateId,
    aggregateName,
    data,
    id,
    name,
    schema,
    version,
  }: Event) {
    const event = new AppendEvent();
    event.setAggregateId(aggregateId);
    event.setAggregateName(aggregateName);
    event.setData(data);
    event.setId(id);
    event.setName(name);
    event.setSchema(schema);
    event.setVersion(version);
    return event;
  }

  async createOutbox(tenantId: string, low: number, high: number) {
    const request = new CreateOutboxRequest();
    request.setTenantId(tenantId);
    request.setLow(low);
    request.setHigh(high);

    const response = await this.service.createOutbox(request);

    return response.getOutboxId();
  }

  async getAggregate(
    tenantId: string,
    partitionId: number,
    aggregateId: string,
  ) {
    const request = new GetRequest();
    request.setTenantId(tenantId);
    request.setPartitionId(partitionId);
    request.setAggregateId(aggregateId);

    const response = await this.service.get(request);

    return response.map((event) => event.toObject());
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

  async createTenant(name: string) {
    const request = new CreateTenantRequest();
    request.setName(name);

    const response = await this.service.createTenant(request);

    return response.getTenantId();
  }

  async renameTenant(tenantId: string, name: string) {
    const request = new RenameTenantRequest();
    request.setTenantId(tenantId);
    request.setName(name);

    await this.service.renameTenant(request);
  }

  async listOutboxes(tenantId: string) {
    const request = new ListOutboxesRequest();
    request.setTenantId(tenantId);

    const response = await this.service.listOutboxes(request);

    return response.map(this.messageToOutbox);
  }

  async listTenants() {
    const request = new ListTenantsRequest();

    const response = await this.service.listTenants(request);

    return response.map(this.messageToTenant);
  }

  messageToOutbox = (o: OutboxMessage) =>
    new Outbox(o.getOutboxId(), o.getGlobalVersion(), o.getLow(), o.getHigh());

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
    listOutboxes: serverStreamCallToPromise(client.listOutboxes.bind(client)),
    listTenants: serverStreamCallToPromise(client.listTenants.bind(client)),
    renameTenant: unaryCallToPromise(client.renameTenant.bind(client)),
    testIdempotency: unaryCallToPromise(client.testIdempotency.bind(client)),
    updateOutboxPosition: unaryCallToPromise(
      client.updateOutboxPosition.bind(client),
    ),
  };
}
