import {
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Stack,
  Text,
  Button,
  FormControl,
  ModalFooter,
  Checkbox,
  Input,
  SimpleGrid,
  FormErrorMessage,
  useColorModeValue,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import ItemModalStepper from './ItemModalStepper';
import { useEvent } from '@hooks/useEvent';
import { LuCircleHelp, LuDollarSign, LuEqual, LuPercent } from 'react-icons/lu';
import { SplitMember } from '@/types/splitMember';
import { Item } from '@types';
import RadioGroup from '@components/RadioGroup';
import { splitMemberSchema } from '@schemas';

//? Typescript uses wrong type for errors, this is a workaround
type SplitMethodError = {
  splitMethod?: {
    type?: { message?: string };
    amount?: { message?: string };
    percentage?: { message?: string };
  };
};

type ItemModal__SplitProps = {
  goBack: () => void;
  itemInfo: Item;
  setSplitMembers: (members: SplitMember[]) => void;
  isEditing?: boolean;
};

export default function ItemModal__Split({
  goBack,
  itemInfo,
  setSplitMembers,
  isEditing,
}: ItemModal__SplitProps) {
  const toast = useToast();
  const { currentEvent } = useEvent();

  const {
    control,
    handleSubmit,
    register,
    resetField,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(splitMemberSchema),
    defaultValues: {
      members:
        itemInfo.splitBetween.length > 0
          ? itemInfo.splitBetween.reduce<z.infer<typeof splitMemberSchema>['members']>(
              (acc, member) => {
                acc[member.name] = {
                  isPartOfSplit: true,
                  splitMethod: member.splitMethod,
                };
                return acc;
              },
              {}
            )
          : currentEvent.members.reduce<z.infer<typeof splitMemberSchema>['members']>(
              (acc, member) => {
                acc[member.name] = {
                  isPartOfSplit: true,
                  splitMethod: { type: 'equal' },
                };
                return acc;
              },
              {}
            ),
    },
  });

  const validateSplit = (
    members: [string, z.infer<typeof splitMemberSchema>['members'][string]][],
    total: number
  ) => {
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
  };

  const onSubmit = (values: z.infer<typeof splitMemberSchema>) => {
    if (
      !validateSplit(
        Object.entries(values.members),
        itemInfo.paidBy.reduce((acc, member) => acc + member.amount, 0)
      )
    ) {
      return;
    }

    const splitMembers = Object.entries(values.members)
      .filter(([, member]) => member.isPartOfSplit)
      .map(([name, member]) => {
        const originalMember = currentEvent.members.find((m) => m.name === name);
        return {
          name,
          email: originalMember?.email || '',
          cvu: originalMember?.cvu || '',
          splitMethod: member.splitMethod,
        };
      });

    setSplitMembers(splitMembers);
  };

  const handleChangeRadio = (memberName: string, value: string) => {
    resetField(`members.${memberName}.splitMethod.amount`);
    resetField(`members.${memberName}.splitMethod.percentage`);
    switch (value) {
      case 'equal':
        return { type: 'equal' };
      case 'fixed':
        return { type: 'fixed' };
      case 'percentage':
        return { type: 'percentage' };
    }
  };

  const renderSplitMethodInput = (memberName: string) => {
    const current = watch(`members.${memberName}.splitMethod`);
    if (!current) return null;

    if (current.type === 'fixed') {
      return (
        <Input
          {...register(`members.${memberName}.splitMethod.amount`, {
            valueAsNumber: true,
          })}
          type="number"
          placeholder="0"
        />
      );
    }

    if (current.type === 'percentage') {
      return (
        <Input
          {...register(`members.${memberName}.splitMethod.percentage`, {
            valueAsNumber: true,
          })}
          type="number"
          placeholder="0"
        />
      );
    }
  };

  const renderInputerrors = (memberName: string) => {
    const splitMethodError = errors.members?.[memberName] as SplitMethodError;

    if (splitMethodError) {
      return (
        <FormErrorMessage>
          {splitMethodError.splitMethod?.amount?.message ||
            splitMethodError.splitMethod?.percentage?.message}
        </FormErrorMessage>
      );
    }
  };

  const handleShowHelpToast = () => {
    toast({
      title: 'Dividir entre',
      status: 'info',
      render: () => (
        <Stack color={'white'} fontSize={'sm'} gap={2}>
          <Flex
            alignItems={'center'}
            gap={2}
            borderRadius={'lg'}
            mb={1}
            py={2}
            px={4}
            bgColor={'blue.500'}
          >
            <LuEqual size={20} /> <Text>Divide el monto de manera equitativa</Text>
          </Flex>
          <Flex
            alignItems={'center'}
            gap={2}
            borderRadius={'lg'}
            mb={1}
            py={2}
            px={4}
            bgColor={'blue.500'}
          >
            <LuPercent size={20} />
            <Text>Divide el monto en un porcentaje del total</Text>
          </Flex>
          <Flex
            alignItems={'center'}
            gap={2}
            borderRadius={'lg'}
            py={2}
            px={4}
            bgColor={'blue.500'}
          >
            <LuDollarSign size={20} />
            <Text>Divide el monto en una cantidad fija</Text>
          </Flex>
        </Stack>
      ),
    });
  };

  const cardBgColor = useColorModeValue('gray.100', 'whiteAlpha.200');
  const footerBackBtnColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');

  return (
    <ModalContent>
      <ModalHeader>{isEditing ? 'Editar' : 'Agregar'} división</ModalHeader>
      <ModalCloseButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <ItemModalStepper activeStep={2} />
          <Flex alignItems={'center'} gap={2}>
            <Text>Dividido entre</Text>
            <IconButton
              aria-label="help"
              variant={'ghost'}
              icon={<LuCircleHelp size={20} />}
              onClick={handleShowHelpToast}
            />
          </Flex>
          <Stack my={4} spacing={4}>
            {currentEvent.members.map((member) => (
              <Flex
                key={member.name}
                backgroundColor={cardBgColor}
                px={4}
                py={2}
                justifyContent={'space-between'}
                borderRadius={8}
                alignItems={'center'}
              >
                <Checkbox {...register(`members.${member.name}.isPartOfSplit`)} type="checkbox">
                  {member.name}
                </Checkbox>
                <FormControl
                  key={member.name}
                  isInvalid={!!errors.members?.[member.name]}
                  w={'fit-content'}
                >
                  <SimpleGrid gap={2} w={'min-content'}>
                    <Controller
                      name={`members.${member.name}.splitMethod`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <RadioGroup
                          value={value}
                          onChange={(value) => onChange(handleChangeRadio(member.name, value))}
                          name={member.name}
                        />
                      )}
                    ></Controller>
                    {renderSplitMethodInput(member.name)}
                  </SimpleGrid>
                  {renderInputerrors(member.name)}
                </FormControl>
              </Flex>
            ))}
            <Text mt={4}>
              Se necesitan pagar: ${itemInfo.paidBy.reduce((acc, member) => acc + member.amount, 0)}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={goBack} color={footerBackBtnColor}>
            Atras
          </Button>
          <Button isLoading={isSubmitting} colorScheme="blue" mr={3} type="submit">
            {isEditing ? 'Modificar' : 'Agregar'}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
