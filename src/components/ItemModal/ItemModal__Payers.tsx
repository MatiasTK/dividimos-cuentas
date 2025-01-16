import { Item, Payer } from '@/types';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import ItemModalStepper from '@components/ItemModal/ItemModalStepper';
import { zodResolver } from '@hookform/resolvers/zod';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import { payersSchema } from '@schemas';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuChevronDown, LuDollarSign, LuTrash } from 'react-icons/lu';
import * as z from 'zod';

type ItemModal__DescriptionProps = {
  goBack: () => void;
  itemInfo: Item;
  setPayers: (members: Payer[]) => void;
  isEditing?: boolean;
};

export default function ItemModal__Payers({
  goBack,
  itemInfo,
  setPayers,
  isEditing,
}: ItemModal__DescriptionProps) {
  const { currentEvent } = useEvent();
  const [selectedMembers, setSelectedMembers] = useState(itemInfo.paidBy);

  const toast = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<z.infer<typeof payersSchema>>({
    resolver: zodResolver(payersSchema),
    defaultValues: {
      members: itemInfo.paidBy.length > 0 ? itemInfo.paidBy : [],
    },
  });

  function handleRemoveMember(member: Payer) {
    const memberIndex = selectedMembers.findIndex((m) => m.name === member.name);

    const newMembers = [...selectedMembers];
    newMembers.splice(memberIndex, 1);

    setValue(
      'members',
      newMembers.map((m) => ({ amount: m.amount })),
      {
        shouldValidate: false,
      }
    );

    setSelectedMembers(newMembers);
  }

  const watchedMembers = watch('members', itemInfo.paidBy);

  const onSubmit = (values: z.infer<typeof payersSchema>) => {
    if (selectedMembers.length === 0) {
      toast({
        title: 'Ocurrió un error',
        description: 'Debes agregar al menos un miembro',
        status: 'error',
      });
      return;
    }

    const newPayers = selectedMembers.map((member, index) => ({
      ...member,
      amount: values.members[index].amount,
    }));

    setPayers(newPayers);
  };

  const { menuItemColor, cardBgColor, footerBackBtnColor } = useCustomColor();

  return (
    <ModalContent>
      <ModalHeader>{isEditing ? 'Editar' : 'Agregar'} pagadores</ModalHeader>
      <ModalCloseButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <ItemModalStepper activeStep={1} />
          <Stack spacing={4}>
            <Flex justifyContent={'space-between'} direction={'column'} alignItems={'baseline'}>
              <Flex fontSize={18}>
                ¿Quienes pagaron
                <Text fontWeight={'bold'} decoration={'underline'} mx={1}>
                  primero
                </Text>
                ?
              </Flex>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<LuChevronDown size={18} />}
                  mt={4}
                  w={'fit-content'}
                >
                  Agregar un miembro
                </MenuButton>
                {selectedMembers.length === currentEvent.members.length ? (
                  <MenuList>
                    <MenuItem fontSize={'sm'} color={menuItemColor} disabled>
                      Ya has agregado a todos los miembros
                    </MenuItem>
                  </MenuList>
                ) : (
                  <MenuList>
                    {currentEvent.members
                      .filter((member) => !selectedMembers.some((m) => m.name === member.name))
                      .map((member, index) => (
                        <MenuItem
                          key={index}
                          onClick={() =>
                            setSelectedMembers([
                              ...selectedMembers,
                              {
                                ...member,
                                amount: 0,
                              },
                            ])
                          }
                        >
                          {member.name === currentEvent.owner.name
                            ? `Tú (${member.name})`
                            : member.name}
                        </MenuItem>
                      ))}
                  </MenuList>
                )}
              </Menu>
            </Flex>
          </Stack>
          <Stack mt={8} spacing={4}>
            {selectedMembers.length === 0 ? (
              <Text fontSize={'sm'} color={menuItemColor}>
                No hay miembros agregados, prueba agregar uno
              </Text>
            ) : (
              selectedMembers.map((member, index) => (
                <Box key={index} bg={cardBgColor} borderRadius={4}>
                  <Flex justifyContent={'space-between'}>
                    <Box px={4} py={2}>
                      <FormControl isInvalid={!!errors.members?.[index]?.amount}>
                        <FormLabel htmlFor={`members.${index}.amount`}>{member.name}</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <LuDollarSign size={20} />
                          </InputLeftElement>
                          <Input
                            type="number"
                            {...register(`members.${index}.amount` as const, {
                              valueAsNumber: true,
                            })}
                            id={`members.${index}.amount`}
                            placeholder="0"
                            defaultValue={member.amount ? member.amount : undefined}
                          />
                        </InputGroup>
                        {errors.members?.[index]?.amount && (
                          <FormErrorMessage>
                            {errors.members?.[index]?.amount.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>
                    <IconButton
                      aria-label="Remove member"
                      icon={<LuTrash size={16} />}
                      size={'xl'}
                      px={4}
                      borderLeftRadius={0}
                      bgColor={'red.500'}
                      _hover={{
                        bgColor: 'red.600',
                      }}
                      _active={{
                        bgColor: 'red.700',
                      }}
                      onClick={() => handleRemoveMember(member)}
                    />
                  </Flex>
                </Box>
              ))
            )}
            <Box mt={2}>
              <Text fontWeight={'bold'} mt={1}>
                Total pagado: $ {watchedMembers.reduce((acc, m) => acc + (m.amount || 0), 0)}
              </Text>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={goBack} color={footerBackBtnColor}>
            Atrás
          </Button>
          <Button isLoading={isSubmitting} colorScheme="blue" mr={3} type="submit">
            Siguiente
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
