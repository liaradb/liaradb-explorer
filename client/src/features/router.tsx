import React, { FC } from "react";

import { EventLogPage, EventLogPageRoute } from "./event_log";
import { OutboxPage, OutboxPageRoute } from "./outbox";

export type Route = EventLogPageRoute | OutboxPageRoute;

export const Router: FC<{ route: Route }> = ({ route }) => {
  switch (route.route) {
    case "eventlog":
      return <EventLogPage {...route.params} />;
    case "outbox":
      return <OutboxPage {...route.params} />;
    default:
      return null;
  }
};
