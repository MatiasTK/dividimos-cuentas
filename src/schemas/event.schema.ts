import { z } from 'zod';

export const EventoSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre no puede superar los 50 caracteres' }),
  descripcion: z
    .string()
    .max(200, { message: 'La descripción no puede superar los 200 caracteres' }),
  fecha: z.coerce.date(),
});
