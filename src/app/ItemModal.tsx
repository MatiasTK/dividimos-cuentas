'use client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  InputGroup,
  InputLeftElement,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Checkbox,
  Divider,
  Box,
  CheckboxGroup,
  Alert,
  AlertDescription,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaEquals, FaPercentage, FaQuestionCircle, FaTrash } from 'react-icons/fa';
import { Item, Payer, Person, SplitMember } from './types';
import { FaChevronDown } from 'react-icons/fa6';

type props = {
  isOpen: boolean;
  onClose: () => void;
  creator: Person;
  people: Person[];
  addItem: (
    itemDescription: string,
    itemPrice: number,
    itemPaidBy: Payer[],
    itemSharedBetween: SplitMember[]
  ) => void;
  editingItem: boolean;
  editItemInfo: Item;
  editItem: (
    itemId: string,
    itemDescription: string,
    itemPrice: number,
    itemPaidBy: Payer[],
    itemSharedBetween: SplitMember[]
  ) => void;
};

export default function ItemModal({
  isOpen,
  onClose,
  creator,
  people,
  addItem,
  editingItem,
  editItemInfo,
  editItem,
}: props) {
  const [currentItemDescription, setCurrentItemDescription] = useState('');
  const [currentItemPrice, setCurrentItemPrice] = useState(0);
  const [currentItemPaidBy, setCurrentItemPaidBy] = useState<Payer[]>([]);
  const [currentItemSharedBetween, setCurrentItemSharedBetween] = useState<SplitMember[]>([]);

  const toast = useToast();

  const [error, setError] = useState({
    status: false,
    message: '',
  });

  useEffect(() => {
    setCurrentItemSharedBetween([
      {
        splitAmount: 0,
        person: creator,
        splitMethod: 'equally' as const,
        isIncluded: true,
        porcentalValue: 0,
        manuallyValue: 0,
      },
      ...people.map((person) => ({
        splitAmount: 0,
        person,
        splitMethod: 'equally' as const,
        isIncluded: true,
        porcentalValue: 0,
        manuallyValue: 0,
      })),
    ]);

    return () => {
      setCurrentItemSharedBetween([]);
    };
  }, [creator, people]);

  useEffect(() => {
    if (editingItem) {
      setCurrentItemDescription(editItemInfo.description);
      setCurrentItemPrice(editItemInfo.price);
      setCurrentItemPaidBy(editItemInfo.paidBy);
      setCurrentItemSharedBetween(editItemInfo.sharedBetween);
    }
  }, [editingItem]);

  const updateSplitValues = (price: number, modifiedItemSharedBetween: SplitMember[]) => {
    let total = price;

    const newMembers = modifiedItemSharedBetween.map((member) => {
      if (member.splitMethod === 'manually' && member.isIncluded) {
        member.splitAmount = member.manuallyValue!;
        total -= member.splitAmount;
      }

      if (member.splitMethod === 'porcentually' && member.isIncluded) {
        member.splitAmount = (price * member.porcentalValue!) / 100;
        total -= member.splitAmount;
      }

      return member;
    });

    const equallyMembers = newMembers.filter((m) => m.splitMethod === 'equally' && m.isIncluded);
    equallyMembers.forEach((member) => {
      if (total <= 0) {
        member.splitAmount = 0;
      } else {
        member.splitAmount = total / equallyMembers.length;
      }
    });

    setCurrentItemSharedBetween(newMembers);

    if (total < 0) {
      setError({
        status: true,
        message: `Demasiadas contribuciones. Necesitas $${Math.abs(total).toFixed(2)} menos. `,
      });
    } else if (equallyMembers.length === 0 && total > 0) {
      setError({
        status: true,
        message: `Faltan contribuciones. Necesitas $${total.toFixed(
          2
        )} más. Comprueba que todos los participantes estén incluidos y que la suma de los valores sea igual al precio del item.`,
      });
    } else {
      setError({
        status: false,
        message: '',
      });
    }
  };

  const handleAddPaidBy = (person: Person) => {
    setCurrentItemPaidBy([...currentItemPaidBy, { person, amount: 0 }]);
    setError({
      status: false,
      message: '',
    });
  };

  const handleChangePaidByValue = (payer: Payer, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const newPayers = currentItemPaidBy.map((p) => {
      if (p.person.id === payer.person.id) {
        return { ...p, amount: value };
      }
      return p;
    });
    const totalPaidBy = newPayers.reduce((acc, curr) => acc + curr.amount, 0);
    setCurrentItemPaidBy(newPayers);
    setCurrentItemPrice(totalPaidBy);
    updateSplitValues(totalPaidBy, currentItemSharedBetween);
    setError({
      status: false,
      message: '',
    });
  };

  const removePaidBy = (payer: Payer) => {
    const newPayers = currentItemPaidBy.filter((p) => p.person.id !== payer.person.id);
    const newTotal = newPayers.reduce((acc, curr) => acc + curr.amount, 0);
    setCurrentItemPaidBy(newPayers);
    setCurrentItemPrice(newTotal - payer.amount);
    updateSplitValues(newTotal, currentItemSharedBetween);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItemDescription(e.target.value);
    setError({
      status: false,
      message: '',
    });
  };

  const changeSplitMethodEqually = (member: SplitMember) => {
    const modifiedItemSharedBetween = currentItemSharedBetween.map((m) => {
      if (m.person.name === member.person.name) {
        return { ...m, splitMethod: 'equally' as const };
      }
      return m;
    });
    updateSplitValues(currentItemPrice, modifiedItemSharedBetween);
  };

  const changeSplitMethodPorcentually = (member: SplitMember) => {
    const modifiedItemSharedBetween = currentItemSharedBetween.map((m) => {
      if (m.person.name === member.person.name) {
        return { ...m, splitMethod: 'porcentually' as const };
      }
      return m;
    });
    updateSplitValues(currentItemPrice, modifiedItemSharedBetween);
  };

  const changeSplitMethodManually = (member: SplitMember) => {
    const modifiedItemSharedBetween = currentItemSharedBetween.map((m) => {
      if (m.person.name === member.person.name) {
        return { ...m, splitMethod: 'manually' as const };
      }
      return m;
    });
    updateSplitValues(currentItemPrice, modifiedItemSharedBetween);
  };

  const toggleMemberIncluded = (member: SplitMember) => {
    const modifiedItemSharedBetween = currentItemSharedBetween.map((m) => {
      if (m.person.name === member.person.name) {
        return { ...m, isIncluded: !m.isIncluded };
      }
      return m;
    });
    updateSplitValues(currentItemPrice, modifiedItemSharedBetween);
  };

  const handleChangePorcentally = (member: SplitMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const porcentalValue = Number(e.target.value);
    member.porcentalValue = porcentalValue;
    const modifiedItemSharedBetween = currentItemSharedBetween.map((m) => {
      if (m.person.name === member.person.name) {
        return { ...m, porcentalValue };
      }
      return m;
    });
    updateSplitValues(currentItemPrice, modifiedItemSharedBetween);
  };

  const handleChangeManually = (member: SplitMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const manuallyValue = Number(e.target.value);
    member.manuallyValue = manuallyValue;
    const modifiedItemSharedBetween = currentItemSharedBetween.map((m) => {
      if (m.person.name === member.person.name) {
        return { ...m, manuallyValue };
      }
      return m;
    });
    updateSplitValues(currentItemPrice, modifiedItemSharedBetween);
  };

  const closeModal = () => {
    onClose();
    setCurrentItemDescription('');
    setCurrentItemPrice(0);
    setCurrentItemPaidBy([]);
    setError({
      status: false,
      message: '',
    });
  };

  const handleSubmit = () => {
    if (currentItemDescription === '') {
      setError({
        status: true,
        message: 'La descripción del item es requerida.',
      });
      return;
    }

    if (currentItemPrice <= 0) {
      setError({
        status: true,
        message: 'El precio del item es invalido.',
      });
      return;
    }

    if (currentItemPaidBy.length === 0) {
      setError({
        status: true,
        message: 'Debes seleccionar al menos una persona que haya pagado por el item.',
      });
      return;
    }

    let totalPaidBy = 0;
    currentItemPaidBy.forEach((payer) => {
      if (payer.amount <= 0) {
        setError({
          status: true,
          message: 'El valor pagado por ' + payer.person.name + ' es invalido.',
        });
        return;
      }
      totalPaidBy += payer.amount;
    });

    if (totalPaidBy !== currentItemPrice) {
      setError({
        status: true,
        message: 'El total pagado por los participantes no es igual al precio del item.',
      });
      return;
    }

    closeModal();
    if (editingItem) {
      editItem(
        editItemInfo.id,
        currentItemDescription,
        currentItemPrice,
        currentItemPaidBy,
        currentItemSharedBetween
      );
    } else {
      addItem(
        currentItemDescription,
        currentItemPrice,
        currentItemPaidBy,
        currentItemSharedBetween
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size={{
        base: 'full',
        md: 'xl',
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent color={'white'} background={'#222222'}>
        <ModalHeader>{editingItem ? 'Editar Item' : 'Crear Item'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={4}>
            <Box>
              <Text>Descripción</Text>
              <Input
                type="text"
                value={currentItemDescription}
                colorScheme="blackAlpha"
                borderColor={'whiteAlpha.300'}
                placeholder="Pizza"
                mt={2}
                _placeholder={{
                  color: 'whiteAlpha.600',
                }}
                _hover={{
                  borderColor: 'whiteAlpha.600',
                }}
                focusBorderColor="whiteAlpha.600"
                onChange={handleChangeDescription}
              />
            </Box>

            <Divider borderColor={'whiteAlpha.300'} />

            <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Text>Pagado por</Text>
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="blackAlpha"
                  backgroundColor={'whiteAlpha.100'}
                  rightIcon={<FaChevronDown />}
                  mb={2}
                  size={{
                    base: 'sm',
                    md: 'md',
                  }}
                >
                  Agregar participante
                </MenuButton>
                <MenuList backgroundColor={'#141414'} borderColor={'whiteAlpha.300'}>
                  {!currentItemPaidBy.some((payer) => payer.person.id === creator.id) && (
                    <MenuItem
                      key={creator.id}
                      value={creator.name}
                      backgroundColor={'#141414'}
                      _hover={{
                        backgroundColor: 'whiteAlpha.100',
                      }}
                      onClick={() => handleAddPaidBy(creator)}
                    >
                      <Avatar size={'xs'} name={creator.name} />
                      <Text ml={2}>Tú ({creator.name})</Text>
                    </MenuItem>
                  )}
                  {people.map((person) => {
                    if (currentItemPaidBy.some((payer) => payer.person.id === person.id)) {
                      return null;
                    }
                    return (
                      <MenuItem
                        key={person.id}
                        value={person.name}
                        backgroundColor={'#141414'}
                        _hover={{
                          backgroundColor: 'whiteAlpha.100',
                        }}
                        onClick={() => handleAddPaidBy(person)}
                      >
                        <Avatar size={'xs'} name={person.name} />
                        <Text ml={2}>{person.name}</Text>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Stack>
            {currentItemPaidBy.length === 0 && (
              <Text textAlign={'center'} fontSize={'sm'} color={'whiteAlpha.600'}>
                Todavia no se ha seleccionado nadie, prueba agregando uno!
              </Text>
            )}
            <Stack flexDir={'row'} gap={2} flexWrap={'wrap'}>
              {currentItemPaidBy.map((payer) => (
                <Stack
                  flexDir={'row'}
                  alignItems={'center'}
                  backgroundColor={'whiteAlpha.100'}
                  borderRadius="lg"
                  w={'full'}
                  justifyContent={'space-between'}
                  key={payer.person.id}
                >
                  <Stack flexDir={'column'} p={2} w={'full'}>
                    <Text ps={2}>{payer.person.name}</Text>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents={'none'}
                        fontSize={'1.2em'}
                        color={'whiteAlpha.600'}
                      >
                        $
                      </InputLeftElement>
                      <Input
                        type="number"
                        colorScheme="blackAlpha"
                        value={payer.amount}
                        color={'white'}
                        borderColor={'whiteAlpha.300'}
                        placeholder={'1000'}
                        _placeholder={{
                          color: 'whiteAlpha.600',
                        }}
                        _hover={{
                          borderColor: 'whiteAlpha.600',
                        }}
                        focusBorderColor="whiteAlpha.600"
                        onChange={(e) => handleChangePaidByValue(payer, e)}
                      />
                    </InputGroup>
                  </Stack>
                  <Button
                    variant={'ghost'}
                    color={'white'}
                    borderLeft={'1px solid'}
                    borderLeftColor={'blackAlpha.600'}
                    borderLeftRadius={0}
                    backgroundColor={'red.500'}
                    h={'full'}
                    _hover={{
                      backgroundColor: 'red.600',
                    }}
                    _active={{
                      backgroundColor: 'red.600',
                    }}
                    onClick={() => removePaidBy(payer)}
                  >
                    <FaTrash />
                  </Button>
                </Stack>
              ))}
              {currentItemPrice > 0 && (
                <Stack mt={2} flexDir={'row'} alignItems={'center'}>
                  <Text>Total pagado:</Text>
                  <Text fontWeight={'bold'} fontSize="lg">
                    ${currentItemPrice.toFixed(2)}
                  </Text>
                </Stack>
              )}
            </Stack>

            <Divider borderColor={'whiteAlpha.300'} />

            <Stack>
              <Stack flexDir={'row'} alignItems={'center'} mb={2}>
                <Text>Compartido entre</Text>
                <Button
                  variant={'unstyled'}
                  colorScheme="whiteAlpha"
                  color={'white'}
                  onClick={() => {
                    toast({
                      description: 'El "=" significa que se divide en partes iguales.',
                    });
                    toast({
                      description: 'El "%" significa que paga el porcentaje indicado del total.',
                    });
                    toast({
                      description: 'El "$" significa que paga la cantidad fija indicada.',
                    });
                  }}
                >
                  <FaQuestionCircle />
                </Button>
              </Stack>
              <CheckboxGroup
                defaultValue={currentItemSharedBetween.map((member) => member.person.name)}
              >
                {currentItemSharedBetween.map((member) => (
                  <Box key={member.person.id} mb={2}>
                    <Stack
                      flexDir={'row'}
                      alignItems={'center'}
                      backgroundColor={'whiteAlpha.100'}
                      borderRadius={'lg'}
                      borderBottomRadius={0}
                      justifyContent={'space-between'}
                    >
                      <Checkbox
                        value={member.person.name}
                        isChecked={member.isIncluded}
                        onChange={() => toggleMemberIncluded(member)}
                        ms={2}
                      >
                        <Text>{member.person.name}</Text>
                      </Checkbox>

                      <Stack flexDir={'row'} alignItems={'center'} gap={0}>
                        {member.isIncluded && <Text me={2}>${member.splitAmount.toFixed(2)}</Text>}
                        <Button
                          variant={'ghost'}
                          colorScheme="whiteAlpha"
                          color={'white'}
                          backgroundColor={
                            member.splitMethod === 'equally' ? 'whiteAlpha.300' : 'whiteAlpha.100'
                          }
                          borderRadius={0}
                          _hover={{
                            backgroundColor: 'whiteAlpha.200',
                          }}
                          _active={{
                            backgroundColor: 'whiteAlpha.300',
                          }}
                          onClick={() => changeSplitMethodEqually(member)}
                        >
                          <FaEquals />
                        </Button>
                        <Button
                          variant={'ghost'}
                          colorScheme="whiteAlpha"
                          color={'white'}
                          backgroundColor={
                            member.splitMethod === 'porcentually'
                              ? 'whiteAlpha.300'
                              : 'whiteAlpha.100'
                          }
                          borderRadius={0}
                          _hover={{
                            backgroundColor: 'whiteAlpha.200',
                          }}
                          _active={{
                            backgroundColor: 'whiteAlpha.300',
                          }}
                          onClick={() => changeSplitMethodPorcentually(member)}
                        >
                          <FaPercentage />
                        </Button>
                        <Button
                          variant={'ghost'}
                          colorScheme="whiteAlpha"
                          color={'white'}
                          backgroundColor={
                            member.splitMethod === 'manually' ? 'whiteAlpha.300' : 'whiteAlpha.100'
                          }
                          borderLeftRadius={0}
                          _hover={{
                            backgroundColor: 'whiteAlpha.200',
                          }}
                          _active={{
                            backgroundColor: 'whiteAlpha.300',
                          }}
                          onClick={() => changeSplitMethodManually(member)}
                        >
                          <FaDollarSign />
                        </Button>
                      </Stack>
                    </Stack>
                    {member.splitMethod === 'porcentually' && (
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents={'none'}
                          fontSize={'1.2em'}
                          color={'whiteAlpha.600'}
                        >
                          %
                        </InputLeftElement>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={member.porcentalValue || 0}
                          colorScheme="blackAlpha"
                          borderColor={'whiteAlpha.300'}
                          borderTopRadius={0}
                          placeholder="25"
                          _placeholder={{
                            color: 'whiteAlpha.600',
                          }}
                          _hover={{
                            borderColor: 'whiteAlpha.600',
                          }}
                          focusBorderColor="whiteAlpha.600"
                          onChange={(e) => handleChangePorcentally(member, e)}
                        />
                      </InputGroup>
                    )}
                    {member.splitMethod === 'manually' && (
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents={'none'}
                          fontSize={'1.2em'}
                          color={'whiteAlpha.600'}
                        >
                          $
                        </InputLeftElement>
                        <Input
                          type="number"
                          value={member.manuallyValue || 0}
                          colorScheme="blackAlpha"
                          borderColor={'whiteAlpha.300'}
                          borderTopRadius={0}
                          placeholder="1000"
                          _placeholder={{
                            color: 'whiteAlpha.600',
                          }}
                          _hover={{
                            borderColor: 'whiteAlpha.600',
                          }}
                          focusBorderColor="whiteAlpha.600"
                          onChange={(e) => handleChangeManually(member, e)}
                        />
                      </InputGroup>
                    )}
                  </Box>
                ))}
              </CheckboxGroup>
            </Stack>
          </Stack>
          {error.status && (
            <Alert status="error" mt={4} variant={'solid'}>
              <AlertIcon />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            variant={'ghost'}
            colorScheme="whiteAlpha"
            color={'whiteAlpha.700'}
            _hover={{
              color: 'whiteAlpha.800',
            }}
            _active={{
              color: 'whiteAlpha.800',
            }}
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="whiteAlpha"
            backgroundColor={'whiteAlpha.100'}
            _hover={{
              backgroundColor: 'whiteAlpha.200',
            }}
            _active={{
              backgroundColor: 'whiteAlpha.300',
            }}
            mr={3}
            disabled={error.status}
            onClick={handleSubmit}
          >
            {editingItem ? 'Editar' : 'Agregar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
