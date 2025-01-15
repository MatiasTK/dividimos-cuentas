import { Event } from './event';
import { Item } from './item';
import { Person } from './person';

export interface EventContextProps {
  events: Event[];
  currentEvent: Event;
  createEvent: (name: string, description: string, date: Date) => void;
  setEventOwner: (member: Person) => void;
  addMember: (member: Person) => void;
  editMember: (oldName: string, member: Person) => void;
  deleteMember: (member: Person) => void;
  addItem: (item: Item) => void;
  editItem: (originalItemId: string, item: Item) => void;
  deleteItem: (item: Item) => void;
  deleteSavedEvents: () => void;
  setCurrentEvent: (event: Event) => void;
}
