import React, { FC, useState } from "react";

export type EventLogPageRoute = {
  route: "eventlog";
  params: EventLogPageParams;
};

export type EventLogPageParams = {
  tenantId: string;
};

export const EventLogPage: FC<EventLogPageParams> = (params) => {
  return (
    <div>
      <h1>Event Log</h1>
    </div>
  );
};
