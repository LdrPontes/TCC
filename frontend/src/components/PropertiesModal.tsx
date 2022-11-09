import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, HStack, Text, VStack, Link, IconButton, chakra } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import GraphDBRepository from '../app/data/repositories/GraphDBRepository';
import { Instance } from '../app/domain/models/Instance';
import { ontologyPrefix } from '../constants/ontology';
import arrowback from "../assets/arrow_back.svg"
let propertiesModalStack: string[] = [];

export interface PropertiesModalProps {
  fullName: string;
}

const PropertiesModal: React.FC<PropertiesModalProps> = ({ fullName }) => {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [instanceTypes, setInstanceTypes] = useState<string[]>([]);

  const getInstance = useCallback(async (instanceFullName: string) => {
    const response = await GraphDBRepository.getInstanceData(instanceFullName);
    setInstance(response);
  }, []);

  const getInstanceTypes = useCallback(async (instanceFullName: string) => {
    const response = await GraphDBRepository.getInstanceTypes(instanceFullName);
    setInstanceTypes(response);
  }, []);

  useEffect(() => {
    getInstance(fullName);
    getInstanceTypes(fullName);
  }, [fullName, getInstance, getInstanceTypes]);

  useEffect(() => {
    propertiesModalStack = [];
  }, [fullName]);

  const getInstanceName = () => {
    if (instance) {
      const hasName = instance.properties.get(`${ontologyPrefix}hasName`);
      const title: string = Array.isArray(hasName) ? hasName[0] ?? instance.fullName.replace(ontologyPrefix, "") : hasName?.toString() ?? instance.fullName.replace(ontologyPrefix, "")
      return title;
    }

    return "";
  }

  const getDataProperties = () => {
    if (instance) {
      const dataProperties = Array.from(instance.properties.entries()).filter(([key, value]) => !value.toString().includes(ontologyPrefix) && !key.includes("hasLineLatLng") && !key.includes("hasLatLng"));
      return dataProperties;
    }

    return [];
  }

  const getObjectProperties = () => {
    if (instance) {
      const objProperties = Array.from(instance.properties.entries()).filter(([key, value]) => value.toString().includes(ontologyPrefix) && key.toString().includes(ontologyPrefix));
      return objProperties;
    }

    return [];
  }

  const handleLinkClick = (link: string) => {
    if (instance) propertiesModalStack.push(instance.fullName);
    getInstance(link);
    getInstanceTypes(link);
  }

  const handleBackClick = () => {
    const name = propertiesModalStack.pop()
    getInstance(name!);
    getInstanceTypes(name!);
  }


  return <Box width={'60vw'}>
    <HStack>
      {propertiesModalStack.length > 0 && <IconButton aria-label="Back" onClick={handleBackClick} icon={<chakra.img height="24px" src={arrowback} />}/>}
      <Text fontSize='md' flex={3} fontWeight="bold">{getInstanceName()}</Text>
      <Text fontSize='x-small' flex={1} fontWeight="bold">{`URI ${instance?.fullName}`}</Text>
    </HStack>
    <HStack alignItems="baseline">
      {instanceTypes.map((value) => <Text backgroundColor="gray.300" fontSize='x-small' borderRadius={30} padding={1} marginTop={2} marginRight={1} fontWeight="bold">{`${value.replace(ontologyPrefix, "")}`}</Text>)}
    </HStack>
    <VStack alignItems="start" marginTop={2}>
      <Text fontSize='small' fontWeight="bold">Properties</Text>
      {getDataProperties().map(([key, value]) => {
        return <HStack>
          <Text fontSize='small' fontWeight="bold">{`${key.replace(ontologyPrefix, "")}:`}</Text>
          <Text fontSize='small'>{value}</Text>
        </HStack>;
      })}
    </VStack>
    <VStack alignItems="start" marginTop={8}>
      <Text fontSize='small' fontWeight="bold">Actions</Text>
      <Accordion width="100%" allowMultiple>
        {getObjectProperties().map(([key, value]) => {
          return <AccordionItem border="none">
            <AccordionButton backgroundColor="gray.100" borderRadius={30} marginTop={1}>
              <Text fontSize="xs" fontWeight="bold">
                {key.replace(ontologyPrefix, "")}
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {Array.isArray(value) ? value.map((v) => {
                return <>
                  <HStack>
                    <Link fontSize='small' fontWeight="bold" onClick={() => handleLinkClick(v)}>{v}</Link>
                  </HStack>
                </>
              }) : <>
                <HStack>
                  <Link fontSize='small' fontWeight="bold" onClick={() => handleLinkClick(value)}>{value}</Link>
                </HStack>
              </>}
            </AccordionPanel>
          </AccordionItem>
        })}
      </Accordion>
    </VStack>
  </Box >;
}

export default PropertiesModal;