declare global {
  type globalParams = {
    route: string;
    params: {
      tenantId: string;
      outboxId: string;
    };
  };
  const globalParams: globalParams;
}

export {};
