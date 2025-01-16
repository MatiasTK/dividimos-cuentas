import { Box, Heading } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';

export default function AddOwnerHeader() {
  const { h2Color } = useCustomColor();

  return (
    <Box mt={6} mb={4}>
      <Heading
        as={'h2'}
        fontSize={'lg'}
        color={h2Color}
        fontWeight={'semibold'}
        lineHeight={1.4}
        letterSpacing={'wide'}
        fontFamily={'poppins'}
      >
        Ingresa tus datos antes de continuar
      </Heading>
    </Box>
  );
}
