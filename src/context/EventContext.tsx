import { Person } from '@/types/person';
import { Event } from '@/types/event';

import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '@types';

interface EventContextProps {
  events: Event[];
  currentEvent: Event;
  createEvent: (name: string, description: string, date: Date) => void;
  setEventOwner: (member: Person) => void;
  addMember: (member: Person) => void;
  editMember: (oldName: string, member: Person) => void;
  deleteMember: (member: Person) => void;
  addItem: (item: Item) => void;
  deleteSavedEvents: () => void;
  setCurrentEvent: (event: Event) => void;
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

  function setEventOwner(member: Person) {
    const newCurrent = { ...currentEvent, members: [member], owner: member };
    updateCurrentEvent(newCurrent);
  }

  function addMember(member: Person) {
    const newCurrent = { ...currentEvent, members: [...currentEvent.members, member] };
    updateCurrentEvent(newCurrent);
  }

  function editMember(oldName: string, editedMember: Person) {
    const newMembers = currentEvent.members.map((m) => {
      if (m.name === oldName) {
        return editedMember;
      }
      return m;
    });

    const newItemMembers = currentEvent.items.map((item) => {
      return {
        ...item,
        paidBy: item.paidBy.map((payer) => {
          if (payer.name === oldName) {
            return { ...editedMember, amount: payer.amount };
          }
          return payer;
        }),
        splitBetween: item.splitBetween.map((member) => {
          if (member.name === oldName) {
            return { ...editedMember, splitMethod: member.splitMethod };
          }
          return member;
        }),
      };
    });

    const newCurrent = { ...currentEvent, members: newMembers, items: newItemMembers };

    updateCurrentEvent(newCurrent);
  }

  function deleteMember(member: Person) {
    const newMembers = currentEvent.members.filter((m) => m.name !== member.name);

    const newItems = currentEvent.items.map((item) => {
      return {
        ...item,
        paidBy: item.paidBy.filter((p) => p.name !== member.name),
        splitBetween: item.splitBetween.filter((s) => s.name !== member.name),
      };
    });

    const newCurrent = { ...currentEvent, members: newMembers, items: newItems };

    updateCurrentEvent(newCurrent);
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
        editMember,
        deleteMember,
        deleteSavedEvents,
        addItem,
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
