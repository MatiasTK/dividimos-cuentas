import { EventContext } from '@context/EventContext';
import { EventContextProps } from '@types';
import { useContext } from 'react';

export const useEvent = (): EventContextProps => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
