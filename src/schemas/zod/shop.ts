import { z } from 'zod';

const errorText = {
  slug: 'Slug cannot be empty',
  name: 'Name cannot be empty',
  description: 'Description cannot be empty',
  price: 'Price must be a non-negative number',
  stock: 'Stock must be a non-negative number',
};

export const ProductSchemaCreate = z.object({
  category_id: z.array(z.string()).nonempty(),
  product_type: z.enum(['physical', 'digital']),
  is_active: z.boolean(),
  slug: z.string().nonempty(errorText.slug),
  name: z.string().nonempty(errorText.name),
  description: z.string().nonempty(errorText.description),
  price: z.number().nonnegative(errorText.price),
  stock: z.number().nonnegative(errorText.stock),
  coverImage: z.string().optional(),
  files: z.array(z.string()).optional(),
  metadata: z.object({}).optional(),
});

export const DiscountSchemaCreate = z.object({
  product_id: z.array(z.string()).nonempty(),
  name: z.string().nonempty(errorText.name),
  usageLimit: z.number().nonnegative(),
  discountCode: z.string().nonempty(),
  discountPercentage: z.number().min(0).max(100),
  startDate: z.string().nonempty(), 
  endDate: z.string().nonempty(),
});
