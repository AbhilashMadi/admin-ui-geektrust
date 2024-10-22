
import { z } from "zod"

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "memeber"])
})

export type User = z.infer<typeof userSchema>;