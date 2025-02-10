import { z } from "zod";

export const ShopCartSchemaUpdate = z.object({
  user_id: z.string().optional(),
  items:z.array(z.any()).optional()
});
