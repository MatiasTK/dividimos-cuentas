import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Circle,
  Flex,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import DeleteDialog from '@components/DeleteDialog';
import ItemModal from '@components/ItemModal/ItemModal';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import { calculateItemSplit } from '@lib/calculateBills';
import { Item } from '@types';
import { useState } from 'react';
import { LuPackage, LuPackagePlus, LuSquarePen, LuTrash2 } from 'react-icons/lu';

export default function ItemsSection() {
  const { currentEvent, deleteItem } = useEvent();
  const [selectedItem, setSelectedItem] = useState<Item>();

  const {
    isOpen: isItemModalOpen,
    onOpen: onItemModalOpen,
    onClose: onItemModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteItemDialogOpen,
    onOpen: onDeleteItemDialogOpen,
    onClose: onDeleteItemDialogClose,
  } = useDisclosure();

  const { grayText, cardBgColor, cardHoverBgColor, circleBgColor } = useCustomColor();

  return (
    <>
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
      <Stack
        mt={5}
        mb={{
          base: 10,
          md: 5,
        }}
      >
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
            ¿Estás seguro de que deseas eliminar el ítem
            <strong>{selectedItem?.description}</strong>? Esta acción no se puede deshacer.
          </Text>
        </DeleteDialog>
      </Stack>
    </>
  );
}
