import { useEvent } from '@hooks/useEvent';
import { EventoSchema } from '@schemas';
import * as z from 'zod';
import CreateEventForm from './CreateEventForm';
import CreateEventHeader from './CreateEventHeader';
import CreateEventPastEvents from './CreateEventPastEvents';

type CreateEventProps = {
  goNextScreen: () => void;
  selectCustomEvent: () => void;
};

export default function CreateEvent({ goNextScreen, selectCustomEvent }: CreateEventProps) {
  const { createEvent } = useEvent();

  function onSubmit(values: z.infer<typeof EventoSchema>) {
    createEvent(values.nombre, values.descripcion, values.fecha);
    goNextScreen();
  }

  return (
    <>
      <CreateEventHeader />
      <CreateEventForm onSubmit={onSubmit} />
      <CreateEventPastEvents selectCustomEvent={selectCustomEvent} />
    </>
  );
}
