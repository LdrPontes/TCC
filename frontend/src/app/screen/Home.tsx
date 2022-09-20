import * as React from "react"
import {
  ChakraProvider,
  Box,
} from "@chakra-ui/react"
import CustomDrawer from "../../components/CustomDrawer"
import { theme } from "../../constants/theme"
import Maps from "../../components/Maps"
import { OntologyClass } from "../domain/models/OntologyClass"
import { AccordionItemModel } from "../../components/CustomAccordion"
import SearchModal from "../../components/SearchModal"
import GraphDBRepository from "../data/repositories/GraphDBRepository"
import { Instance } from "../domain/models/Instance"
import { ontologyPrefix } from "../../constants/ontology"


const mapInstanceToDrawerItem = (instances: Instance[]): AccordionItemModel[] => {
  const drawerItems: AccordionItemModel[] = []

  instances?.forEach((item: Instance, index) => {
    const result = {
      id: item.fullName,
      title: item.fullName.replace(ontologyPrefix, ""),
      isSelected: false,
      children: [],
    };

    drawerItems.push(result);
  });

  return drawerItems;
};

const mapOntologyToDrawerItem = (ontologies: OntologyClass[]): AccordionItemModel[] => {
  const drawerItems: AccordionItemModel[] = []

  ontologies?.forEach((item: OntologyClass) => {
    if(item.children.length > 0) {
      const result = {
        id: item.fullName,
        title: item.name,
        isSelected: false,
        children: mapOntologyToDrawerItem(item.children),
      };

      drawerItems.push(result);
    } else if((item.instances?.length ?? 0) > 0) {
      const result = {
        id: item.fullName,
        title: item.name,
        isSelected: false,
        children: mapInstanceToDrawerItem(item.instances!),
      };

      drawerItems.push(result);
    }
  });

  return drawerItems;
}

export const App = () => {
  const [ontology, setOntology] = React.useState<OntologyClass[] | null>(null);

  React.useEffect(() => {
    const getOntologyClassData = async (ontology: OntologyClass) => {
      if(ontology.children.length > 0) {
        const children = ontology.children.map(async (item: OntologyClass) => 
          await getOntologyClassData(item)
        );

        ontology.children = await Promise.all(children);
      } else {
        const instances = await GraphDBRepository.getOntologyClassData(ontology.name);
        ontology.instances = instances;
      }

      return ontology;
    };

    const getOntology = async () => {
      const response = await GraphDBRepository.getOntology();

      const ontology = response.map(async element =>  {
        return await getOntologyClassData(element);
      });

      Promise.all(ontology).then((result) => {
        console.log(result);
        setOntology(result);
      });
    }

    getOntology();
  }, []);

  return (<ChakraProvider theme={theme}>
    <Box display='flex' flexDirection="row" width="100vw" height="100vh">
      {ontology && <CustomDrawer items={mapOntologyToDrawerItem(ontology)} />}
      <Box display="flex" width="100vw" height="100vh" position="relative">
        <SearchModal />
        <Maps />
      </Box>

    </Box>
  </ChakraProvider>)
}
