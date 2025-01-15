import { IconButton, useColorMode } from '@chakra-ui/react';
import { LuMoon, LuSunMedium } from 'react-icons/lu';

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === 'light' ? <LuMoon size={28} /> : <LuSunMedium size={28} />}
      onClick={toggleColorMode}
      variant="ghost"
    />
  );
}
