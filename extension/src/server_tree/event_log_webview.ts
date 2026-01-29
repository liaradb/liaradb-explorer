import { ExtensionContext } from "vscode";

import { Tenant } from "../domain";

import { Panel } from "./panel";

export class EventLogWebview extends Panel<{
  tenantId: string;
}> {
  constructor(
    context: ExtensionContext,
    private tenant: Tenant,
  ) {
    super(context);
  }

  init() {
    super.init({
      type: "eventLogWebview",
      title: "EventLog",
      route: "eventlog",
      params: {
        tenantId: this.tenant.getId(),
      },
    });
  }
}
