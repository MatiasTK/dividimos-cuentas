import { Event } from '@/types/event';
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import DeleteDialog from '@components/DeleteDialog';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import { LuCalendar } from 'react-icons/lu';

type createEventPastEventsProps = {
  selectCustomEvent: () => void;
};

export default function CreateEventPastEvents({ selectCustomEvent }: createEventPastEventsProps) {
  const { events, deleteSavedEvents, setCurrentEvent } = useEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    dividerColor,
    dividerTextColor,
    dividerTextBgColor,
    pastEventDateColor,
    pastEventH3Color,
  } = useCustomColor();

  const handleDeleteSavedEvents = () => {
    deleteSavedEvents();
    onClose();
  };

  const handleSelectPreviousEvent = (event: Event) => {
    setCurrentEvent(event);
    selectCustomEvent();
  };

  return (
    <>
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
        <DeleteDialog
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleDeleteSavedEvents}
          title="Borrar todos los eventos"
        >
          ¿Estás seguro que deseas borrar todos los eventos? Esta acción no se puede deshacer.
        </DeleteDialog>
      </Stack>
    </>
  );
}
