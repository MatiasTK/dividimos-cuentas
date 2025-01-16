import { useEvent } from '@hooks/useEvent';
import { createPersonSchema } from '@schemas';
import { Person } from '@types';
import * as z from 'zod';
import AddOwnerForm from './AddOwnerForm';
import AddOwnerHeader from './AddOwnerHeader';

type AddOwnerProps = {
  goNextScreen: () => void;
};

export default function AddOwner({ goNextScreen }: AddOwnerProps) {
  const { setEventOwner } = useEvent();

  function onSubmit(values: z.infer<ReturnType<typeof createPersonSchema>>) {
    const member: Person = {
      name: values.nombre,
      email: values.email,
      cvu: values.CVU,
    };
    setEventOwner(member);
    goNextScreen();
  }

  return (
    <>
      <AddOwnerHeader />
      <AddOwnerForm onSubmit={onSubmit} />
    </>
  );
}
