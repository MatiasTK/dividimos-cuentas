import { createContext } from 'react';
import { EventContextProps } from '@/types';

export const EventContext = createContext<EventContextProps>({} as EventContextProps);
