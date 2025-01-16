import { Flex, Stack, Text } from '@chakra-ui/react';
import { LuDollarSign, LuEqual, LuPercent } from 'react-icons/lu';

export default function HelpToast() {
  return (
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
      <Flex alignItems={'center'} gap={2} borderRadius={'lg'} py={2} px={4} bgColor={'blue.500'}>
        <LuDollarSign size={20} />
        <Text>Divide el monto en una cantidad fija</Text>
      </Flex>
    </Stack>
  );
}
