import { z } from 'zod';

export const EventoSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .max(20, { message: 'El nombre no puede superar los 20 caracteres' }),
  descripcion: z
    .string()
    .max(200, { message: 'La descripción no puede superar los 200 caracteres' }),
  fecha: z.coerce.date(),
});
