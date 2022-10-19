import * as React from "react";
import {
  ChakraProvider,
  Box,
} from "@chakra-ui/react";
import CustomDrawer from "../../components/CustomDrawer";
import { theme } from "../../constants/theme";
import Maps, { MarkerProps, PolylineProps } from "../../components/Maps";
import { OntologyClass } from "../domain/models/OntologyClass";
import { AccordionItemModel } from "../../components/CustomAccordion";
import SearchModal from "../../components/SearchModal";
import GraphDBRepository from "../data/repositories/GraphDBRepository";
import { Instance } from "../domain/models/Instance";
import { ontologyPrefix } from "../../constants/ontology";
import { mapEntityToImage } from "../../constants/images";

const mapInstanceToDrawerItem = (instances: Instance[]): AccordionItemModel[] => {
  const drawerItems: AccordionItemModel[] = []

  instances?.forEach((item: Instance, index) => {
    const hasName = item.properties.get(`${ontologyPrefix}hasName`);
    const title: string = Array.isArray(hasName) ? hasName[0] ?? item.fullName.replace(ontologyPrefix, "") : hasName?.toString() ?? item.fullName.replace(ontologyPrefix, "")
    const result = {
      id: item.fullName,
      title: title,
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
    if (item.children.length > 0) {
      const result = {
        id: item.fullName,
        title: item.name,
        isSelected: false,
        children: mapOntologyToDrawerItem(item.children),
      };

      drawerItems.push(result);
    } else if ((item.instances?.length ?? 0) > 0) {
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
  const [markers, setMarkers] = React.useState<MarkerProps[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [lines, setLines] = React.useState<PolylineProps[]>([]);

  React.useEffect(() => {
    const getOntologyClassData = async (ontology: OntologyClass) => {
      if (ontology.children.length > 0) {
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

      const ontology = response.map(async element => {
        return await getOntologyClassData(element);
      });

      Promise.all(ontology).then((result) => {

        setOntology(result);
      });
    }

    getOntology();
  }, []);

  React.useEffect(() => {
    const getBusMarkers = async () => {
      const getInstanceAddress = async (ontology: OntologyClass[]) => {
        for (let i = 0; i < ontology.length; i++) {
          const item = ontology[i];
          if (item.children.length > 0) {
            await getInstanceAddress(item.children);
          } else {
            for (let i = 0; i < item.instances!.length; i++) {
              const instance = item.instances![i];
              const address = JSON.parse(instance.properties.get(`${ontologyPrefix}hasLatLng`) as string);

              try {
                setMarkers((prev) => [{
                  id: instance.fullName,
                  iconUrl: mapEntityToImage(item.name),
                  lat: parseFloat(address['LAT']),
                  lng: parseFloat(address['LON']),
                }, ...prev,]);
              } catch (err) {
              }
            }

          }
        }
      };

      if (ontology) {
        const accessPoints = ontology?.filter((item: OntologyClass) => item.name.includes('Access_Point'));

        for (let i = 0; i < accessPoints!.length; i++) {
          const item = accessPoints![i];
          if (item.children.length > 0) {
            await getInstanceAddress(item.children);
          } else {
            await getInstanceAddress([item]);
          }
        }

        setLoading(false);
      }


    };
    getBusMarkers();
  }, [ontology]);

  React.useEffect(() => {
    const getMarkers = async () => {
      const addresses = ontology?.filter((item: OntologyClass) => item.name.includes('Address'))[0].instances;

      const getInstanceAddress = async (ontology: OntologyClass[]) => {
        for (let i = 0; i < ontology.length; i++) {
          const item = ontology[i];
          if (item.children.length > 0) {
            await getInstanceAddress(item.children);
          } else {
            for (let i = 0; i < item.instances!.length; i++) {
              const instance = item.instances![i];
              try {
                const address = instance.properties.get(`${ontologyPrefix}isLocated`) as string;
                const addressProps = addresses?.filter((item: Instance) => item.fullName === address)[0].properties;
                const response = JSON.parse(addressProps!.get(`${ontologyPrefix}hasLatLng`) as string);

                setMarkers((prev) => [...prev, {
                  id: instance.fullName,
                  iconUrl: mapEntityToImage(item.name),
                  lat: parseFloat(response['LAT']),
                  lng: parseFloat(response['LON']),
                },]);
              } catch (err) {
                // console.log(err);
              }

            }

          }
        }
      };

      if (ontology) {
        for (let i = 0; i < ontology!.length; i++) {
          const item = ontology![i];
          if (item.children.length > 0) {
            await getInstanceAddress(item.children);
          } else {
            await getInstanceAddress([item]);
          }
        }
      }


    };
    getMarkers();
  }, [ontology]);

  // React.useEffect(() => {
  //   const getLines = async () => {
  //     const getLine = async (ontology: OntologyClass[]) => {
  //       for (let i = 0; i < ontology.length; i++) {
  //         const item = ontology[i];
  //         if (item.children.length > 0) {
  //           await getLine(item.children);
  //         } else {
  //           for (let i = 0; i < item.instances!.length; i++) {
  //             const instance = item.instances![i];
  //             const line = instance.properties.get(`${ontologyPrefix}isNearAccessPoint`);

  //             if (Array.isArray(line)) {
  //               line.forEach((lineItem: string) => {
  //                 try {
  //                   const startMaker = markers.filter((item: MarkerProps) => item.id === instance.fullName)[0];
  //                   const endMaker = markers.filter((item: MarkerProps) => item.id === lineItem)[0];
  //                   const resultLine = { start: { lat: startMaker.lat, lng: startMaker.lng }, end: { lat: endMaker.lat, lng: endMaker.lng } };
  //                   setLines((prev) => [...prev, resultLine]);
  //                 } catch (err) {
  //                   console.log(err);
  //                 }
  //               });

  //             } else {
  //               try {
  //                 const startMaker = markers.filter((item: MarkerProps) => item.id === instance.fullName)[0];
  //                 const endMaker = markers.filter((item: MarkerProps) => item.id === line)[0];
  //                 const resultLine = { start: { lat: startMaker.lat, lng: startMaker.lng }, end: { lat: endMaker.lat, lng: endMaker.lng } };
  //                 setLines((prev) => [...prev, resultLine]);
  //               } catch (err) {
  //                 console.log(err);
  //               }
  //             }

  //           }

  //         }
  //       }
  //     };

  //     if (ontology) {
  //       for (let i = 0; i < ontology!.length; i++) {
  //         const item = ontology![i];
  //         if (item.children.length > 0) {
  //           await getLine(item.children);
  //         } else {
  //           await getLine([item]);
  //         }
  //       }
  //     }
  //   };
  //   if (!isLoading)
  //     getLines();
  // }, [markers, ontology, isLoading]);

  const subjects = React.useMemo(() => {
    const subjects: OntologyClass[] = [];

    const getSubjectsChildren = (children: OntologyClass[]) => {
      for (let i = 0; i < children!.length; i++) {
        const item = children![i];
        if (item.children.length > 0) {
          getSubjectsChildren(item.children);
        } else {
          subjects.push(item)
        }
      }
    }

    if (ontology) {
      for (let i = 0; i < ontology!.length; i++) {
        const item = ontology![i];
        subjects.push(item);
        if (item.children.length > 0) {
          getSubjectsChildren(item.children);
        }
      }
    }

    return subjects;
  }, [ontology]);

  return (<ChakraProvider theme={theme}>
    <Box display='flex' flexDirection="row" width="100vw" height="100vh">
      {ontology && <CustomDrawer items={mapOntologyToDrawerItem(ontology)} />}
      <Box display="flex" width="100vw" height="100vh" position="relative">
        <SearchModal subjects={subjects} onSearch={(triple) => GraphDBRepository.searchByObjectProperties(triple)}/>
        {markers && <Maps markers={markers} lines={lines} />}
      </Box>

    </Box>
  </ChakraProvider>)
}
