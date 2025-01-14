import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Text,
  AlertDialog,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
} from '@chakra-ui/react';
import { useEvent } from '@context/EventContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventoSchema } from '@schemas';
import { Event } from '@/types';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRef } from 'react';
import { LuCalendar } from 'react-icons/lu';

type CreateEventProps = {
  goNextScreen: () => void;
  selectCustomEvent: () => void;
};

export default function CreateEvent({ goNextScreen, selectCustomEvent }: CreateEventProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof EventoSchema>>({
    resolver: zodResolver(EventoSchema),
  });

  const { createEvent, events, setCurrentEvent, deleteSavedEvents } = useEvent();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  function onSubmit(values: z.infer<typeof EventoSchema>) {
    createEvent(values.nombre, values.descripcion, values.fecha);
    goNextScreen();
  }

  const handleSelectPreviousEvent = (event: Event) => {
    setCurrentEvent(event);
    selectCustomEvent();
  };

  const pastEventH3Color = useColorModeValue('blue.600', 'white');
  const h2Color = useColorModeValue('blackAlpha.600', 'gray');
  const dividerColor = useColorModeValue('gray.400', 'whiteAlpha.300');
  const dividerTextColor = useColorModeValue('gray.500', 'gray');
  const dividerTextBgColor = useColorModeValue('gray.50', '#141414');
  const pastEventDateColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.700');

  const handleDeleteSavedEvents = () => {
    deleteSavedEvents();
    onClose();
  };

  return (
    <>
      <Box mt={6} mb={4}>
        <Heading
          as={'h2'}
          size={'md'}
          color={h2Color}
          fontWeight={'semibold'}
          lineHeight={1.4}
          letterSpacing={'tight'}
          css={{
            textWrap: 'pretty',
          }}
        >
          Divide cuentas con amigos de forma sencilla
        </Heading>
      </Box>
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
              <FormErrorMessage>
                {errors.fecha && (errors.fecha.message as string)}
              </FormErrorMessage>
            </FormControl>
          </Stack>
          <Button mt={4} isLoading={isSubmitting} width={'full'} colorScheme="blue" type="submit">
            Crear evento
          </Button>
        </form>
      </Box>
      <Box position={'relative'} paddingY={10}>
        <Divider borderColor={dividerColor} />
        <AbsoluteCenter
          px={4}
          fontSize={'sm'}
          backgroundColor={dividerTextBgColor}
          color={dividerTextColor}
        >
          Eventos pasados
        </AbsoluteCenter>
      </Box>
      <Stack>
        {events &&
          events.map((event) => (
            <Button
              key={event.id}
              p={4}
              borderWidth={2}
              borderRadius={'md'}
              variant={'outline'}
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => handleSelectPreviousEvent(event)}
            >
              <Heading as={'h3'} letterSpacing={'tight'} size={'sm'} color={pastEventH3Color}>
                {event.name}
              </Heading>
              <Text
                fontSize={'sm'}
                color={pastEventDateColor}
                display={'flex'}
                alignItems={'center'}
                gap={1}
              >
                <LuCalendar size={16} />
                {new Date(event.date).toLocaleDateString()}
              </Text>
            </Button>
          ))}
        {events.length > 0 && (
          <Button size={'sm'} variant={'ghost'} colorScheme={'red'} mt={2} onClick={onOpen}>
            Borrar todos los eventos
          </Button>
        )}
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Borrar todos los eventos
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Estás seguro que deseas borrar todos los eventos? Esta acción no se puede deshacer.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} variant={'ghost'}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteSavedEvents}
                  ml={3}
                  bgColor={'red.500'}
                  color={'white'}
                  _hover={{
                    bgColor: 'red.600',
                  }}
                  _active={{
                    bgColor: 'red.700',
                  }}
                >
                  Borrar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    </>
  );
}
