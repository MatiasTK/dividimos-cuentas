import { Link, Stack, useColorModeValue, Text } from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';

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
        Creado por
        <Link
          href="https://github.com/MatiasTK"
          isExternal
          fontWeight={'normal'}
          _hover={{
            color: linkHoverColor,
          }}
          display={'flex'}
          alignItems={'center'}
          gap={1}
        >
          <Text
            color={linkColor}
            _hover={{
              textDecoration: 'underline',
            }}
          >
            MatiasTK
          </Text>
          <LuExternalLink size={12} />
        </Link>
      </Text>
    </Stack>
  );
}
