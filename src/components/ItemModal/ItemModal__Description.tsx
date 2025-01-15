import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ItemModalStepper from '@components/ItemModal/ItemModalStepper';
import { itemSchema } from '@schemas';
import { useEffect } from 'react';

type ItemModal__DescriptionProps = {
  onTabDone: (description: string) => void;
  itemInfo: {
    description: string;
  };
  isEditing?: boolean;
};

export default function ItemModal__Description({
  itemInfo,
  onTabDone,
  isEditing,
}: ItemModal__DescriptionProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { description: isEditing ? itemInfo.description : '' },
  });

  useEffect(() => {
    reset({ description: itemInfo.description });
  }, [itemInfo.description, reset]);

  function onSubmit(values: z.infer<typeof itemSchema>) {
    onTabDone(values.description);
  }

  return (
    <ModalContent>
      <ModalHeader>{isEditing ? 'Editar' : 'Agregar'} detalles</ModalHeader>
      <ModalCloseButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <ItemModalStepper activeStep={0} />
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel htmlFor="descripcion">Descripción</FormLabel>
              <Input
                type="text"
                {...register('description')}
                id={'descripcion'}
                placeholder="Pizza"
              />
              <FormErrorMessage>
                {errors.description && (errors.description.message as string)}
              </FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={isSubmitting} colorScheme="blue" mr={3} type="submit">
            Siguiente
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
