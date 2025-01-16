import { CreateToastFnReturn } from '@chakra-ui/react';
import { splitMemberSchema } from '@schemas';
import { z } from 'zod';

export default function validateSplit(
  members: [string, z.infer<typeof splitMemberSchema>['members'][string]][],
  total: number,
  toast: CreateToastFnReturn
): boolean {
  const percentageMembers = members.filter(
    ([, member]) => member.splitMethod.type === 'percentage'
  );
  const totalPercentage = percentageMembers.reduce(
    (acc, [, member]) =>
      acc + (member.splitMethod as { type: 'percentage'; percentage: number }).percentage,
    0
  );

  if (percentageMembers.length === members.length) {
    // Todos los miembros tienen un porcentaje

    if (totalPercentage === 100) {
      // Todos los porcentajes suman 100
      return true;
    } else if (totalPercentage > 100) {
      // Los porcentajes suman más de 100
      toast({
        title: 'Ocurrió un error',
        description: `Demasiadas contribuciones, los porcentajes deben sumar 100. Actual: ${totalPercentage}%`,
        status: 'error',
      });
      return false;
    } else {
      // Los porcentajes suman menos de 100
      toast({
        title: 'Ocurrió un error',
        description: `Faltan contribuciones, los porcentajes deben sumar 100. Actual: ${totalPercentage}%`,
        status: 'error',
      });
      return false;
    }
  } else if (percentageMembers.length > 0 && totalPercentage > 100) {
    // La suma de los miembros (no totales) con porcentaje es mayor a 100
    toast({
      title: 'Ocurrió un error',
      description: `Demasiadas contribuciones, los porcentajes deben sumar 100. Actual: ${totalPercentage}%`,
      status: 'error',
    });
    return false;
  }

  // Check fixed
  const fixedMembers = members.filter(([, member]) => member.splitMethod.type === 'fixed');
  const totalFixed = fixedMembers.reduce(
    (acc, [, member]) => acc + (member.splitMethod as { type: 'fixed'; amount: number }).amount,
    0
  );

  if (fixedMembers.length === members.length) {
    // Todos los miembros tienen un monto fijo

    if (totalFixed === total) {
      // Todos los montos fijos suman el total
      return true;
    } else if (totalFixed > total) {
      // Los montos fijos suman más de total
      toast({
        title: 'Ocurrió un error',
        description: `Demasiadas contribuciones, la suma de los montos fijos debe ser ${total}. Actual: ${totalFixed}`,
        status: 'error',
      });
      return false;
    } else {
      // Los montos fijos suman menos de total
      toast({
        title: 'Ocurrió un error',
        description: `Faltan contribuciones, la suma de los montos fijos debe ser ${total}. Actual: ${totalFixed}`,
        status: 'error',
      });
      return false;
    }
  } else if (fixedMembers.length > 0 && totalFixed > total) {
    // La suma de los miembros (no totales) con monto fijo es mayor al total
    toast({
      title: 'Ocurrió un error',
      description: `Demasiadas contribuciones, la suma de los montos fijos debe ser ${total}`,
      status: 'error',
    });
    return false;
  }

  // Mezcla de porcentajes y montos fijos
  if (fixedMembers.length > 0 && percentageMembers.length > 0) {
    const totalReached = (totalPercentage / 100) * total + totalFixed;

    if (totalReached === total) {
      return true;
    } else if (totalReached > total) {
      // La suma de los montos fijos con porcentajes es mayor al total
      toast({
        title: 'Ocurrió un error',
        description: `Demasiadas contribuciones, la suma de los montos fijos con porcentajes debe ser ${total}. Actual: ${totalReached}`,
        status: 'error',
      });
      return false;
    } else {
      // La suma de los montos fijos con porcentajes es menor al total
      toast({
        title: 'Ocurrió un error',
        description: `Faltan contribuciones, la suma de los montos fijos con porcentajes debe ser ${total}. Actual: ${totalReached}`,
        status: 'error',
      });
      return false;
    }
  }

  return true;
}
