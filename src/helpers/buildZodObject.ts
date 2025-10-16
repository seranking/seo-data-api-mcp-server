import { z } from "zod";

export const buildZodObject = (inputSchema: Record<string, any> | undefined) => {
    const shape = inputSchema ?? {};
    return z.object(shape as Record<string, z.ZodTypeAny>);
}