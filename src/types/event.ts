import { Item } from './item';
import { Person } from './person';

export interface Event {
  id: string;
  name: string;
  description: string;
  items: Item[];
  members: Person[];
  date: Date;
  owner: Person;
}
