import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import formatDate from '@lib/formatDate';
import { LuCalendar } from 'react-icons/lu';

export default function EventHeader() {
  const { currentEvent } = useEvent();
  const { grayText } = useCustomColor();

  return (
    <Box>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Heading
          as={'h2'}
          fontWeight={'bold'}
          size={'md'}
          letterSpacing={'wide'}
          textAlign={'center'}
          fontFamily={'poppins'}
        >
          {currentEvent.name}
        </Heading>
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
  );
}
