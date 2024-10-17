'use client';

import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Divider,
  Box,
  AbsoluteCenter,
} from '@chakra-ui/react';
import { useState } from 'react';

type props = {
  onEventCreated: (name: string, description: string, date: Date) => void;
};

export default function Home({ onEventCreated }: props) {
  const [eventName, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isError, setIsError] = useState(false);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName === '') {
      setIsError(true);
      console.log('Event name is required');
      return;
    }
    onEventCreated(eventName, description, date);
  };

  return (
    <Stack gap={4}>
      <FormControl isRequired isInvalid={isError}>
        <FormLabel>Nombre del evento</FormLabel>
        <Input
          type="text"
          placeholder="Cumpleaños de Juan, Cena con pareja..."
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
          value={eventName}
        />
        <FormErrorMessage>El evento no puede estar vacío</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Descripción del evento</FormLabel>
        <Input
          type="text"
          placeholder="Detalles del evento (opcional)"
          colorScheme="whiteAlpha"
          borderColor={'whiteAlpha.300'}
          _placeholder={{
            color: 'whiteAlpha.400',
          }}
          _hover={{
            borderColor: 'whiteAlpha.400',
          }}
          focusBorderColor="whiteAlpha.400"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Fecha del evento</FormLabel>
        <Input
          type="date"
          colorScheme="dark"
          borderColor={'whiteAlpha.300'}
          _hover={{
            borderColor: 'whiteAlpha.400',
          }}
          focusBorderColor="whiteAlpha.400"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
      </FormControl>

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
        Crear evento
      </Button>
      <Box position="relative" paddingY={10}>
        <Divider borderColor={'whiteAlpha.300'} />
        <AbsoluteCenter
          px={2}
          fontSize={{
            base: 'sm',
            md: 'md',
          }}
          backgroundColor={'#141414'}
          color={'whiteAlpha.600'}
        >
          Eventos pasados
        </AbsoluteCenter>
      </Box>
    </Stack>
  );
}
