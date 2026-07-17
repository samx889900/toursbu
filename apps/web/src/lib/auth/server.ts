import { auth } from "./config";
import { headers } from "next/headers";

/**
 * Utility for getting the active session in Server Components and Route Handlers.
 */
export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
