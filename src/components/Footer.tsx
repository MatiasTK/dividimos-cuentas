import { Link, Stack, Text } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';
import { LuExternalLink } from 'react-icons/lu';

export default function Footer() {
  const { textColor, linkColor, linkHoverColor } = useCustomColor();

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
            as={'span'}
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
