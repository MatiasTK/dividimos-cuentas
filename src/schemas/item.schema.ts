import { z } from 'zod';

export const itemSchema = z.object({
  description: z.string().min(3, { message: 'La descripción debe tener al menos 3 caracteres' }),
});
