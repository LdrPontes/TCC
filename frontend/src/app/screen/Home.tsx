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
import { GraphDBRepository } from "../data/repositories/GraphDBRepository"


const mapOntologyToDrawerItem = (ontologies: OntologyClass[]): AccordionItemModel[] => {
  const drawerItems: AccordionItemModel[] = []

  ontologies?.forEach((item: OntologyClass) => {
    const result = {
      id: item.fullName,
      title: item.name,
      isSelected: false,
      children: mapOntologyToDrawerItem(item.children),
    };

    drawerItems.push(result);
  });

  return drawerItems;
}

export const App = () => {
  const [ontology, setOntology] = React.useState<OntologyClass[] | null>(null);

  React.useEffect(() => {
    const getOntology = async () => {
      const response = await new GraphDBRepository().getOntology();
      console.log(response);
      setOntology(response);
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
