import { Link, Stack, useColorModeValue, Text } from '@chakra-ui/react';
import { LuHeart } from 'react-icons/lu';

export default function Footer() {
  const textColor = useColorModeValue('gray.500', 'whiteAlpha.500');
  const linkColor = useColorModeValue('blue.500', 'white');
  const linkHoverColor = useColorModeValue('blue.600', 'whiteAlpha.700');

  return (
    <Stack mt={10} mb={4}>
      <Text
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        fontSize={'sm'}
        color={textColor}
        gap={1}
      >
        Hecha con <LuHeart color="red" size={16} /> por{' '}
        <Link
          href="https://github.com/MatiasTK"
          isExternal
          color={linkColor}
          fontWeight={'normal'}
          _hover={{
            color: linkHoverColor,
          }}
        >
          MatiasTK
        </Link>
      </Text>
    </Stack>
  );
}
