import { isDesktop } from "../platform";
import type { ApiClient } from "./apiClient";
import { desktopApiClient } from "./desktopApiClient";
import { webApiClient } from "./webApiClient";

const platformApiClient: ApiClient = isDesktop()
  ? desktopApiClient
  : webApiClient;

export const apiClient = {
  ...platformApiClient,
};

