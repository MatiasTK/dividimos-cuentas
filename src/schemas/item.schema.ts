import { z } from 'zod';

export const itemSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'La descripción es requerida' })
    .max(50, { message: 'La descripción no puede superar los 50 caracteres' }),
});
