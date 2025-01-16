import { Person } from '@types';
import { z } from 'zod';

export const createPersonSchema = (existingMembers: Person[]) =>
  z.object({
    nombre: z
      .string()
      .min(1, { message: 'El nombre es requerido' })
      .refine(
        (currentName) =>
          !existingMembers.some(
            (member) => member.name.toLowerCase() === currentName.toLowerCase()
          ),
        {
          message: 'Ya existe un miembro con ese nombre',
        }
      ),
    email: z
      .string()
      .email({ message: 'El mail indicado no tiene un formato válido' })
      .or(z.literal(''))
      .optional(),
    CVU: z
      .string()
      .length(22, { message: 'Formato de CVU inválido, debe contener 22 caracteres' })
      .or(z.literal(''))
      .optional(),
  });
