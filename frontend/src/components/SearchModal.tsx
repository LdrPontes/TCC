import { Button, Text, chakra, Box, HStack, Select } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import search from "../assets/search.svg"

const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countTriples, setCountTriples] = useState(1);

  const button = useMemo(() => {
    return <Button padding={8} margin={8} borderRadius={45} position="absolute" zIndex={999} onClick={() => setIsOpen(true)}>
      <chakra.img src={search} />
      <Text>Perform Search</Text>
    </Button>;
  }, [setIsOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setCountTriples(1);
  }

  const searchModal = useMemo(() => {
    const triples = [];

    for (let i = 0; i < countTriples; i++) {
      triples.push(<HStack flex={1} height={50} marginBottom={1}>
        <Select placeholder='Select option' width={125} height={45} backgroundColor="gray.200" borderRadius={10}>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
        <Select placeholder='Select option' width={125} height={45} backgroundColor="gray.200" borderRadius={10} marginLeft={12}>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
        <Select placeholder='Select option' width={125} height={45} backgroundColor="gray.200" borderRadius={10} marginLeft={12}>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
        {i === countTriples - 1 && <Button height={12} width={12} borderRadius={45} backgroundColor="teal.400" onClick={() => setCountTriples(old => old + 1)}>+</Button>}
      </HStack>);
    }
    return <Box padding={8} margin={8} borderRadius={10} position="absolute" backgroundColor="white" zIndex={999}>
      <Text fontWeight="bold" marginBottom={2}>Define Criteria</Text>
      {triples}
      <HStack width="100%" justifyContent="space-between" marginTop={10}>
      <Button borderRadius={45} onClick={closeModal}>Apply</Button>
      <Button borderRadius={45} onClick={closeModal}>Close</Button>
      </HStack>
    
    </Box>;
  }, [countTriples]);


  return isOpen ? searchModal : button;
}

export default SearchModal;