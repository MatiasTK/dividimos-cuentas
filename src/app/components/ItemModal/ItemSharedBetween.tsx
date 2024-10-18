'use client';

import { SplitMember } from '@/app/types';
import {
  Button,
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Text,
  Checkbox,
  Box,
  CheckboxGroup,
  UseToastOptions,
  ToastId,
} from '@chakra-ui/react';
import { FaDollarSign, FaEquals, FaPercentage, FaQuestionCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

type props = {
  members: SplitMember[];
  price: number;
  setSharedMembers: (members: SplitMember[]) => void;
  toast: (options?: UseToastOptions) => ToastId;
};

export default function ItemSharedBetween({ members, price, setSharedMembers, toast }: props) {
  const [itemSharedBetween, setItemSharedBetween] = useState<SplitMember[]>(members);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSharedMembers(itemSharedBetween);
    }, 500);
    return () => clearTimeout(timeout);
  }, [itemSharedBetween]);

  const updateSplitValues = (prevItemSharedBetween: SplitMember[]) => {
    let total = price;

    const newMembers = prevItemSharedBetween.map((member) => {
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

    setItemSharedBetween(newMembers);
  };

  useEffect(() => {
    updateSplitValues(itemSharedBetween);
  }, [price]);

  const changeSplitMethodEqually = (member: SplitMember) => {
    const newItemsSharedBetween = itemSharedBetween.map((m) => {
      if (m.person.id === member.person.id) {
        return { ...m, splitMethod: 'equally' as const, porcentalValue: 0, manuallyValue: 0 };
      }
      return m;
    });

    updateSplitValues(newItemsSharedBetween);
  };

  const changeSplitMethodPorcentually = (member: SplitMember) => {
    const newItemsSharedBetween = itemSharedBetween.map((m) => {
      if (m.person.id === member.person.id) {
        return { ...m, splitMethod: 'porcentually' as const, manuallyValue: 0 };
      }
      return m;
    });

    updateSplitValues(newItemsSharedBetween);
  };

  const changeSplitMethodManually = (member: SplitMember) => {
    const newItemsSharedBetween = itemSharedBetween.map((m) => {
      if (m.person.id === member.person.id) {
        return { ...m, splitMethod: 'manually' as const, porcentalValue: 0 };
      }
      return m;
    });

    updateSplitValues(newItemsSharedBetween);
  };

  const toggleMemberIncluded = (member: SplitMember) => {
    const newItemsSharedBetween = itemSharedBetween.map((m) => {
      if (m.person.id === member.person.id) {
        return { ...m, isIncluded: !m.isIncluded };
      }
      return m;
    });

    updateSplitValues(newItemsSharedBetween);
  };

  const handleChangePorcentally = (member: SplitMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const porcentalValue = Number(e.target.value);
    const newItemsSharedBetween = itemSharedBetween.map((m) => {
      if (m.person.id === member.person.id) {
        return { ...m, porcentalValue };
      }
      return m;
    });

    updateSplitValues(newItemsSharedBetween);
  };

  const handleChangeManually = (member: SplitMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const manuallyValue = Number(e.target.value);
    const newItemsSharedBetween = itemSharedBetween.map((m) => {
      if (m.person.id === member.person.id) {
        return { ...m, manuallyValue };
      }
      return m;
    });

    updateSplitValues(newItemsSharedBetween);
  };

  return (
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
        defaultValue={itemSharedBetween.filter((m) => m.isIncluded).map((m) => m.person.id)}
      >
        {itemSharedBetween.map((member) => (
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
                value={member.person.id}
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
                    member.splitMethod === 'porcentually' ? 'whiteAlpha.300' : 'whiteAlpha.100'
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
                  defaultValue={member.porcentalValue || 0}
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
                  defaultValue={member.manuallyValue || 0}
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
  );
}
