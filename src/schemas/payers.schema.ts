import { z } from 'zod';

export const payersSchema = z.object({
  members: z.array(
    z.object({
      amount: z
        .number({ message: 'La cantidad no puede estar vacia' })
        .int()
        .min(1, { message: 'La cantidad debe ser mayor a 0' }),
    })
  ),
});
