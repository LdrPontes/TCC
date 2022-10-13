import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({ components: { Button: { baseStyle: { _focus: { boxShadow: 'none' } } } } })