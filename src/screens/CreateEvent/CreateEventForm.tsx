import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventoSchema } from '@schemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CreateEventFormProps = {
  onSubmit: (values: z.infer<typeof EventoSchema>) => void;
};

export default function CreateEventForm({ onSubmit }: CreateEventFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof EventoSchema>>({
    resolver: zodResolver(EventoSchema),
  });

  return (
    <Box mt={10}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} my={4}>
          <FormControl isInvalid={!!errors.nombre} isRequired>
            <FormLabel htmlFor="nombre">Nombre del evento</FormLabel>
            <Input
              id="nombre"
              placeholder="Cumpleaños de Juan, cena con pareja..."
              {...register('nombre')}
            />
            <FormErrorMessage>
              {errors.nombre && (errors.nombre.message as string)}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.descripcion}>
            <FormLabel htmlFor="descripcion">Descripción</FormLabel>
            <Input
              id="descripcion"
              placeholder="Detalles del evento (opcional)"
              {...register('descripcion')}
            />
            <FormErrorMessage>
              {errors.descripcion && (errors.descripcion.message as string)}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.fecha} isRequired>
            <FormLabel htmlFor="fecha">Fecha</FormLabel>
            <Input
              id="fecha"
              type="date"
              {...register('fecha')}
              placeholder="Fecha del evento"
              defaultValue={new Date().toISOString().substring(0, 10)}
            />
            <FormErrorMessage>{errors.fecha && (errors.fecha.message as string)}</FormErrorMessage>
          </FormControl>
        </Stack>
        <Button mt={4} isLoading={isSubmitting} width={'full'} colorScheme="blue" type="submit">
          Crear evento
        </Button>
      </form>
    </Box>
  );
}
