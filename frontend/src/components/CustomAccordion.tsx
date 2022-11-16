import React from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Checkbox, HStack, Text } from '@chakra-ui/react';


export type AccordionProps = {
  items: AccordionItemModel[];
  onClick: (id: string) => void;
}

export type AccordionItemModel = {
  id: string;
  title: string;
  isSelected: boolean;
  children: AccordionItemModel[];
}

const CustomAccordion: React.FC<AccordionProps> = ({ items, onClick }) => {
  const buildButton = (id: string, title: string, showIcon: boolean, isChecked: boolean) => {
    return <AccordionButton backgroundColor="gray.100" borderRadius={30} onClick={() => {
      if (!showIcon) {
        console.log('click', id);
        onClick(id)
      };
    }} >
      <HStack justifyContent="space-between" flex="1">
        <HStack>
          <Checkbox outline="none" colorScheme="teal" isDisabled isChecked={isChecked} />
          <Text fontSize="xs" fontWeight="bold">
            {title}
          </Text>
        </HStack>
        {showIcon && <AccordionIcon />}
      </HStack>
    </AccordionButton>
  };

  const BuildItems = (accordionItems: AccordionItemModel[]) => {
    return accordionItems.map((item, index) => {
      return <AccordionItem key={`${item.id}${index}`} id={item.id} border="none" marginBottom={1}>
        {buildButton(item.id, item.title, item.children.length > 0, item.isSelected)}

        {item.children.length > 0 && <AccordionPanel key={`${item.id}${index}`} paddingLeft={4} paddingRight={1}>
          {BuildItems(item.children)}
        </AccordionPanel>}
      </AccordionItem>
    });
  };


  return <Box width="100%">
    <Accordion allowMultiple>
      {items.map((item, index) => {
        return <AccordionItem key={`${item.id}${index}`} id={item.id} border="none" marginBottom={2}>
          {buildButton(item.id, item.title, item.children.length > 0, item.isSelected)}

          {item.children.length > 0 && <AccordionPanel key={`${item.id}${index}`} paddingLeft={4} paddingRight={1}>
            {BuildItems(item.children)}
          </AccordionPanel>}
        </AccordionItem>
      })}
    </Accordion>
  </Box>;
}

export default CustomAccordion;