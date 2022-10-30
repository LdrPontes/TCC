import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        }
      }
    },
    Select: {
      baseStyle: {
        field: {
          fontWeight: 'semibold',
        },
        icon: {
          fontSize: '2xl',
        },
      },
    },
  },
})