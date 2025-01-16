import { Box, Heading } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';

export default function CreateEventHeader() {
  const { h2Color } = useCustomColor();

  return (
    <Box mt={6} mb={4}>
      <Heading
        as={'h2'}
        fontSize={'lg'}
        color={h2Color}
        lineHeight={1.4}
        letterSpacing={'tight'}
        fontFamily={'poppins'}
      >
        Divide cuentas con amigos de forma sencilla
      </Heading>
    </Box>
  );
}
