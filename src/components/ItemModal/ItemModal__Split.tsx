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
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import ItemModalStepper from './ItemModalStepper';
import { useEvent } from '@hooks/useEvent';
import { LuCircleHelp } from 'react-icons/lu';
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

  const onSubmit = (values: z.infer<typeof splitMemberSchema>) => {
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
            <LuCircleHelp size={20} />
          </Flex>
          <Stack mb={4} mt={4} spacing={4}>
            {currentEvent.members.map((member) => (
              <Flex
                key={member.name}
                backgroundColor={cardBgColor}
                p={2}
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
