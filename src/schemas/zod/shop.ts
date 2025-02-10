import { z } from 'zod';

const errorText = {
  user_id: 'User ID is required.',
  items: 'Items are required.',
};

export const ShopCartSchemaCreate = z.object({
  user_id: z.string().nonempty(errorText.user_id),
  items: z.array(z.any())
});
