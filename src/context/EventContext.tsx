import { Person } from '@/types/person';
import { Event } from '@/types/event';

import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '@types';

interface EventContextProps {
  events: Event[];
  currentEvent: Event;
  createEvent: (name: string, description: string, date: Date) => void;
  setEventOwner: (name: string, email: string | undefined, cvu: string | undefined) => void;
  addMember: (name: string, email: string | undefined, cvu: string | undefined) => void;
  addItem: (item: Item) => void;
  deleteSavedEvents: () => void;
  setCurrentEvent: (event: Event) => void;
  removeMember: (member: Person) => void;
}

interface EventProviderProps {
  children: React.ReactNode;
}

const EventContext = createContext<EventContextProps>({} as EventContextProps);

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    id: uuidv4(),
    name: '',
    description: '',
    date: new Date(),
    owner: { name: '', email: '', cvu: '' },
    items: [],
    members: [],
  });

  useEffect(() => {
    const events = localStorage.getItem('events');
    if (events) {
      console.info('[CONTEXT] Found events in local storage', JSON.parse(events));
      setEvents(JSON.parse(events));
    }
  }, []);

  function createEvent(name: string, description: string, date: Date) {
    setCurrentEvent((prevEvent) => {
      return {
        ...prevEvent,
        name,
        description,
        date,
      };
    });
  }

  function setEventOwner(name: string, email: string | undefined, cvu: string | undefined) {
    const ownerPerson = { name, email, cvu };
    const newCurrent = { ...currentEvent, members: [ownerPerson], owner: ownerPerson };
    updateCurrentEvent(newCurrent);
  }

  function addMember(name: string, email: string | undefined, cvu: string | undefined) {
    const newMembers = [...currentEvent.members, { name, email, cvu }];
    const newCurrent = { ...currentEvent, members: newMembers };

    updateCurrentEvent(newCurrent);
  }

  function removeMember(member: Person) {
    setCurrentEvent((prevEvent) => {
      return {
        ...prevEvent,
        members: prevEvent.members.filter((m) => m.name !== member.name),
      };
    });
  }

  function updateCurrentEvent(current: Event) {
    setCurrentEvent(current);
    const newEvents = [...events];

    const existingEventIndex = events.findIndex((e) => e.id === current.id);

    if (existingEventIndex !== -1) {
      newEvents[existingEventIndex] = current;
    } else {
      newEvents.push(current);
    }

    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
  }

  function addItem(item: Item) {
    const newEvent = {
      ...currentEvent,
      items: [
        ...currentEvent.items,
        {
          ...item,
          id: uuidv4(),
        },
      ],
    };

    updateCurrentEvent(newEvent);
  }

  function deleteSavedEvents() {
    setEvents([]);
    localStorage.removeItem('events');
  }

  return (
    <EventContext.Provider
      value={{
        events,
        currentEvent,
        createEvent,
        setEventOwner,
        setCurrentEvent,
        addMember,
        deleteSavedEvents,
        addItem,
        removeMember,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextProps => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
