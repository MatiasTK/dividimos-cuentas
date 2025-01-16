import { Avatar, Box, Circle, Flex, Stack, Text } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import { LuReceiptText } from 'react-icons/lu';

type debtsSectionProps = {
  finalSettlements: { from: string; to: string; amount: number }[];
};

export default function DebtsSection({ finalSettlements }: debtsSectionProps) {
  const { currentEvent } = useEvent();

  const { grayText, cardBgColor, circleBgColor, scrollBarThumbColor } = useCustomColor();

  return (
    <>
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
                  py={4}
                  px={4}
                  mr={2}
                  borderRadius="lg"
                  bg={cardBgColor}
                >
                  <Flex alignItems={'center'} flex="1">
                    <Box mr={1} fontWeight={'bold'}>
                      <Avatar name={settlement.from} size={'xs'} /> {settlement.from}
                    </Box>
                    <Flex>
                      debe
                      <Text
                        letterSpacing={'tighter'}
                        backgroundColor={'red.200'}
                        borderRadius={'full'}
                        px={2}
                        mx={1}
                        color={'white'}
                      >
                        ${settlement.amount}
                      </Text>
                      a
                    </Flex>
                    <Box ml={2} fontWeight={'bold'}>
                      <Avatar name={settlement.to} size={'xs'} /> {settlement.to}
                    </Box>
                  </Flex>
                </Flex>
              );
            })}
          </Stack>
        )}
      </Stack>
    </>
  );
}
