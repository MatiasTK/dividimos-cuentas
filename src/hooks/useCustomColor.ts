import { useColorModeValue } from '@chakra-ui/react';

export default function useCustomColor() {
  return {
    dividerColor: useColorModeValue('gray.400', 'whiteAlpha.300'),
    dividerTextColor: useColorModeValue('gray.500', 'gray'),
    dividerTextBgColor: useColorModeValue('gray.50', '#141414'),
    pastEventDateColor: useColorModeValue('blue.500', 'white'),
    pastEventH3Color: useColorModeValue('blue.600', 'white'),
    textColor: useColorModeValue('gray.500', 'whiteAlpha.500'),
    linkColor: useColorModeValue('blue.500', 'white'),
    linkHoverColor: useColorModeValue('blue.600', 'whiteAlpha.700'),
    borderColor: useColorModeValue('blackAlpha.300', 'whiteAlpha.300'),
    menuItemColor: useColorModeValue('gray.500', 'whiteAlpha.500'),
    cardBgColor: useColorModeValue('gray.100', 'whiteAlpha.200'),
    footerBackBtnColor: useColorModeValue('blackAlpha.700', 'whiteAlpha.700'),
    completedIconColor: useColorModeValue('white', 'black'),
    h2Color: useColorModeValue('blackAlpha.600', 'gray'),
    cardHoverBgColor: useColorModeValue('gray.300', 'whiteAlpha.300'),
    circleBgColor: useColorModeValue('blue.500', 'whiteAlpha.300'),
    grayText: useColorModeValue('gray.500', 'whiteAlpha.500'),
    scrollBarThumbColor: useColorModeValue(
      'var(--chakra-colors-gray-300)',
      'var(--chakra-colors-whiteAlpha-400)'
    ),
    avatarColor: useColorModeValue('whiteAlpha.900', 'white'),
  };
}
