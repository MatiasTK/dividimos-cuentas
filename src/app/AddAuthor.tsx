'use client';

import {
  FormControl,
  Heading,
  Stack,
  Input,
  FormLabel,
  FormErrorMessage,
  Text,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

type props = {
  onOwnerSet: (name: string, email: string, cvu: string) => void;
};

export default function AddAuthor({ onOwnerSet }: props) {
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    cvu: false,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cvu, setCvu] = useState('');

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors({ ...errors, name: false });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: false });
  };

  const handleChangeCvu = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvu(e.target.value);
    setErrors({ ...errors, cvu: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name === '') {
      setErrors({ ...errors, name: true });
      return;
    }
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === null && email !== '') {
      setErrors({ ...errors, email: true });
      return;
    }
    if (cvu.match(/^[0-9]{22}$/) === null && cvu !== '') {
      setErrors({ ...errors, cvu: true });
      return;
    }

    onOwnerSet(name, email, cvu);
  };

  return (
    <Stack>
      <Heading as={'h2'} p={1} size={'sm'} pb={6} pt={4} color={'whiteAlpha.700'}>
        Ingresa tus datos antes de continuar
      </Heading>
      <Stack w={'full'} gap={4}>
        <FormControl isRequired isInvalid={errors.name}>
          <FormLabel>Nombre</FormLabel>
          <Input
            type="text"
            placeholder="Juan Perez"
            colorScheme="whiteAlpha"
            borderColor={'whiteAlpha.300'}
            _hover={{
              borderColor: 'whiteAlpha.400',
            }}
            _placeholder={{
              color: 'whiteAlpha.400',
            }}
            focusBorderColor="whiteAlpha.400"
            onChange={handleChangeName}
          />
          <FormErrorMessage>El nombre es requerido</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="juanperez@gmail.com (opcional)"
            colorScheme="whiteAlpha"
            borderColor={'whiteAlpha.300'}
            _hover={{
              borderColor: 'whiteAlpha.400',
            }}
            _placeholder={{
              color: 'whiteAlpha.400',
            }}
            focusBorderColor="whiteAlpha.400"
            onChange={handleChangeEmail}
          />
          <FormErrorMessage>El formato del email es inválido</FormErrorMessage>
          <Text fontSize={'sm'} color={'whiteAlpha.500'} pt={1}>
            Se usará para enviar a cada persona sus cuentas
          </Text>
        </FormControl>

        <FormControl isInvalid={errors.cvu}>
          <FormLabel>CVU</FormLabel>
          <Input
            type="number"
            placeholder="12345678901234567890 (opcional)"
            colorScheme="whiteAlpha"
            borderColor={'whiteAlpha.300'}
            _hover={{
              borderColor: 'whiteAlpha.400',
            }}
            _placeholder={{
              color: 'whiteAlpha.400',
            }}
            focusBorderColor="whiteAlpha.400"
            onChange={handleChangeCvu}
          />
          <FormErrorMessage>El formato del CVU es inválido</FormErrorMessage>
          <Text fontSize={'sm'} color={'whiteAlpha.500'} pt={1}>
            Se usará para informar a cada persona de su deuda
          </Text>
        </FormControl>
      </Stack>

      <Button
        type="submit"
        w={'full'}
        colorScheme="whiteAlpha"
        backgroundColor={'whiteAlpha.100'}
        _hover={{
          backgroundColor: 'whiteAlpha.200',
        }}
        _active={{
          backgroundColor: 'whiteAlpha.300',
        }}
        mt={4}
        onClick={handleSubmit}
      >
        Continuar
      </Button>
    </Stack>
  );
}
