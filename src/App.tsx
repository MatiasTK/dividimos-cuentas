import { Screen } from '@/types/screens';
import '@App.css';
import { Box, Container, Flex } from '@chakra-ui/react';
import Footer from '@components/Footer';
import Header from '@components/Header';
import { EventProvider } from '@providers/EventProvider';
import AddOwner from '@screens/AddOwner';
import CreateEvent from '@screens/CreateEvent';
import EventDetails from '@screens/EventDetails';
import { useState } from 'react';

function App() {
  const [currentScreen, setCurrentScreen] = useState(Screen.CREATE_EVENT);

  function goHome() {
    setCurrentScreen(Screen.CREATE_EVENT);
  }

  function selectCustomEvent() {
    setCurrentScreen(Screen.EVENT_DETAILS);
  }

  function renderCurrentScreen() {
    switch (currentScreen) {
      case Screen.CREATE_EVENT:
        return (
          <CreateEvent
            goNextScreen={() => setCurrentScreen(Screen.ADD_OWNER)}
            selectCustomEvent={selectCustomEvent}
          />
        );
      case Screen.ADD_OWNER:
        return <AddOwner goNextScreen={() => setCurrentScreen(Screen.EVENT_DETAILS)} />;
      case Screen.EVENT_DETAILS:
        return <EventDetails />;
      default:
        return (
          <CreateEvent
            goNextScreen={() => setCurrentScreen(Screen.ADD_OWNER)}
            selectCustomEvent={selectCustomEvent}
          />
        );
    }
  }

  return (
    <Container>
      <Flex direction="column" minHeight="105dvh">
        <Header
          showBackButton={currentScreen !== Screen.CREATE_EVENT}
          goBackScreen={() => setCurrentScreen(Screen.CREATE_EVENT)}
          goHome={goHome}
        />
        <EventProvider>
          <Box flex="1">{renderCurrentScreen()}</Box>
        </EventProvider>
        <Footer />
      </Flex>
    </Container>
  );
}

export default App;
