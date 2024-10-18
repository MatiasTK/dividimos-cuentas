'use client';

import {
  Accordion,
  AccordionItem,
  AccordionIcon,
  Avatar,
  Box,
  Button,
  Grid,
  Heading,
  Stack,
  Tag,
  TagLabel,
  Text,
  AccordionButton,
  AccordionPanel,
  Checkbox,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { Event, SplitMember, Payer, Person, Item, Debt } from './types';
import { MdOutlineEvent } from 'react-icons/md';
import { FaCheck, FaCopy, FaEdit, FaPlus, FaReceipt, FaTools, FaTrash } from 'react-icons/fa';
import { LuPackage } from 'react-icons/lu';
import { IoPersonSharp } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ParticipantModal from './ParticipantModal';
import { IoIosMail } from 'react-icons/io';
import ItemModal from './components/ItemModal/ItemModal';

type props = {
  event: Event;
  setEvent: (event: Event) => void;
};

export default function ShowEvent({ event, setEvent }: props) {
  const [bills, setBills] = useState<Debt[]>([]);
  const [paidBills, setPaidBills] = useState<Debt[]>([]);

  // TODO: Recalculate debts on item edit/remove

  const itemToDelete = useRef<Item | null>(null);
  const itemToEdit = useRef<Item>({
    id: '',
    description: '',
    price: 0,
    paidBy: [],
    sharedBetween: [],
  });

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const deleteDialogCancelRef = useRef<HTMLButtonElement>(null);

  const {
    isOpen: isParticipantModelOpen,
    onOpen: onParticipantModelOpen,
    onClose: onParticipantModelClose,
  } = useDisclosure();

  const {
    isOpen: isItemModalOpen,
    onOpen: onItemModalOpen,
    onClose: onItemModalClose,
  } = useDisclosure();

  const handleDeleteItem = (item: Item) => {
    setEvent({
      ...event,
      items: event.items.filter((i) => i.id !== item.id),
    });
    onDeleteDialogClose();
  };

  const addParticipant = (participant: { name: string; email: string; cvu: string }) => {
    setEvent({
      ...event,
      people: [
        ...event.people,
        { id: uuidv4(), name: participant.name, email: participant.email, cvu: participant.cvu },
      ],
    });
  };

  const togglePaidBill = (bill: Debt) => {
    if (bill.paid) {
      bill.paid = !bill.paid;
      const newPaidBills = paidBills.filter((b) => b.id !== bill.id);
      const newBills = [...bills, bill];
      setBills(newBills);
      setPaidBills(newPaidBills);
    } else {
      bill.paid = !bill.paid;
      const newBills = bills.filter((b) => b.id !== bill.id);
      const newPaidBills = [...paidBills, bill];
      setBills(newBills);
      setPaidBills(newPaidBills);
    }
  };

  const calculateBills = (items: Item[]) => {
    const currentBills: Debt[] = [];

    items.forEach((item) => {
      const personToAmountMap = new Map<Person, number>();

      item.sharedBetween.forEach((member) => {
        if (!member.isIncluded) return;

        personToAmountMap.set(
          member.person,
          (personToAmountMap.get(member.person) || 0) - member.splitAmount
        );
      });

      item.paidBy.forEach((payer) => {
        personToAmountMap.set(
          payer.person,
          (personToAmountMap.get(payer.person) || 0) + payer.amount
        );
      });
      const debtors = Array.from(personToAmountMap.entries()).filter(([, amount]) => amount < 0);
      const creditors = Array.from(personToAmountMap.entries()).filter(([, amount]) => amount > 0);

      creditors.forEach(([creditor, credit]) => {
        let remainingCredit = credit;
        debtors.forEach(([debtor, debt], index) => {
          if (debt === 0 || remainingCredit <= 0) return;

          const transferAmount = Math.min(-debt, credit);

          if (transferAmount > 0) {
            currentBills.push({
              id: uuidv4(),
              amount: transferAmount,
              debtor: debtor,
              creditor: creditor,
              paid: false,
            });
            console.log(`${debtor.name} debe ${transferAmount} a ${creditor.name}`);

            debtors[index][1] += transferAmount;
            remainingCredit -= transferAmount;
          }
        });
      });
    });

    setBills(currentBills);
  };

  const addItem = (
    itemDescription: string,
    itemPrice: number,
    itemPaidBy: Payer[],
    itemSharedBetween: SplitMember[]
  ) => {
    const newItems = [
      ...event.items,
      {
        id: uuidv4(),
        description: itemDescription,
        price: itemPrice,
        paidBy: itemPaidBy,
        sharedBetween: itemSharedBetween,
      },
    ];
    setEvent({
      ...event,
      items: newItems,
    });
    calculateBills(newItems);
  };

  const editItem = (
    itemId: string,
    itemDescription: string,
    itemPrice: number,
    itemPaidBy: Payer[],
    itemSharedBetween: SplitMember[]
  ) => {
    const newItems = event.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          description: itemDescription,
          price: itemPrice,
          paidBy: itemPaidBy,
          sharedBetween: itemSharedBetween,
        };
      }
      return item;
    });
    setEvent({
      ...event,
      items: newItems,
    });
    itemToEdit.current = {
      id: '',
      description: '',
      price: 0,
      paidBy: [],
      sharedBetween: [],
    };
    calculateBills(newItems);
  };

  return (
    <Stack>
      <Box>
        <Stack my={4} flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack flexDir={'row'} alignItems={'center'}>
            <MdOutlineEvent size={24} />
            <Box>
              <Heading as={'h2'} size={'md'}>
                {event.name}
              </Heading>
              <Text fontSize={'xs'} color={'whiteAlpha.500'}>
                Fecha del evento: {event.date.toLocaleDateString()}
              </Text>
            </Box>
          </Stack>

          <Text fontSize={'sm'} color={'whiteAlpha.500'}>
            Creado por {event.createdBy?.name}
          </Text>
        </Stack>

        {event.description !== '' && (
          <Text fontSize={'sm'} color={'whiteAlpha.400'} mt={8}>
            {event.description}
          </Text>
        )}
      </Box>

      <Box>
        <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} my={4}>
          <Stack flexDir={'row'} alignItems={'center'}>
            <IoPersonSharp size={20} />
            <Text fontWeight={'semibold'}>Personas</Text>
          </Stack>

          <Button
            colorScheme="whiteAlpha"
            backgroundColor={'whiteAlpha.100'}
            _hover={{
              backgroundColor: 'whiteAlpha.200',
            }}
            _active={{
              backgroundColor: 'whiteAlpha.300',
            }}
            onClick={onParticipantModelOpen}
          >
            <FaPlus size={16} />
            <Text ml={2} fontSize={{ base: 'sm', md: 'md' }}>
              Agregar participante
            </Text>
          </Button>
        </Stack>

        <Stack my={8}>
          <Stack flexDir={'row'} flexWrap={'wrap'} gap={2}>
            {event.people.map((person) => (
              <Tag
                key={person.id}
                size={'lg'}
                borderRadius={'full'}
                w={'fit-content'}
                bg={'whiteAlpha.100'}
                color={'whiteAlpha.800'}
              >
                <Avatar size={'xs'} name={person.name} ml={-1} mr={2} />
                <TagLabel>{person.name}</TagLabel>
              </Tag>
            ))}
          </Stack>
          {event.people.length === 0 && (
            <Text color={'whiteAlpha.400'} fontSize={'sm'}>
              No hay personas aun, haz click en agregar participante para añadir el primero!
            </Text>
          )}
        </Stack>

        <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} my={6}>
          <Stack flexDir={'row'} alignItems={'center'}>
            <LuPackage size={20} />
            <Text fontWeight={'semibold'}>Items</Text>
          </Stack>

          <Button
            colorScheme="whiteAlpha"
            backgroundColor={'whiteAlpha.100'}
            _hover={{
              backgroundColor: 'whiteAlpha.200',
            }}
            _active={{
              backgroundColor: 'whiteAlpha.300',
            }}
            onClick={onItemModalOpen}
          >
            <FaPlus size={16} />
            <Text ml={2} fontSize={{ base: 'sm', md: 'md' }}>
              Agregar item
            </Text>
          </Button>
        </Stack>
        <Button size={'xs'} onClick={() => calculateBills(event.items)}>
          Update Bills (DEV)
        </Button>

        <Stack my={8}>
          {event.items.length === 0 && (
            <Text color={'whiteAlpha.400'} fontSize={'sm'}>
              No hay items aun, haz click en agregar item para añadir el primero!
            </Text>
          )}
          <Accordion allowToggle>
            {event.items.map((item) => (
              <AccordionItem key={item.id} border={'none'} mb={2}>
                <AccordionButton
                  backgroundColor={'whiteAlpha.100'}
                  _hover={{ backgroundColor: 'whiteAlpha.200' }}
                  _active={{ backgroundColor: 'whiteAlpha.300' }}
                  borderRadius={'md'}
                  p={4}
                  color={'whiteAlpha.800'}
                  _expanded={{
                    borderBottomRadius: '0',
                  }}
                >
                  <Box as="span" flex="1" textAlign="left">
                    {item.description}
                  </Box>
                  <Box as="span" flex="1" textAlign="right" me={4}>
                    ${item.price.toFixed(2)}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} backgroundColor={'whiteAlpha.100'}>
                  <Stack flexDir={'row'} gap={1} alignItems={'center'}>
                    <Text
                      fontSize={{
                        base: 'sm',
                        md: 'md',
                      }}
                    >
                      Pagado por:{' '}
                      {item.paidBy
                        .map((payer) => `${payer.person.name} ($${payer.amount.toFixed(2)})`)
                        .join(', ')}
                    </Text>
                  </Stack>
                  <Stack flexDir={'row'} gap={1} alignItems={'center'}>
                    <Text
                      fontSize={{
                        base: 'sm',
                        md: 'md',
                      }}
                    >
                      Dividido entre:{' '}
                      {item.sharedBetween
                        .filter((member) => member.isIncluded)
                        .map(
                          (member) => `${member.person.name} ($${member.splitAmount.toFixed(2)})`
                        )
                        .join(', ')}
                    </Text>
                  </Stack>
                  <Stack flexDir={'row'} gap={2} mt={2}>
                    <Button
                      colorScheme="whiteAlpha"
                      backgroundColor={'whiteAlpha.100'}
                      _hover={{ backgroundColor: 'whiteAlpha.200' }}
                      _active={{ backgroundColor: 'whiteAlpha.300' }}
                      w={'full'}
                      onClick={() => {
                        itemToEdit.current = item;
                        onItemModalOpen();
                      }}
                    >
                      <FaEdit size={16} />
                      <Text ms={2} fontSize={'sm'}>
                        Edit
                      </Text>
                    </Button>
                    <Button
                      colorScheme="whiteAlpha"
                      backgroundColor={'whiteAlpha.100'}
                      _hover={{ backgroundColor: 'whiteAlpha.200' }}
                      _active={{ backgroundColor: 'whiteAlpha.300' }}
                      color={'red.400'}
                      w={'full'}
                      onClick={() => {
                        itemToDelete.current = item;
                        onDeleteDialogOpen();
                      }}
                    >
                      <FaTrash size={16} />
                      <Text ms={2} fontSize={'sm'}>
                        Delete
                      </Text>
                    </Button>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>

        <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} my={4}>
          <Stack flexDir={'row'} alignItems={'center'}>
            <FaReceipt size={20} />
            <Text fontWeight={'semibold'}>Deudas</Text>
          </Stack>
        </Stack>

        <Stack my={8}>
          {event.items.length === 0 && (
            <Text color={'whiteAlpha.400'} fontSize={'sm'}>
              No hay gastos registrados aún
            </Text>
          )}
          {bills.map((bill) => {
            return (
              <Stack
                key={bill.id}
                flexDir={'row'}
                justifyContent={'space-between'}
                backgroundColor={'whiteAlpha.100'}
                p={4}
                borderRadius={'md'}
                onClick={() => togglePaidBill(bill)}
                _hover={{
                  backgroundColor: 'whiteAlpha.200',
                }}
                cursor={'pointer'}
              >
                <Text>
                  {bill.debtor.name} debe a {bill.creditor.name} ${bill.amount.toFixed(2)}
                </Text>
                <Checkbox />
              </Stack>
            );
          })}
        </Stack>

        {paidBills.length > 0 && (
          <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} my={4}>
            <Stack flexDir={'row'} alignItems={'center'}>
              <FaCheck size={20} />
              <Text fontWeight={'semibold'}>Pagadas</Text>
            </Stack>
          </Stack>
        )}

        <Stack my={8}>
          {paidBills.map((bill) => {
            return (
              <Stack
                key={bill.debtor.id}
                flexDir={'row'}
                justifyContent={'space-between'}
                backgroundColor={'whiteAlpha.100'}
                p={4}
                borderRadius={'md'}
                cursor={'pointer'}
                onClick={() => togglePaidBill(bill)}
                _hover={{
                  backgroundColor: 'whiteAlpha.200',
                }}
              >
                <Text as={'s'}>
                  {bill.debtor.name} debe a {bill.creditor.name} ${bill.amount.toFixed(2)}
                </Text>
                <Checkbox isChecked={true} />
              </Stack>
            );
          })}
        </Stack>
        <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} my={4}>
          <Stack flexDir={'row'} alignItems={'center'}>
            <FaTools size={20} />
            <Text fontWeight={'semibold'}>Utilidades</Text>
          </Stack>
        </Stack>
        <Grid my={8} gap={4} templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
          <Button
            colorScheme="whiteAlpha"
            backgroundColor={'whiteAlpha.100'}
            _hover={{
              backgroundColor: 'whiteAlpha.200',
            }}
            _active={{
              backgroundColor: 'whiteAlpha.300',
            }}
            borderRadius={'md'}
            p={10}
          >
            <Stack flexDir={'column'} alignItems={'center'}>
              <FaCopy size={20} />
              <Text fontSize={'sm'}>Copiar información</Text>
            </Stack>
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
            borderRadius={'md'}
            p={10}
          >
            <Stack flexDir={'column'} alignItems={'center'}>
              <IoIosMail size={25} />
              <Text fontSize={'sm'}>Enviar Mails a los participantes</Text>
              <Text fontSize={'2xs'} color={'whiteAlpha.400'}>
                Solo se enviarán a los que se haya registrado su email
              </Text>
            </Stack>
          </Button>
        </Grid>
      </Box>

      <ParticipantModal
        isOpen={isParticipantModelOpen}
        onClose={onParticipantModelClose}
        addParticipant={addParticipant}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          itemToEdit.current = {
            id: '',
            description: '',
            price: 0,
            paidBy: [],
            sharedBetween: [],
          };
          onItemModalClose();
        }}
        creator={event.createdBy!}
        people={event.people}
        addItem={addItem}
        isEdit={itemToEdit.current.id !== ''}
        editItemInfo={itemToEdit.current}
        editItem={editItem}
      />

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={deleteDialogCancelRef}
        onClose={onDeleteDialogClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent background={'#222222'} color={'white'}>
          <AlertDialogHeader>Confirmar eliminación</AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              ¿Estás seguro de que deseas eliminar este item? No podrás deshacer esta acción
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={deleteDialogCancelRef}
              onClick={onDeleteDialogClose}
              background={'whiteAlpha.100'}
              _hover={{ background: 'whiteAlpha.200' }}
              _active={{ background: 'whiteAlpha.300' }}
              color={'whiteAlpha.800'}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                if (itemToDelete.current) {
                  handleDeleteItem(itemToDelete.current);
                  onDeleteDialogClose();
                }
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
