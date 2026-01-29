import React, { FC } from "react";

import { OutboxPage, OutboxPageRoute } from "./outbox";

export type Route = OutboxPageRoute;

export const Router: FC<{ route: Route }> = ({ route }) => {
  switch (route.route) {
    case "outbox":
      return <OutboxPage {...route.params} />;
    default:
      return null;
  }
};
