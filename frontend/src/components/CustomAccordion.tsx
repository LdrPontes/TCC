import React from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Checkbox, HStack, Text } from '@chakra-ui/react';


export type AccordionProps = {
  items: AccordionItemModel[];
}

export type AccordionItemModel = {
  id: string;
  title: string;
  isSelected: boolean;
  children: AccordionItemModel[];
}

const CustomAccordion: React.FC<AccordionProps> = ({ items }) => {
  const buildButton = (title: string, showIcon: boolean) => {
    return <AccordionButton backgroundColor="gray.100" borderRadius={30}>
      <HStack justifyContent="space-between" flex="1">
        <HStack>
          <Checkbox outline="none" colorScheme="teal" />
          <Text fontSize="xs" fontWeight="bold">
            {title}
          </Text>
        </HStack>
        {showIcon && <AccordionIcon />}
      </HStack>
    </AccordionButton>
  };

  const BuildItems = (accordionItems: AccordionItemModel[]) => {
    return accordionItems.map(item => {
      return <AccordionItem id={item.id} border="none" marginBottom={1}>
        {buildButton(item.title, item.children.length > 0)}

        {item.children.length > 0 && <AccordionPanel paddingLeft={4} paddingRight={1}>
          {BuildItems(item.children)}
        </AccordionPanel>}
      </AccordionItem>
    });
  };


  return <Box width="100%">
    <Accordion allowMultiple>
      {items.map(item => {
        return <AccordionItem id={item.id} border="none" marginBottom={2}>
          {buildButton(item.title, item.children.length > 0)}

          {item.children.length > 0 && <AccordionPanel paddingLeft={4} paddingRight={1}>
            {BuildItems(item.children)}
          </AccordionPanel>}
        </AccordionItem>
      })}
    </Accordion>
  </Box>;
}

export default CustomAccordion;