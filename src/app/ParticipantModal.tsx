'use client';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';

type props = {
  isOpen: boolean;
  onClose: () => void;
  addParticipant: (participant: { name: string; email: string; cvu: string }) => void;
};

export default function ParticipantModal({
  isOpen,
  onClose,
  addParticipant,
}: props) {
  const [currentParticipantName, setCurrentParticipantName] = useState('');
  const [currentParticipantEmail, setCurrentParticipantEmail] = useState('');
  const [currentParticipantCvu, setCurrentParticipantCvu] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    cvu: false,
  });

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentParticipantName(e.target.value);
    setErrors({ ...errors, name: false });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentParticipantEmail(e.target.value);
    setErrors({ ...errors, email: false });
  };

  const handleChangeCvu = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentParticipantCvu(e.target.value);
    setErrors({ ...errors, cvu: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentParticipantName === '') {
      setErrors({ ...errors, name: true });
      return;
    }
    if (
      currentParticipantEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === null &&
      currentParticipantEmail !== ''
    ) {
      setErrors({ ...errors, email: true });
      return;
    }
    if (currentParticipantCvu.match(/^[0-9]{22}$/) === null && currentParticipantCvu !== '') {
      setErrors({ ...errors, cvu: true });
      return;
    }

    addParticipant({
      name: currentParticipantName,
      email: currentParticipantEmail,
      cvu: currentParticipantCvu,
    });
    setCurrentParticipantName('');
    setCurrentParticipantEmail('');
    setCurrentParticipantCvu('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{
        base: 'full',
        md: 'xl',
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent color={'white'} background={'#222222'}>
        <ModalHeader>Agregar participante</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={4}>
            <FormControl isRequired isInvalid={errors.name}>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                value={currentParticipantName}
                colorScheme="blackAlpha"
                borderColor={'whiteAlpha.300'}
                placeholder="Juan Perez"
                _placeholder={{
                  color: 'whiteAlpha.600',
                }}
                _hover={{
                  borderColor: 'whiteAlpha.600',
                }}
                focusBorderColor="whiteAlpha.600"
                onChange={handleChangeName}
              />
              <FormErrorMessage>Nombre inválido</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={currentParticipantEmail}
                colorScheme="blackAlpha"
                borderColor={'whiteAlpha.300'}
                placeholder="juanperez@gmail.com (opcional)"
                _placeholder={{
                  color: 'whiteAlpha.600',
                }}
                _hover={{
                  borderColor: 'whiteAlpha.600',
                }}
                focusBorderColor="whiteAlpha.600"
                onChange={handleChangeEmail}
              />
              <FormErrorMessage>Email inválido</FormErrorMessage>
              <FormHelperText fontSize={'sm'} color={'whiteAlpha.300'}>
                Se usará para enviar a cada persona sus cuentas
              </FormHelperText>
            </FormControl>

            <FormControl isInvalid={errors.cvu}>
              <FormLabel>CVU</FormLabel>
              <Input
                type="text"
                value={currentParticipantCvu}
                onChange={handleChangeCvu}
                placeholder="1234567890123456789012 (opcional)"
                colorScheme="blackAlpha"
                borderColor={'whiteAlpha.300'}
                _placeholder={{
                  color: 'whiteAlpha.600',
                }}
                _hover={{
                  borderColor: 'whiteAlpha.600',
                }}
                focusBorderColor="whiteAlpha.600"
              />
              <FormErrorMessage>CVU inválido</FormErrorMessage>
              <FormHelperText fontSize={'sm'} color={'whiteAlpha.300'}>
                Se usará para informar de los pagos a cada persona
              </FormHelperText>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant={'ghost'}
            colorScheme="whiteAlpha"
            color={'whiteAlpha.700'}
            _hover={{
              color: 'whiteAlpha.800',
            }}
            _active={{
              color: 'whiteAlpha.800',
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="whiteAlpha"
            backgroundColor={'whiteAlpha.100'}
            _hover={{
              backgroundColor: 'whiteAlpha.200',
            }}
            _active={{
              backgroundColor: 'whiteAlpha.300',
            }}
            mr={3}
            onClick={handleSubmit}
          >
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
