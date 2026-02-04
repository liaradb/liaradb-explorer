import { ExtensionContext } from "vscode";

import { Outbox, Tenant } from "../domain";

import { Panel } from "./panel";

export class OutboxWebview extends Panel<{
  tenantId: string;
  outboxId: string;
}> {
  constructor(
    context: ExtensionContext,
    private tenant: Tenant,
    private outbox: Outbox,
  ) {
    super(context);
  }

  init() {
    super.init({
      type: "outboxWebview",
      title: this.getName(),
      icon: "checklist",
      route: "outbox",
      params: {
        tenantId: this.tenant.getId(),
        outboxId: this.outbox.getId(),
      },
    });
  }

  getName() {
    return this.outbox.getName();
  }
}
