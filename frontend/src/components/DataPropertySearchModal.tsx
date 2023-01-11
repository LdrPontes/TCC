import { Box, Button, HStack, SimpleGrid, Tag, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import GraphDBRepository from '../app/data/repositories/GraphDBRepository';
import { Property } from '../app/domain/models/Property';
import { Triple } from '../app/domain/models/Triple';
import { ontologyPrefix } from '../constants/ontology';
import CustomInput from './CustomInput';

export interface DataPropertySearchModalProps {
  isOpen: boolean;
  classes: string[];
  onFilterApplied: (triple: Triple[]) => void;
  handleCloseModal: () => void;
}

const DataPropertySearchModal: React.FC<DataPropertySearchModalProps> = ({ isOpen, classes, onFilterApplied, handleCloseModal }) => {
  const [selectedClass, setSelectedClass] = React.useState<string>('');
  const [dataProperties, setDataProperties] = React.useState<Property[]>([]);
  const [triplesSearch, setTriples] = React.useState<Triple[]>([]);


  const handleOnClassSelected = (className: string) => {
    setSelectedClass(className);
    GraphDBRepository.getDataPropertiesByName(className).then((data) => {
      setDataProperties(data.filter((property) => property.fullName.replace(ontologyPrefix, '') !== 'hasLineLatLng' && property.fullName.replace(ontologyPrefix, '') !== 'hasLatLng'));
    });
  }

  const handleTextChange = (predicate: string, value: string, filter?: '<' | '>' | '<=' | '>=' | '!=' | '=') => {
    const triple = triplesSearch.filter((triple) => triple.subject === selectedClass && triple.predicate === predicate);
    if (triple.length > 0) {
      if (value === '') {
        const newTriples = triplesSearch.filter((triple) => triple.subject !== selectedClass || triple.predicate !== predicate);
        setTriples(newTriples);
      } else {
        triple[0].object = value;
        triple[0].filter = filter ?? '=';
        setTriples([...triplesSearch]);
      }

    } else {
      if (value !== '') {
        setTriples([...triplesSearch, { subject: selectedClass, predicate: predicate, object: value, filter: filter ?? '=' }]);
      }
    }
  }

  useEffect(() => {
    console.log(triplesSearch);
  }, [triplesSearch]);

  return isOpen ?
    <VStack backgroundColor="white" zIndex={1} padding={8} borderRadius={10} width="100%" alignItems="start">
      <HStack width="100%" justifyContent="space-between" marginBottom={10}>
        <Text fontWeight="bold" marginBottom={2}>Filter</Text>
        <Button borderRadius={45} backgroundColor="transparent" onClick={handleCloseModal}>^</Button>
      </HStack>
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
          {
            dataProperties.map((predicate) =>
              <CustomInput
                key={predicate.fullName}
                placeholder={predicate.fullName.replace(ontologyPrefix, '')}
                isNumber={predicate.type?.includes('integer') || predicate.type?.includes('double')}
                value={triplesSearch.filter((triple) => triple.subject === selectedClass && triple.predicate === predicate.fullName.replace(ontologyPrefix, ''))?.[0]?.object ?? ''}
                valueFilter={triplesSearch.filter((triple) => triple.subject === selectedClass && triple.predicate === predicate.fullName.replace(ontologyPrefix, ''))?.[0]?.filter ?? '='}
                onChange={(value, filter) => handleTextChange(predicate.fullName.replace(ontologyPrefix, ''), value, filter)} />
            )
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