import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPersonSchema } from '@schemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type AddOwnerFormProps = {
  onSubmit: (values: z.infer<ReturnType<typeof createPersonSchema>>) => void;
};

export default function AddOwnerForm({ onSubmit }: AddOwnerFormProps) {
  //* Note: I can use an empty array because the owner will be the first person to be added
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<ReturnType<typeof createPersonSchema>>>({
    resolver: zodResolver(createPersonSchema([])),
  });

  return (
    <Box mt={10}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} my={4}>
          <FormControl isInvalid={!!errors.nombre} isRequired>
            <FormLabel htmlFor="nombreAutor">Nombre</FormLabel>
            <Input id="nombreAutor" placeholder="Juan Perez" {...register('nombre')} />
            <FormErrorMessage>
              {errors.nombre && (errors.nombre.message as string)}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="juanperez@gmail.com (opcional)"
              {...register('email')}
            />
            <FormErrorMessage>{errors.email && (errors.email.message as string)}</FormErrorMessage>
            <FormHelperText>Se usará para enviar a cada persona sus cuentas</FormHelperText>
          </FormControl>

          <FormControl isInvalid={!!errors.CVU}>
            <FormLabel htmlFor="CVU">CVU</FormLabel>
            <Input
              id="CVU"
              type="number"
              pattern="\d{0,22}"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.slice(0, 22);
              }}
              {...register('CVU')}
              placeholder="0000003100011037783004 (opcional)"
            />
            <FormErrorMessage>{errors.CVU && (errors.CVU.message as string)}</FormErrorMessage>
            <FormHelperText>Se usará para indicar a los demás donde pagar su deuda</FormHelperText>
          </FormControl>
        </Stack>
        <Button mt={4} isLoading={isSubmitting} width={'full'} colorScheme="blue" type="submit">
          Continuar
        </Button>
      </form>
    </Box>
  );
}
