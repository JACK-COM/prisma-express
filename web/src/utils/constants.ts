import manifest from "../../package.json";
import { UserRole } from "./types";

export * from "./constants.books";
export const APP_VERSION = manifest.version;
export const APP_VERSION_KEY = "app-version";
export const API_BASE = "http://localhost:4001";
export const AUTH_ROUTE = `${API_BASE}/authenticated`;
export const GRAPHQL_URL = `${API_BASE}/graphql`;
export const USER_ROLES: UserRole[] = ["Author", "Reader"];
