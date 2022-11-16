import React from 'react';
import {
  Spacer,
  VStack,
  Text,
} from '@chakra-ui/react';
import CustomAccordion, { AccordionItemModel } from './CustomAccordion';

export type CustomDrawerProps = {
  items: AccordionItemModel[];
  onClick: (id: string) => void;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ items, onClick }) => {
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
        <Spacer height={8} />
        <CustomAccordion items={items} onClick={onClick}/>
      </VStack>
    </VStack>
  );

}

export default CustomDrawer;