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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ItemModalStepper from '@components/ItemModal/ItemModalStepper';
import { itemSchema } from '@schemas';

type ItemModal__DescriptionProps = {
  onTabDone: (description: string) => void;
  itemInfo: {
    description: string;
  };
};

export default function ItemModal__Description({
  itemInfo,
  onTabDone,
}: ItemModal__DescriptionProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
  });

  function onSubmit(values: z.infer<typeof itemSchema>) {
    onTabDone(values.description);
  }

  return (
    <ModalContent>
      <ModalHeader>Agregar detalles</ModalHeader>
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
                defaultValue={itemInfo.description !== '' ? itemInfo.description : undefined}
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
