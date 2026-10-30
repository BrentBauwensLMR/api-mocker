import type { Response } from "@/types/response.js";

export interface RouteInterface {
    resolve: () => Response
    matches: (method: string, path: string) => boolean
    setResponse: (response: Response) => void
}
