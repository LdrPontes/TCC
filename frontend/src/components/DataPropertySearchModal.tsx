import { Box, Button, HStack, SimpleGrid, Tag, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useEffect } from 'react';
import GraphDBRepository from '../app/data/repositories/GraphDBRepository';
import { Triple } from '../app/domain/models/Triple';
import { ontologyPrefix } from '../constants/ontology';
import CustomInput from './CustomInput';

export interface DataPropertySearchModalProps {
  isOpen: boolean;
  classes: string[];
  onFilterApplied: (triple: Triple[]) => void;
}

const DataPropertySearchModal: React.FC<DataPropertySearchModalProps> = ({ isOpen, classes, onFilterApplied }) => {
  const [selectedClass, setSelectedClass] = React.useState<string>('');
  const [dataProperties, setDataProperties] = React.useState<string[]>([]);
  const [triplesSearch, setTriples] = React.useState<Triple[]>([]);


  const handleOnClassSelected = (className: string) => {
    setSelectedClass(className);
    GraphDBRepository.getDataPropertiesByName(className).then((data) => {
      setDataProperties(data.map((property) => property.fullName.replace(ontologyPrefix, '')).filter((property) => property !== 'hasLineLatLng' && property !== 'hasLatLng'));
    });
  }

  const handleTextChange = (predicate: string, value: string) => {
    const triple = triplesSearch.filter((triple) => triple.subject === selectedClass && triple.predicate === predicate);
    if (triple.length > 0) {
      if (value === '') {
        const newTriples = triplesSearch.filter((triple) => triple.subject !== selectedClass || triple.predicate !== predicate);
        setTriples(newTriples);
      } else {
        triple[0].object = value;
        setTriples([...triplesSearch]);
      }

    } else {
      if (value !== '') {
        setTriples([...triplesSearch, { subject: selectedClass, predicate: predicate, object: value }]);
      }
    }
  }
  
  return isOpen ?
    <VStack backgroundColor="white" zIndex={1} padding={8} borderRadius={10} width="100%" alignItems="start">
      <Text fontWeight="bold" marginBottom={2}>Filter by Data Properties</Text>
      <SimpleGrid minChildWidth='100px' spacing="8px" paddingX={2} backgroundColor="gray.100" borderRadius={10} width="100%">
        {classes.map((c) =>
          <Tag
            onClick={() => handleOnClassSelected(c)}
            width="fit-content"
            key={c}
            marginY={2}
            backgroundColor={selectedClass === c ? 'teal.400' : 'white'}
            marginX="2px"
            padding={3}
            userSelect="none"
            borderRadius={10}>
            {c.replace(ontologyPrefix, '')}
          </Tag>)
        }
      </SimpleGrid>
      {selectedClass !== '' && dataProperties.length > 0 &&
        <VStack width="100%" alignItems="start">
          {dataProperties.map((predicate) =>
            <CustomInput
              key={predicate}
              placeholder={predicate}
              value={triplesSearch.filter((triple) => triple.subject === selectedClass && triple.predicate === predicate)?.[0]?.object ?? ''}
              onChange={(value) => handleTextChange(predicate, value)} />)
          }
        </VStack>
      }
      <HStack width="100%" justifyContent="space-between" marginTop={10}>
        <Button borderRadius={45} onClick={() => onFilterApplied(triplesSearch)}>Filter & Search</Button>
        <Button borderRadius={45} backgroundColor="red.300" color="white" onClick={() => {
          setTriples([]);
          setDataProperties([]);
          setSelectedClass('');
        }}>Clear</Button>
      </HStack>
    </VStack> : <Box />;
}

export default DataPropertySearchModal;