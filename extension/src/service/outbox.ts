import {
  CreateOutboxRequest,
  GetOutboxRequest,
} from "definitions_ts/src/generated/eventsource_pb";

import { service } from "./EventSourceService";

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
