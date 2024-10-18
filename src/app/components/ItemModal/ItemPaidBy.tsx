'use client';

import { Payer, Person } from '@/app/types';
import {
  Box,
  InputGroup,
  MenuItem,
  MenuList,
  Button,
  MenuButton,
  Menu,
  Stack,
  Input,
  InputLeftElement,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { FaChevronDown, FaTrash } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import { CREATOR_OFFSET } from '@/app/constants';

type props = {
  payers: Payer[];
  creator: Person;
  people: Person[];
  setPayers: (payers: Payer[]) => void;
};

export default function ItemPaidBy({ payers, creator, people, setPayers }: props) {
  const [currentPayers, setCurrentPayers] = useState<Payer[]>(payers);
  const currentItemPrice = useMemo(() => {
    return currentPayers.reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentPayers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPayers(currentPayers);
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentPayers]);

  const handleAddPaidBy = (person: Person) => {
    setCurrentPayers((prevPayers) => [...prevPayers, { person, amount: 0 }]);
  };

  const handleChangePaidByValue = (payer: Payer, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCurrentPayers((prevPayers) =>
      prevPayers.map((p) => {
        if (p.person.id === payer.person.id) {
          return { ...p, amount: value };
        }
        return p;
      })
    );
  };

  const removePaidBy = (payer: Payer) => {
    setCurrentPayers((prevPayers) => prevPayers.filter((p) => p.person.id !== payer.person.id));
  };

  return (
    <Box>
      <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Text mb={2}>Pagado por</Text>
        <Menu>
          {currentPayers.length !== people.length + CREATOR_OFFSET && (
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
          )}
          <MenuList backgroundColor={'#141414'} borderColor={'whiteAlpha.300'}>
            {!currentPayers.some((payer) => payer.person.id === creator.id) && (
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
              if (currentPayers.some((payer) => payer.person.id === person.id)) {
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
      {currentPayers.length === 0 && (
        <Text textAlign={'center'} fontSize={'sm'} color={'whiteAlpha.600'}>
          Todavia no se ha seleccionado nadie, prueba agregando uno!
        </Text>
      )}
      <Stack flexDir={'row'} gap={2} flexWrap={'wrap'}>
        {currentPayers.map((payer) => (
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
                  value={payer.amount || ''}
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
    </Box>
  );
}
