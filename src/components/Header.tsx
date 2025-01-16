import ColorModeToggle from '@/ColorModeToggle';
import { Heading, IconButton, Stack } from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';
import { LuArrowLeft } from 'react-icons/lu';

type HeaderProps = {
  showBackButton: boolean;
  goBackScreen: () => void;
  goHome: () => void;
};

export default function Header({ showBackButton = false, goBackScreen, goHome }: HeaderProps) {
  const { borderColor } = useCustomColor();

  return (
    <Stack
      borderBottom={'1px'}
      pb={2}
      borderColor={borderColor}
      mt={4}
      direction={'row'}
      align={'center'}
      justify={'space-between'}
    >
      {showBackButton && (
        <IconButton
          aria-label={'Back'}
          icon={<LuArrowLeft size={28} />}
          variant={'ghost'}
          onClick={goBackScreen}
        />
      )}
      <Heading
        as={'h1'}
        size={'lg'}
        onClick={goHome}
        cursor={'pointer'}
        letterSpacing={'wide'}
        fontFamily={'poppins'}
      >
        Dividimos Cuentas
      </Heading>

      <ColorModeToggle />
    </Stack>
  );
}
