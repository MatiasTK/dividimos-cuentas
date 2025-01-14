import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useEvent } from '@context/EventContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPersonSchema } from '@schemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type MemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MemberModal({ isOpen, onClose }: MemberModalProps) {
  const { addMember, currentEvent } = useEvent();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<ReturnType<typeof createPersonSchema>>>({
    resolver: zodResolver(createPersonSchema(currentEvent.members)),
  });

  const onSubmit = (values: z.infer<ReturnType<typeof createPersonSchema>>) => {
    addMember(values.nombre, values.email, values.CVU);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={{
        base: 'sm',
        md: 'md',
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar miembro</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack spacing={4}>
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
                <FormErrorMessage>
                  {errors.email && (errors.email.message as string)}
                </FormErrorMessage>
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
                <FormHelperText>
                  Se usará para indicar a los demas donde pagar su deuda
                </FormHelperText>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button isLoading={isSubmitting} colorScheme="blue" type="submit" w="full">
              Agregar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
