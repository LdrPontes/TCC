import { Triple } from './../models/Triple';
import { ObjectSearch } from './../models/ObjectSearch';
import { Instance } from "../models/Instance";
import { OntologyClass } from "../models/OntologyClass";
import { Property } from "../models/Property";

export abstract class OntologyRepository {
  abstract getOntology(): Promise<OntologyClass[]>;
  abstract getOntologyClassData(className: string): Promise<Instance[]>;
  abstract getObjectPropertiesByName(className: string): Promise<Property[]>;
  abstract getValueByProperty(property: string): Promise<Property[]>;
  abstract searchByObjectProperties(triple: Triple[]): Promise<ObjectSearch[]>;
  abstract getDataPropertiesByName(className: string): Promise<Property[]>;
}