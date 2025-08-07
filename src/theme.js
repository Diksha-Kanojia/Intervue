import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      purple: '#7B61FF',
      gray: {
        text: '#6F767E',
        border: '#E4E4E4'
      }
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '12px',
      },
      variants: {
        primary: {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.primary',
            opacity: 0.9,
          },
        },
        secondary: {
          bg: 'brand.secondary',
          color: 'white',
          _hover: {
            bg: 'brand.secondary',
            opacity: 0.9,
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'brand.dark',
      },
    },
    Text: {
      baseStyle: {
        color: 'brand.gray',
      },
    },
  },
});

export default theme;
