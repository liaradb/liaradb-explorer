import React, { FC } from "react";

export type OutboxPageRoute = {
  route: "outbox";
  params: OutboxPageParams;
};

export type OutboxPageParams = {
  tenantId: string;
  outboxId: string;
};

export const OutboxPage: FC<OutboxPageParams> = () => {
  return <div>Outbox</div>;
};
