import api from "./apiClient";

// Tiny hook wrapper so components can use a stable API client via hook
export default function useApi() {
  return api;
}
