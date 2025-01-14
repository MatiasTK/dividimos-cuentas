import { z } from 'zod';

export const EqualSchema = z.object({
  type: z.literal('equal'),
});

export const FixedSchema = z.object({
  type: z.literal('fixed'),
  amount: z
    .number({
      message: 'La cantidad no puede estar vacia',
    })
    .int()
    .min(1, {
      message: 'La cantidad debe ser mayor a 0',
    }),
});

export const PercentageSchema = z.object({
  type: z.literal('percentage'),
  percentage: z
    .number({
      message: 'El porcentaje no puede estar vacio',
    })
    .min(1, {
      message: 'El porcentaje debe ser mayor a 0',
    })
    .max(100, {
      message: 'El porcentaje debe ser menor a 100',
    }),
});

export const splitMemberSchema = z.object({
  members: z.record(
    z.object({
      isPartOfSplit: z.boolean(),
      splitMethod: EqualSchema.or(FixedSchema).or(PercentageSchema),
    })
  ),
});
