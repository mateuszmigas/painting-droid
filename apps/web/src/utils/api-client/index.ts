import { isWeb } from "../platform";
import type { ApiClient } from "./apiClient";
import { desktopApiClient } from "./desktopApiClient";
import { webApiClient } from "./webApiClient";

const platformApiClient: ApiClient = isWeb() ? webApiClient : desktopApiClient;

export const apiClient = {
  ...platformApiClient,
};

