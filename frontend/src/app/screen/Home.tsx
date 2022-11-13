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
import { Triple } from "../domain/models/Triple";
import { getInstanceByName } from "../../utils/ontology";
import { getNextColor, resetColors } from "../../constants/colors";
import PropertiesModal from "../../components/PropertiesModal";
import Modal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-30%, -50%)',
  },
};
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
  const [lines, setLines] = React.useState<PolylineProps[]>([]);
  const [selectedMarker, setSelectedMarker] = React.useState<string | null>(null);

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

  const handleSearch = async (triple: Triple[]) => {
    const triples = await GraphDBRepository.searchByObjectProperties(triple);
    const addresses = ontology?.filter((item: OntologyClass) => item.name.includes('Address'))[0].instances;
    setMarkers([]);
    setLines([]);
    resetColors();

    for(let i = 0; i < triples.length; i++) {
      const element = triples[i];
      if (ontology) {

        const subject = getInstanceByName({ name: 'topLevel', fullName: 'topLevel', children: ontology }, element.subject);
        const value = getInstanceByName({ name: 'topLevel', fullName: 'topLevel', children: ontology }, element.value);
        let subjectLatLng = null;
        let valueLatLng = null;

        if (subject && value) {
          if (subject.instance) {
            try {
              let subjectAddress = subject.instance?.properties.get(`${ontologyPrefix}isLocated`) as string;
              let latLng: { LAT: string, LON: string };
              if (subjectAddress) {
                const addressProps = addresses?.filter((item: Instance) => item.fullName === subjectAddress)[0].properties;
                latLng = JSON.parse(addressProps!.get(`${ontologyPrefix}hasLatLng`) as string);
              } else {
                latLng = JSON.parse(subject.instance?.properties.get(`${ontologyPrefix}hasLatLng`) as string);
              }

              subjectLatLng = latLng;
              setMarkers((prev) => [{
                id: subject.instance!.fullName,
                iconUrl: mapEntityToImage(subject.father),
                lat: parseFloat(latLng['LAT']),
                lng: parseFloat(latLng['LON']),
              }, ...prev,]);
            } catch (err) {
            }
          }

          if (value.instance) {
            try {
              let valueAddress = value.instance?.properties.get(`${ontologyPrefix}isLocated`) as string;
              let latLng: { LAT: string, LON: string };
              if (valueAddress) {
                const addressProps = addresses?.filter((item: Instance) => item.fullName === valueAddress)[0].properties;
                latLng = JSON.parse(addressProps!.get(`${ontologyPrefix}hasLatLng`) as string);
              } else {
                latLng = JSON.parse(value.instance?.properties.get(`${ontologyPrefix}hasLatLng`) as string);
              }
              valueLatLng = latLng;
              setMarkers((prev) => [{
                id: value.instance!.fullName,
                iconUrl: mapEntityToImage(value.father),
                lat: parseFloat(latLng['LAT']),
                lng: parseFloat(latLng['LON']),
              }, ...prev,]);
            } catch (err) {
            }
          }

          if (subject.instance?.properties.get(`${ontologyPrefix}hasLineLatLng`)) {
            const lineLatLng = JSON.parse(subject.instance.properties.get(`${ontologyPrefix}hasLineLatLng`) as string);
            const lines: PolylineProps[] = [];
            const color = getNextColor();
            for (let i = 1; i < lineLatLng.length; i++) {
              const line = lineLatLng[i];
              const lineLast = lineLatLng[i - 1];
              lines.push({
                start: { lat: parseFloat(lineLast['LAT']), lng: parseFloat(lineLast['LON']) }, end: { lat: parseFloat(line['LAT']), lng: parseFloat(line['LON']) }, color: color,
                id: subject.instance.fullName,
              });
            }

            setLines((prev) => [...prev, ...lines]);
          }

          if (value.instance?.properties.get(`${ontologyPrefix}hasLineLatLng`)) {
            const lineLatLng = JSON.parse(value.instance.properties.get(`${ontologyPrefix}hasLineLatLng`) as string);
            const lines: PolylineProps[] = [];
            const color = getNextColor();
            for (let i = 1; i < lineLatLng.length; i++) {
              const line = lineLatLng[i];
              const lineLast = lineLatLng[i - 1];

              lines.push({
                start: { lat: parseFloat(lineLast['LAT']), lng: parseFloat(lineLast['LON']) }, end: { lat: parseFloat(line['LAT']), lng: parseFloat(line['LON']) }, color: color,
                id: value.instance.fullName,
              });
            }

            setLines((prev) => [...prev, ...lines]);
          }

          if (subject.instance && value.instance && triple[0].predicate === `${ontologyPrefix}isNearAccessPoint`) {
            try {
              const resultLine = { start: { lat: parseFloat(subjectLatLng!['LAT']), lng: parseFloat(subjectLatLng!['LON']) }, end: { lat: parseFloat(valueLatLng!['LAT']), lng: parseFloat(valueLatLng!['LON']) }, id: "" };
              setLines((prev) => [...prev, resultLine]);
            } catch (err) {
              console.log(err);
            }
       
          }
        }
      }
    }

  }

  const handleMakerClick = (id: string) => {
    setSelectedMarker(id);
  }

  return (<ChakraProvider theme={theme}>
    <Box display='flex' flexDirection="row" width="100vw" height="100vh">
      {ontology && <CustomDrawer items={mapOntologyToDrawerItem(ontology)} />}
      <Box display="flex" width="100vw" height="100vh" position="relative">
        <SearchModal subjects={subjects} onSearch={handleSearch} />
        <Modal isOpen={selectedMarker != null && selectedMarker !== ""} style={customStyles} onRequestClose={() => setSelectedMarker(null)}>
          <PropertiesModal fullName={selectedMarker ?? ""}/>
        </Modal>
        {markers && <Maps markers={markers} lines={lines} onMarkerSelected={handleMakerClick} />}
      </Box>
    </Box>
  </ChakraProvider>)
}
