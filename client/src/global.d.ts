declare global {
  type globalParams = {
    tenantId: string;
    outboxId: string;
  };
  const globalParams: globalParams;
}

export {};
