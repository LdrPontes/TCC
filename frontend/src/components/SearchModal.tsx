import { Button, Text, chakra, Box, HStack, Select } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import GraphDBRepository from '../app/data/repositories/GraphDBRepository';
import { OntologyClass } from '../app/domain/models/OntologyClass';
import { Property } from '../app/domain/models/Property';
import { Triple } from '../app/domain/models/Triple';
import search from "../assets/search.svg"
import { getNextColor, resetColors } from '../constants/colors';
import { ontologyPrefix } from '../constants/ontology';

export interface SearchModalProps {
  subjects: OntologyClass[];
  onSearch: (triple: Triple[]) => void;
}

const colors: Map<string, string> = new Map();

const SearchModal: React.FC<SearchModalProps> = ({ subjects, onSearch }: SearchModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countTriples, setCountTriples] = useState(1);
  const [triplesSearch, setTriples] = useState<Triple[]>([]);
  const [properties, setProperties] = useState<Property[][]>([]);
  const [values, setValues] = useState<Property[][]>([]);

  const button = useMemo(() => {
    return <Button padding={8} margin={8} borderRadius={45} position="absolute" zIndex={999} onClick={() => setIsOpen(true)}>
      <chakra.img src={search} />
      <Text>Perform Search</Text>
    </Button>;
  }, [setIsOpen]);

  const closeModal = () => {
    setIsOpen(false);
    
  }

  const removeTriple = (index: number) => {
    const newTriples = [...triplesSearch];
    newTriples.splice(index , 1);
    setTriples(newTriples);

    const newProperties = [...properties];
    newProperties.splice(index, 1);
    setProperties(newProperties);

    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);

    setCountTriples(countTriples - 1);

  }

  const clearModal = () => {
    setTriples([]);
    setProperties([]);
    setValues([]);
    resetColors();
    setCountTriples(1);
  };

  const handleSubjectChanged = async (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTriples = [...triplesSearch];
    if (newTriples[index]) {
      newTriples[index].subject = event.target.value;
      newTriples[index].predicate = "";
      newTriples[index].object = "";
    } else {
      newTriples.push({ subject: event.target.value, predicate: "", object: "" });
    }

    colors.set(event.target.value, colors.get(event.target.value) ?? getNextColor());

    setTriples(newTriples);

    GraphDBRepository.getObjectPropertiesByName(event.target.value.replace(ontologyPrefix, '')).then((result) => {
      setProperties((prev) => {
        return [...prev.slice(0, index),
          result,
        ...prev.slice(index)];
      });
    });
  }

  const handlePropertyChanged = async (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTriples = [...triplesSearch];
    newTriples[index].predicate = event.target.value;
    newTriples[index].object = "";

    setTriples(newTriples);

    GraphDBRepository.getValueByProperty(event.target.value.replace(ontologyPrefix, '')).then((result) => {
      setValues((prev) => {
        return [...prev.slice(0, index),
          result,
        ...prev.slice(index)];
      });
    });
  }

  const handleValueChanged = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTriples = [...triplesSearch];
    newTriples[index].object = event.target.value;

    colors.set(event.target.value, colors.get(event.target.value) ?? getNextColor());

    setTriples(newTriples);
  }

  const searchModal = () => {
    const triples = [];
    for (let i = 0; i < countTriples; i++) {
      triples.push(<HStack flex={1} height={50} marginBottom={1}>
        <Select placeholder='What' color={triplesSearch[i] && triplesSearch[i].subject !== "" ?colors.get(triplesSearch[i].subject): 'black'} width={200} height={45} value={triplesSearch[i]?.subject ?? 'What'} backgroundColor="gray.200" borderRadius={10} onChange={(event) => handleSubjectChanged(i, event)}>
          {subjects.map(e => <option value={e.fullName}>{e.name}</option>)}
        </Select>
        <Select placeholder='Action' color={triplesSearch[i] && triplesSearch[i].predicate !== "" ? "blue.500" : 'black'} width={200} height={45} value={triplesSearch[i]?.predicate ?? 'Action'} backgroundColor="gray.200" borderRadius={10} marginLeft={12} onChange={(event) => handlePropertyChanged(i, event)}>
          {properties[i]?.map(e => <option value={e.fullName}>{e.fullName.replace(ontologyPrefix, '')}</option>)}
        </Select>
        <Select placeholder='Target' color={triplesSearch[i] && triplesSearch[i].object !== "" ?colors.get(triplesSearch[i].object): 'black'} width={200} height={45} value={triplesSearch[i]?.object ?? 'Target'} backgroundColor="gray.200" borderRadius={10} marginLeft={12} onChange={(event) => handleValueChanged(i, event)}>
          {values[i]?.map(e => <option value={e.fullName}>{e.fullName.replace(ontologyPrefix, '')}</option>)}
        </Select>
        {i !== 0 && <Button borderRadius={45} backgroundColor="transparent" onClick={() => removeTriple(i)}>X</Button>}
        {i === countTriples - 1 && <Button height={12} width={12} borderRadius={45} backgroundColor="teal.400" onClick={() => setCountTriples(old => old + 1)}>+</Button>}
      </HStack>);
    }
    return <Box padding={8} margin={8} borderRadius={10} position="absolute" backgroundColor="white" zIndex={999}>
      <HStack width="100%" justifyContent="space-between" marginBottom={10}>
        <Text fontWeight="bold" marginBottom={2}>Define Criteria</Text>
        <Button borderRadius={45} backgroundColor="transparent" onClick={closeModal}>X</Button>
      </HStack>
      {triples}
      <HStack width="100%" justifyContent="space-between" marginTop={10}>
        <Button borderRadius={45} disabled={triplesSearch.length === 0} onClick={() => onSearch(triplesSearch)}>Apply</Button>
        <Button borderRadius={45} backgroundColor="red.300" color="white" onClick={clearModal}>Clear</Button>
      </HStack>
    </Box>;
  }


  return isOpen ? searchModal() : button;
}

export default SearchModal;