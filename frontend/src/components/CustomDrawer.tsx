import React from 'react';
import {
  HStack,
  IconButton,
  Spacer,
  VStack,
  Text,
} from '@chakra-ui/react';
import CustomInput from './CustomInput';
import { RiFilter3Line } from 'react-icons/ri'
import CustomAccordion, { AccordionItemModel } from './CustomAccordion';

export type CustomDrawerProps = {
  items: AccordionItemModel[];
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ items }) => {
  return (
    <VStack alignContent="start" boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px" zIndex={1}>
      <Text fontSize='md' fontWeight="bold" marginTop={4}>Ontology</Text>
      <VStack
        overflowY="auto"
        padding={4}
        maxHeight="100vh" 
        flexGrow={0} 
        backgroundColor="white" 
        alignItems="start">
        <HStack>
          <CustomInput placeholder='Search' />
          <IconButton aria-label="Filter" outline="none" borderRadius="30" icon={<RiFilter3Line />} colorScheme="teal" />
        </HStack>
        <Spacer height={8} />
        <CustomAccordion items={items} />
      </VStack>
    </VStack>
  );

}

export default CustomDrawer;