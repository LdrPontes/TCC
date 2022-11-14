import { Input } from '@chakra-ui/react';
import React from 'react';

type CustomInputProps = {
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, onChange, value }) => {
  return <Input defaultValue={undefined} value={value} placeholder={placeholder} borderRadius={45} focusBorderColor="teal.400" errorBorderColor="red.400" onChange={(e) => onChange?.(e.target.value)} onEmptied={() => onChange?.('')}/>;
}

export default CustomInput;