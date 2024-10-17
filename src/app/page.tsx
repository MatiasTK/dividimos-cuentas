'use client';
import { Box, Heading, Stack, useBreakpointValue } from '@chakra-ui/react';
import { useState } from 'react';
import Home from './Home';
import { Event } from './types';
import AddAuthor from './AddAuthor';
import ShowEvent from './ShowEvent';
import { IoMdArrowBack } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'create' | 'owner' | 'show'>('create');
  const [event, setEvent] = useState<Event>({
    id: uuidv4(),
    name: '',
    description: '',
    date: new Date(),
    createdBy: null,
    items: [],
    people: [],
    debts: [],
  });

  const setEventInfo = (name: string, description: string, date: Date) => {
    setEvent({ ...event, name, description, date });
    setCurrentScreen('owner');
  };

  const setEventOwner = (name: string, email: string, cvu: string) => {
    setEvent({
      ...event,
      createdBy: { id: uuidv4(), name, email, cvu },
    });
    setCurrentScreen('show');
  };

  const renderEventScreen = () => {
    if (currentScreen === 'create') {
      return <Home onEventCreated={setEventInfo} />;
    }
    if (currentScreen === 'owner') {
      return <AddAuthor onOwnerSet={setEventOwner} />;
    }
    if (currentScreen === 'show') {
      return <ShowEvent event={event} setEvent={setEvent} />;
    }
  };

  const goHome = () => {
    setCurrentScreen('create');
    setEvent({
      id: uuidv4(),
      name: '',
      description: '',
      date: new Date(),
      createdBy: null,
      items: [],
      people: [],
      debts: [],
    });
  };

  const showBackButton =
    useBreakpointValue({ base: true, md: false }) && currentScreen !== 'create';

  return (
    <Box backgroundColor={'blackAlpha.900'} minHeight={'100vh'} p={4}>
      <Stack color={'white'} width={{ base: '100%', md: '33.33%' }} mx={'auto'}>
        <Box>
          <Box>
            {showBackButton && (
              <Box pb={4} onClick={goHome} cursor={'pointer'} w={'fit-content'}>
                <IoMdArrowBack size={24} />
              </Box>
            )}
            <Heading
              as={'h1'}
              pt={2}
              pb={2}
              ps={0}
              mb={4}
              size={'lg'}
              borderBottom={'1px solid'}
              borderColor={'whiteAlpha.300'}
              onClick={goHome}
              cursor={'pointer'}
            >
              Dividimos Cuentas
            </Heading>
            {currentScreen === 'create' && (
              <Heading as={'h2'} p={1} ps={0} size={'sm'} pb={8} color={'whiteAlpha.700'}>
                Divide tus cuentas con tus amigos de forma sencilla
              </Heading>
            )}
          </Box>
          <Box w={'full'}>{renderEventScreen()}</Box>
        </Box>
      </Stack>
    </Box>
  );
}
