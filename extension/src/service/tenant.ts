import {
  CreateTenantRequest,
  ListTenantsRequest,
  Tenant as TenantMessage,
} from "definitions_ts/src/generated/eventsource_pb";

import { Tenant } from "../domain/tenant";

import { service } from "./EventSourceService";

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

  return response.map(messageToTenant);
}

const messageToTenant = (t: TenantMessage) =>
  new Tenant(t.getTenantId(), t.getName());
