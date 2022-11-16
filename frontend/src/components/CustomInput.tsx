import { HStack, Input, Select } from '@chakra-ui/react';
import React from 'react';

type CustomInputProps = {
  placeholder?: string;
  onChange?: (value: string, filter?: '<' | '>' | '<=' | '>=' | '!=' | '=') => void;
  valueFilter?: '<' | '>' | '<=' | '>=' | '!=' | '=';
  value?: string;
  isNumber?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, onChange, value, isNumber, valueFilter }) => {
  const [filterValue, setFilterValue] = React.useState<'<' | '>' | '<=' | '>=' | '!=' | '='>('=');
  const [inputValue, setInputValue] = React.useState<string>('');
  return <HStack width="100%">
    <Input
      defaultValue={undefined}
      value={value}
      placeholder={placeholder}
      borderRadius={45}
      focusBorderColor="teal.400"
      errorBorderColor="red.400"
      inputMode={isNumber ? 'numeric' : 'text'}
      onChange={(e) => { onChange?.(e.target.value); setInputValue(e.target.value) }}
      onEmptied={() => { onChange?.('');; setInputValue('') }} />
    {isNumber && <Select
      width="100px"
      height="42px"
      value={valueFilter ?? filterValue}
      backgroundColor="gray.200"
      borderRadius={10}
      onChange={(event) => {
        setFilterValue(event.target.value as '<' | '>' | '<=' | '>=' | '!=' | '=');
        onChange?.(inputValue, event.target.value as '<' | '>' | '<=' | '>=' | '!=' | '=');
      }}>
      <option value={'='}>{'='}</option>
      <option value={'<'}>{'<'}</option>
      <option value={'>'}>{'>'}</option>
      <option value={'<='}>{'<='}</option>
      <option value={'>='}>{'>='}</option>
      <option value={'!='}>{'!='}</option>
    </Select>}
  </HStack>;
}

export default CustomInput;