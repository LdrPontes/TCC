import { Input } from '@chakra-ui/react';
import React from 'react';

type CustomInputProps = {
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder }) => {
  return <Input placeholder={placeholder} borderRadius={45} focusBorderColor="teal.400" errorBorderColor="red.400"/>;
}

export default CustomInput;