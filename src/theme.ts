import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  shadows: {
    outline: '0 0 0 3px rgb(61, 194, 163, 0.6)',
  },
  colors: {
    //! I will replace blue because it's the default color scheme of Chakra UI
    blue: {
      '50': '#EFF5EF',
      '100': '#D3E3D3',
      '200': '#B7D2B7',
      '300': '#9CC09B',
      '400': '#80AE7F',
      '500': '#649D62',
      '600': '#507D4F',
      '700': '#3C5E3B',
      '800': '#283F27',
      '900': '#141F14',
    },
    red: {
      '200': '#fc5344',
      '300': '#ff5742',
    },
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      'html, body': {
        fontFamily: 'Inter Variable, sans-serif',
        bg: props.colorMode === 'light' ? 'gray.50' : '#141414',
      },
    }),
  },
  components: {
    Button: {
      variants: {
        solid: (props: { colorMode: string }) => ({
          bg: props.colorMode === 'light' ? 'blue.500' : '#222222',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'light' ? 'blue.600' : '#333333',
          },
          _active: {
            bg: props.colorMode === 'light' ? 'blue.700' : '#444444',
          },
          _focus: {
            ring: 2,
            ringColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
          },
        }),
        outline: (props: { colorMode: string }) => ({
          bg: 'transparent',
          color: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
          borderColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
          _hover: {
            bg: props.colorMode === 'light' ? 'blue.50' : 'whiteAlpha.100',
          },
          _active: {
            bg: props.colorMode === 'light' ? 'blue.100' : 'whiteAlpha.200',
          },
          _focus: {
            ring: 2,
            ringColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
          },
        }),
      },
    },
    Input: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            borderColor: props.colorMode === 'light' ? 'gray.300' : 'whiteAlpha.400',
            _hover: {
              borderColor: props.colorMode === 'light' ? 'gray.300' : 'whiteAlpha.400',
            },
            _focus: {
              borderColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
              ring: 1,
              outline: 'none',
              ringColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
            },
          },
        }),
      },
    },
    Modal: {
      baseStyle: (props: { colorMode: string }) => ({
        dialog: {
          bg: props.colorMode === 'light' ? 'white' : '#141414',
          color: props.colorMode === 'light' ? 'gray.800' : 'white',
        },
      }),
    },
    NumberInput: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            borderColor: props.colorMode === 'light' ? 'gray.300' : 'whiteAlpha.400',
            _hover: {
              borderColor: props.colorMode === 'light' ? 'gray.300' : 'whiteAlpha.400',
            },
            _focus: {
              borderColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
              ring: 1,
              outline: 'none',
              ringColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
            },
          },
        }),
      },
    },
    Menu: {
      baseStyle: (props: { colorMode: string }) => ({
        list: {
          bg: props.colorMode === 'light' ? 'white' : '#141414',
          color: props.colorMode === 'light' ? 'gray.800' : 'white',
        },
        item: {
          bg: props.colorMode === 'light' ? 'white' : '#141414',
          _hover: {
            bg: props.colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100',
          },
        },
      }),
    },
    Checkbox: {
      baseStyle: (props: { colorMode: string }) => ({
        control: {
          borderColor: props.colorMode === 'light' ? 'gray.400' : 'whiteAlpha.400',
          _checked: {
            bg: 'blue.500',
            borderColor: 'blue.500',
          },
        },
      }),
    },
    IconButton: {
      variants: {
        solid: (props: { colorMode: string }) => ({
          bg: props.colorMode === 'light' ? 'blue.500' : '#222222',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'light' ? 'blue.600' : '#333333',
          },
          _active: {
            bg: props.colorMode === 'light' ? 'blue.700' : '#444444',
          },
          _focus: {
            ring: 2,
            ringColor: props.colorMode === 'light' ? 'blue.500' : 'whiteAlpha.500',
          },
        }),
      },
    },
  },
});

export default theme;
