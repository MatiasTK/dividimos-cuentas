import { Avatar, Box, Circle, Flex, IconButton, Stack, Tag, Text } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import { useState } from 'react';
import { LuCircle, LuCircleCheckBig, LuReceiptText } from 'react-icons/lu';

type debtsSectionProps = {
  finalSettlements: { from: string; to: string; amount: number }[];
};

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function DebtsSection({ finalSettlements }: debtsSectionProps) {
  const { currentEvent } = useEvent();
  const [debtsDone, setDebtsDone] = useState<string[]>([]);

  const { grayText, cardBgColor, circleBgColor, scrollBarThumbColor } = useCustomColor();

  const handleToggleDebtDone = (settlement: Settlement): void => {
    const id = `${settlement.from}-${settlement.to}`;
    if (debtsDone.includes(id)) {
      setDebtsDone(debtsDone.filter((debt) => debt !== id));
    } else {
      setDebtsDone([...debtsDone, id]);
    }
  };

  const { avatarColor } = useCustomColor();

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
      <Stack
        mt={5}
        mb={{
          base: 10,
          md: 5,
        }}
      >
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
                  <Flex alignItems={'center'} flex="1">
                    <Flex
                      mr={1}
                      fontWeight={'bold'}
                      alignItems={'center'}
                      gap={{
                        base: 2,
                        md: 1,
                      }}
                    >
                      <Avatar color={avatarColor} name={settlement.from} size={'xs'} />
                      <Text>{settlement.from}</Text>
                    </Flex>
                    <Flex>
                      debe
                      <Tag
                        letterSpacing={'tighter'}
                        backgroundColor={'red.200'}
                        px={2}
                        mx={1}
                        fontSize={'md'}
                        color={'white'}
                        fontFamily={'poppins'}
                      >
                        ${settlement.amount}
                      </Tag>
                      a
                    </Flex>
                    <Flex
                      ml={2}
                      fontWeight={'bold'}
                      alignItems={'center'}
                      gap={{
                        base: 2,
                        md: 1,
                      }}
                    >
                      <Avatar color={avatarColor} name={settlement.to} size={'xs'} />
                      <Text>{settlement.to}</Text>
                    </Flex>
                  </Flex>
                  <IconButton
                    aria-label="Marcar como pagado"
                    variant={'unstyled'}
                    onClick={() => handleToggleDebtDone(settlement)}
                    transition="all 0.2s ease-in-out"
                    _hover={{ transform: 'scale(1.1)' }}
                    sx={{
                      WebkitTapHighlightColor: 'transparent',
                      WebkitTouchCallout: 'none',
                      userSelect: 'none',
                    }}
                    mr={-4}
                    isRound
                    icon={
                      debtsDone.includes(`${settlement.from}-${settlement.to}`) ? (
                        <Box color={'blue.500'}>
                          <LuCircleCheckBig
                            size={24}
                            style={{ transition: 'color 0.2s ease-in-out' }}
                          />
                        </Box>
                      ) : (
                        <LuCircle size={24} style={{ transition: 'color 0.2s ease-in-out' }} />
                      )
                    }
                  />
                </Flex>
              );
            })}
          </Stack>
        )}
      </Stack>
    </>
  );
}
