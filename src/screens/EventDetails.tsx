import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Circle,
  Flex,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import ItemModal from '@components/ItemModal/ItemModal';
import MemberModal from '@components/MemberModal/MemberModal';
import { useEvent } from '@hooks/useEvent';
import {
  LuCalendar,
  LuClipboard,
  LuMail,
  LuPackage,
  LuPackagePlus,
  LuReceiptText,
  LuShare2,
  LuSquarePen,
  LuTrash2,
  LuUser,
  LuUserPen,
  LuUserPlus,
  LuUserX,
} from 'react-icons/lu';
import { Item, Person } from '@types';
import CopyModal from '@components/CopyModal/CopyModal';
import { useState } from 'react';
import DeleteDialog from '@components/DeleteDialog';
import { calculateFinalSettlement, calculateItemSplit } from '@lib/calculateBills';
import formatDate from '@lib/formatDate';

export default function EventDetails() {
  const { deleteMember, deleteItem, currentEvent } = useEvent();

  const [selectedMember, setSelectedMember] = useState<Person>();
  const [selectedItem, setSelectedItem] = useState<Item>();

  const {
    isOpen: isItemModalOpen,
    onOpen: onItemModalOpen,
    onClose: onItemModalClose,
  } = useDisclosure();

  const {
    isOpen: isMemberModalOpen,
    onOpen: onMemberModalOpen,
    onClose: onMemberModalClose,
  } = useDisclosure();

  const {
    isOpen: isCopyModalOpen,
    onOpen: onCopyModalOpen,
    onClose: onCopyModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteMemberDialogOpen,
    onOpen: onDeleteMemberDialogOpen,
    onClose: onDeleteMemberDialogClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteItemDialogOpen,
    onOpen: onDeleteItemDialogOpen,
    onClose: onDeleteItemDialogClose,
  } = useDisclosure();

  const finalSettlements = calculateFinalSettlement(currentEvent.items);

  const circleBgColor = useColorModeValue('blue.500', 'whiteAlpha.300');
  const grayText = useColorModeValue('gray.500', 'whiteAlpha.500');
  const cardBgColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const cardHoverBgColor = useColorModeValue('gray.300', 'whiteAlpha.300');
  const avatarColor = useColorModeValue('whiteAlpha.900', 'white');
  const scrollBarThumbColor = useColorModeValue(
    'var(--chakra-colors-gray-300)',
    'var(--chakra-colors-whiteAlpha-400)'
  );

  return (
    <Box mt={5}>
      <Box>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Text fontWeight={'bold'} fontSize={'lg'} letterSpacing={'wide'} textAlign={'center'}>
            {currentEvent.name}
          </Text>
          <Flex alignItems={'center'} gap={2}>
            <LuCalendar size={16} />
            <Text fontSize={'sm'}>{formatDate(currentEvent.date)}</Text>
          </Flex>
        </Flex>

        <Text fontSize={'sm'} color={grayText}>
          Creado por {currentEvent.owner.name}
        </Text>

        {currentEvent.description && (
          <Text fontSize={'sm'} color={grayText} mt={2}>
            {currentEvent.description}
          </Text>
        )}
      </Box>

      <Box>
        <Stack mt={5} direction={'row'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>
            <LuUser size={24} />
            <Text fontWeight={'bold'} ms={2}>
              Miembros
            </Text>
            <Circle bgColor={circleBgColor} size={6} ml={2} color={'white'} fontSize={'sm'}>
              {currentEvent.members.length}
            </Circle>
          </Flex>
          <Button
            leftIcon={<LuUserPlus className="LuUserPlus" size={20} />}
            size={'md'}
            colorScheme={'blue'}
            onClick={onMemberModalOpen}
          >
            Agregar
          </Button>
          <MemberModal
            isOpen={isMemberModalOpen}
            onClose={() => {
              setSelectedMember(undefined);
              onMemberModalClose();
            }}
            memberToEdit={selectedMember}
          />
        </Stack>
        <Stack mt={5} mb={10}>
          {currentEvent.members.length === 0 ? (
            <Text fontSize={'sm'} color={grayText}>
              No hay miembros aun, intenta agregando uno!
            </Text>
          ) : (
            <Stack
              spacing={4}
              maxH={'200px'}
              overflowY={'auto'}
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: scrollBarThumbColor,
                  borderRadius: '24px',
                },
              }}
            >
              {currentEvent.members.map((member) => {
                return (
                  <Flex
                    key={member.name}
                    alignItems={'center'}
                    ps={4}
                    mr={2}
                    borderRadius="lg"
                    justifyContent={'space-between'}
                    bg={cardBgColor}
                  >
                    <Flex alignItems={'center'} gap={4}>
                      <Avatar size={'sm'} name={member.name} color={avatarColor} />
                      <Text>{member.name}</Text>
                    </Flex>
                    <ButtonGroup spacing={0}>
                      <IconButton
                        aria-label="Edit member"
                        icon={<LuUserPen size={24} color="white" />}
                        bgColor={'#517ff4'}
                        _hover={{
                          bgColor: '#3f6ac2',
                        }}
                        _active={{
                          bgColor: '#2e548f',
                        }}
                        size={'lg'}
                        px={6}
                        borderLeftRadius={0}
                        borderRightRadius={member.name === currentEvent.owner.name ? 'lg' : 0}
                        variant={'ghost'}
                        onClick={() => {
                          setSelectedMember(member);
                          onMemberModalOpen();
                        }}
                      />
                      {member.name !== currentEvent.owner.name && (
                        <IconButton
                          aria-label="Remove member"
                          icon={<LuUserX size={24} color="white" />}
                          bgColor={'#fc5344'}
                          _hover={{
                            bgColor: '#d63a2f',
                          }}
                          _active={{
                            bgColor: '#b12b1f',
                          }}
                          px={6}
                          size={'lg'}
                          borderLeftRadius={0}
                          variant={'ghost'}
                          onClick={() => {
                            setSelectedMember(member);
                            onDeleteMemberDialogOpen();
                          }}
                        />
                      )}
                    </ButtonGroup>
                  </Flex>
                );
              })}
              <DeleteDialog
                isOpen={isDeleteMemberDialogOpen}
                onClose={onDeleteMemberDialogClose}
                onConfirm={() => deleteMember(selectedMember!)}
                title={'Eliminar miembro'}
              >
                <Text>
                  ¿Estás seguro de que deseas eliminar a <strong>{selectedMember?.name}</strong> de
                  todos los items y deudas asociadas? Esta acción no se puede deshacer.
                </Text>
              </DeleteDialog>
            </Stack>
          )}
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>
            <LuPackage size={24} />
            <Text fontWeight={'bold'} ms={2}>
              Items
            </Text>
            <Circle bgColor={circleBgColor} size={6} ml={2} color={'white'} fontSize={'sm'}>
              {currentEvent.items.length}
            </Circle>
          </Flex>
          <Button
            leftIcon={<LuPackagePlus className="LuPackagePlus" size={20} />}
            colorScheme={'blue'}
            onClick={onItemModalOpen}
            size={'md'}
          >
            Agregar
          </Button>
          <ItemModal
            isOpen={isItemModalOpen}
            onClose={() => {
              setSelectedItem(undefined);
              onItemModalClose();
            }}
            editingItem={selectedItem}
          />
        </Stack>
        <Stack mt={5} mb={10}>
          {currentEvent.items.length === 0 ? (
            <Text fontSize={'sm'} color={grayText}>
              ¡No hay items aun! Intenta agregando uno.
            </Text>
          ) : (
            <Accordion allowToggle>
              {currentEvent.items.map((item) => {
                return (
                  <AccordionItem key={item.description} mb={4} borderTop={0} borderBottom={0}>
                    <h2>
                      <AccordionButton
                        borderRadius={'lg'}
                        bgColor={cardBgColor}
                        _hover={{
                          bgColor: cardHoverBgColor,
                        }}
                        _expanded={{
                          bgColor: cardBgColor,
                          borderBottomRadius: 0,
                        }}
                      >
                        <Box as="span" textAlign="left" mr={2}>
                          {item.description}
                        </Box>
                        <Text
                          fontSize={'sm'}
                          color={'white'}
                          mr={'auto'}
                          fontWeight={'bold'}
                          bgColor={'blue.500'}
                          borderRadius={'full'}
                          px={2}
                        >
                          ${item.paidBy.reduce((acc, member) => acc + member.amount, 0)}
                        </Text>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bgColor={cardBgColor} borderBottomRadius={'lg'}>
                      <Text>
                        <Text as={'span'} mr={1} fontWeight={'bold'}>
                          Pagado por:
                        </Text>
                        {item.paidBy
                          .sort()
                          .map((payer) => `${payer.name} ($${payer.amount})`)
                          .join(', ')}
                      </Text>
                      <Text>
                        <Text as={'span'} mr={1} fontWeight={'bold'}>
                          Divido entre:
                        </Text>
                        {Array.from(calculateItemSplit(item).owes)
                          .sort()
                          .map(([k, v]) => `${k} ($${v})`)
                          .join(', ')}
                      </Text>
                      <ButtonGroup mt={2} w={'full'}>
                        <Button
                          leftIcon={<LuSquarePen size={22} />}
                          bgColor={'#517ff4'}
                          _hover={{
                            bgColor: '#3f6ac2',
                          }}
                          _active={{
                            bgColor: '#2e548f',
                          }}
                          w={'full'}
                          onClick={() => {
                            setSelectedItem(item);
                            onItemModalOpen();
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          leftIcon={<LuTrash2 size={22} />}
                          bgColor={'#fc5344'}
                          _hover={{
                            bgColor: '#d63a2f',
                          }}
                          _active={{
                            bgColor: '#b12b1f',
                          }}
                          w={'full'}
                          onClick={() => {
                            setSelectedItem(item);
                            onDeleteItemDialogOpen();
                          }}
                        >
                          Eliminar
                        </Button>
                      </ButtonGroup>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
          <DeleteDialog
            isOpen={isDeleteItemDialogOpen}
            onClose={onDeleteItemDialogClose}
            title={'Eliminar item'}
            onConfirm={() => deleteItem(selectedItem!)}
          >
            <Text>
              ¿Estás seguro de que deseas eliminar este item? Esta acción no se puede deshacer.
            </Text>
          </DeleteDialog>
        </Stack>
        <Stack direction={'row'} alignItems={'center'}>
          <LuReceiptText size={24} />
          <Text fontWeight={'bold'} ms={2}>
            Deudas
          </Text>
          <Circle bgColor={circleBgColor} size={6} ml={2} color={'white'} fontSize={'sm'}>
            {currentEvent.items.length === 0 ? 0 : finalSettlements.length}
          </Circle>
        </Stack>
        <Stack mt={5} mb={10}>
          {currentEvent.items.length === 0 ? (
            <Text fontSize={'sm'} color={grayText}>
              ¡Todavía no hay deudas! Agrega un ítem para comenzar.
            </Text>
          ) : (
            <Stack
              spacing={4}
              maxH={'200px'}
              overflowY={'auto'}
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: scrollBarThumbColor,
                  borderRadius: '24px',
                },
              }}
            >
              {finalSettlements.map((settlement, index) => {
                return (
                  <Flex
                    key={index}
                    alignItems={'center'}
                    py={2}
                    px={4}
                    mr={2}
                    borderRadius="lg"
                    bg={cardBgColor}
                  >
                    <Flex alignItems={'center'} gap={2}>
                      <Avatar name={settlement.from} size={'xs'} /> {settlement.from} debe
                      <Text
                        fontSize={'lg'}
                        color={'blue.500'}
                        letterSpacing={'tighter'}
                        fontWeight={'bold'}
                      >
                        ${settlement.amount}
                      </Text>
                      a
                      <Avatar name={settlement.to} size={'xs'} /> {settlement.to}
                    </Flex>
                  </Flex>
                );
              })}
            </Stack>
          )}
        </Stack>
        <Stack mt={10} direction={'row'} alignItems={'center'}>
          <LuShare2 size={24} />
          <Text fontWeight={'bold'} ms={2}>
            Acciones
          </Text>
        </Stack>
        <CopyModal
          isOpen={isCopyModalOpen}
          onClose={onCopyModalClose}
          settlements={finalSettlements}
        />
        <SimpleGrid mt={5} gap={4} columns={[2, 3]}>
          <Button
            colorScheme={'blue'}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            h={'full'}
            py={4}
            gap={2}
            onClick={onCopyModalOpen}
          >
            <LuClipboard size={24} />
            <Text fontSize={'sm'}>Copiar Información</Text>
          </Button>
          <Button
            colorScheme={'blue'}
            display={'flex'}
            flexDir={'column'}
            h={'full'}
            gap={2}
            disabled
            _hover={{
              bgColor: cardHoverBgColor,
            }}
          >
            <LuMail size={24} />
            <Text fontSize={'sm'} w={'100%'} whiteSpace={'pre-wrap'}>
              Enviar mails (próximamente)
            </Text>
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
