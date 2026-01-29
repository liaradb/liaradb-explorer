import { Route } from "./features";

declare global {
  type globalParams = Route;
  const globalParams: globalParams;
}

export {};
