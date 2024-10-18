'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Divider,
  Alert,
  AlertDescription,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Item, Payer, Person, SplitMember } from '../../types';
import ItemDescription from './ItemDescription';
import ItemPaidBy from './ItemPaidBy';
import ItemSharedBetween from './ItemSharedBetween';

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
  isEdit: boolean;
  editItemInfo: Item;
  editItem: (
    itemId: string,
    itemDescription: string,
    itemPrice: number,
    itemPaidBy: Payer[],
    itemSharedBetween: SplitMember[]
  ) => void;
};

type ItemInfo = {
  description: string;
  price: number;
  paidBy: Payer[];
  sharedBetween: SplitMember[];
};

export default function ItemModal({
  isOpen,
  onClose,
  creator,
  people,
  addItem,
  isEdit,
  editItemInfo,
  editItem,
}: props) {
  const [itemInfo, setItemInfo] = useState<ItemInfo>({
    description: '',
    price: 0,
    paidBy: [],
    sharedBetween: [],
  });
  const [error, setError] = useState({
    status: false,
    message: '',
  });
  const toast = useToast();

  const handleChangeItemDescription = (description: string) => {
    setItemInfo({ ...itemInfo, description });
  };

  const handleChangeItemPaidBy = (paidBy: Payer[]) => {
    const newPrice = paidBy.reduce((acc, curr) => acc + curr.amount, 0);
    setItemInfo({ ...itemInfo, price: newPrice, paidBy });
  };

  const handleChangeItemSharedBetween = (sharedBetween: SplitMember[]) => {
    setItemInfo({ ...itemInfo, sharedBetween });
  };

  useEffect(() => {
    if (isEdit) {
      setItemInfo({
        description: editItemInfo.description,
        price: editItemInfo.price,
        paidBy: editItemInfo.paidBy,
        sharedBetween: editItemInfo.sharedBetween,
      });
    }
  }, [isEdit]);

  useEffect(() => {
    setError({
      status: false,
      message: '',
    });
  }, [itemInfo]);

  const resetItemInfo = () => {
    setItemInfo({
      description: '',
      price: 0,
      paidBy: [],
      sharedBetween: [],
    });
  };

  const closeModal = () => {
    onClose();
    resetItemInfo();
    setError({
      status: false,
      message: '',
    });
  };

  const handleSubmit = () => {
    if (itemInfo.description === '') {
      setError({
        status: true,
        message: 'La descripción del item es requerida.',
      });
      return;
    }

    if (itemInfo.price <= 0) {
      setError({
        status: true,
        message: 'El precio del item es invalido. Ingresa participantes que pagaron y su monto.',
      });
      return;
    }

    if (itemInfo.paidBy.length === 0) {
      setError({
        status: true,
        message: 'Debes seleccionar al menos una persona que haya pagado por el item.',
      });
      return;
    }

    let totalPaidBy = 0;
    itemInfo.paidBy.forEach((payer: Payer) => {
      if (payer.amount <= 0) {
        setError({
          status: true,
          message: 'El valor pagado por ' + payer.person.name + ' es invalido.',
        });
        return;
      }
      totalPaidBy += payer.amount;
    });

    if (totalPaidBy !== itemInfo.price) {
      setError({
        status: true,
        message: 'El total pagado por los participantes no es igual al precio del item.',
      });
      return;
    }

    const totalShared = itemInfo.sharedBetween.reduce((acc, curr) => acc + curr.splitAmount, 0);
    console.log(totalShared);
    if (totalShared > itemInfo.price) {
      setError({
        status: true,
        message: `Demasiadas contribuciones. Necesitas $${Math.abs(
          totalShared - itemInfo.price
        ).toFixed(2)} menos. `,
      });
      return;
    } else if (totalShared < itemInfo.price) {
      setError({
        status: true,
        message: `Faltan contribuciones. Necesitas $${Math.abs(
          totalShared - itemInfo.price
        ).toFixed(
          2
        )} más. Comprueba que todos los participantes estén incluidos y que la suma de los valores sea igual al precio del item.`,
      });
      return;
    }

    closeModal();
    if (isEdit) {
      editItem(
        editItemInfo.id,
        itemInfo.description,
        itemInfo.price,
        itemInfo.paidBy,
        itemInfo.sharedBetween
      );
    } else {
      addItem(itemInfo.description, itemInfo.price, itemInfo.paidBy, itemInfo.sharedBetween);
    }
  };

  const calculateInitialSharedMembers = () => {
    if (itemInfo.sharedBetween.length === 0) {
      const unifiedMembers = [creator, ...people];
      const sharedMembers = unifiedMembers.map((member) => ({
        splitAmount: itemInfo.price / people.length,
        person: member,
        splitMethod: 'equally' as const,
        isIncluded: true,
        porcentalValue: 0,
        manuallyValue: 0,
      }));
      return sharedMembers;
    }
    return itemInfo.sharedBetween;
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
        <ModalHeader>{isEdit ? 'Editar Item' : 'Crear Item'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={4}>
            <ItemDescription
              description={itemInfo.description}
              setDescription={(description) => handleChangeItemDescription(description)}
            />
            <Divider borderColor={'whiteAlpha.300'} />
            <ItemPaidBy
              payers={itemInfo.paidBy}
              creator={creator}
              people={people}
              setPayers={(payers) => handleChangeItemPaidBy(payers)}
            />
            <Divider borderColor={'whiteAlpha.300'} />
            <ItemSharedBetween
              members={calculateInitialSharedMembers()}
              price={itemInfo.price}
              setSharedMembers={(members) => handleChangeItemSharedBetween(members)}
              toast={toast}
            />
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
            {isEdit ? 'Editar' : 'Agregar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
