import * as React from "react"
import {
  ChakraProvider,
  Box,
} from "@chakra-ui/react"
import CustomDrawer from "../../components/CustomDrawer"
import { theme } from "../../constants/theme"
import Maps from "../../components/Maps"
import { MockOntologyRepository } from "../data/repositories/MockOntologyRepository"
import { OntologyClass } from "../domain/models/OntologyClass"
import { AccordionItemModel } from "../../components/CustomAccordion"


const mapOntologyToDrawerItem = (ontologies: OntologyClass[]): AccordionItemModel[] => {
  const drawerItems: AccordionItemModel[] = []

  ontologies?.forEach((item: OntologyClass) => {
    const result = {
      id: item.id,
      title: item.label,
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
      const response = await new MockOntologyRepository().getOntology();
      setOntology(response);
    }

    getOntology();
  }, []);

  return (<ChakraProvider theme={theme}>
    <Box display='flex' flexDirection="row" width="100vw" height="100vh">
      {ontology && <CustomDrawer items={mapOntologyToDrawerItem(ontology)} />}
      <Maps />
    </Box>
  </ChakraProvider>)
}
