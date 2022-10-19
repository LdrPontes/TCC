import { Button, Text, chakra, Box, HStack, Select } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import GraphDBRepository from '../app/data/repositories/GraphDBRepository';
import { OntologyClass } from '../app/domain/models/OntologyClass';
import { Property } from '../app/domain/models/Property';
import { Triple } from '../app/domain/models/Triple';
import search from "../assets/search.svg"
import { ontologyPrefix } from '../constants/ontology';

export interface SearchModalProps {
  subjects: OntologyClass[];
  onSearch: (triple: Triple) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ subjects, onSearch }: SearchModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countTriples, setCountTriples] = useState(1);
  const [triplesSearch, setTriples] = useState<Triple[]>([]);
  const [properties, setProperties] = useState<Property[][]>([]);
  const [values, setValues] = useState<Property[][]>([]);

  // const [, setTriples] = useState([]);


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

  const handleSubjectChanged = async (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTriples = [...triplesSearch];
    if(newTriples[index]) {
      newTriples[index].subject = event.target.value;
    } else {
      newTriples.push({ subject: event.target.value, predicate: "", object: "" });
    }
   
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
    setTriples(newTriples);
  }


  const searchModal = useMemo(() => {
    const triples = [];

    for (let i = 0; i < countTriples; i++) {
      triples.push(<HStack flex={1} height={50} marginBottom={1}>
        <Select placeholder='What' width={200} height={45} backgroundColor="gray.200" borderRadius={10} onChange={(event) => handleSubjectChanged(i, event)}>
          {subjects.map(e => <option value={e.fullName}>{e.name}</option>)}
        </Select>
        <Select placeholder='Action' width={200} height={45} backgroundColor="gray.200" borderRadius={10} marginLeft={12} onChange={(event) => handlePropertyChanged(i, event)}>
          {properties[i]?.map(e => <option value={e.fullName}>{e.fullName.replace(ontologyPrefix, '')}</option>)}
        </Select>
        <Select placeholder='Target' width={200} height={45} backgroundColor="gray.200" borderRadius={10} marginLeft={12} onChange={(event) => handleValueChanged(i, event)}>
          {values[i]?.map(e => <option value={e.fullName}>{e.fullName.replace(ontologyPrefix, '')}</option>)}
        </Select>
        {/* {i === countTriples - 1 && <Button height={12} width={12} borderRadius={45} backgroundColor="teal.400" onClick={() => setCountTriples(old => old + 1)}>+</Button>} */}
      </HStack>);
    }
    return <Box padding={8} margin={8} borderRadius={10} position="absolute" backgroundColor="white" zIndex={999}>
      <Text fontWeight="bold" marginBottom={2}>Define Criteria</Text>
      {triples}
      <HStack width="100%" justifyContent="space-between" marginTop={10}>
        <Button borderRadius={45} disabled={triplesSearch.length === 0} onClick={() => onSearch(triplesSearch[0])}>Apply</Button>
        <Button borderRadius={45} onClick={closeModal}>Close</Button>
      </HStack>

    </Box>;
  }, [countTriples, subjects, properties, values]);


  return isOpen ? searchModal : button;
}

export default SearchModal;