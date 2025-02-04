import { z } from 'zod';

const errorText = {
  user_id: 'User reference is required',
  order_id: 'Order reference is required',
  product_id: 'Product reference is required',
  shipping_address_id: 'Shipping address reference is required',
  totalAmount: 'Total amount is required',
  status: 'Status is required',
  quantity: 'Quantity is required',
  pricePerUnit: 'Price per unit is required',
  totalPrice: 'Total price is required',
  appliedDiscount: 'Applied discount is required',
};

export const ShopOrderSchemaCreate = z.object({
  user_id: z.string().nonempty(errorText.user_id),
  shipping_address_id: z.string().nonempty(errorText.shipping_address_id),
  totalAmount: z.number().nonnegative(errorText.totalAmount),
  status: z.string().nonempty(errorText.status),
});

export const ShopOrderSchemaUpdate = z.object({
  user_id: z.string().optional(),
  shipping_address_id: z.string().optional(),
  totalAmount: z.number().optional(),
  status: z.string().optional(),
});

export const ShopOrderDetailsSchemaCreate = z.object({
  order_id: z.string().nonempty(errorText.order_id),
  product_id: z.string().nonempty(errorText.product_id),
  quantity: z.number().nonnegative(errorText.quantity),
  pricePerUnit: z.number().nonnegative(errorText.pricePerUnit),
  totalPrice: z.number().nonnegative(errorText.totalPrice),
  appliedDiscount: z.number().nonnegative(errorText.appliedDiscount),
})

export const ShopOrderDetailsSchemaUpdate = z.object({
  order_id: z.string().optional(),
  product_id: z.string().optional(),
  quantity: z.number().optional(),
  pricePerUnit: z.number().optional(),
  totalPrice: z.number().optional(),
  appliedDiscount: z.number().optional(),
})