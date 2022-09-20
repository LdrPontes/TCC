import { Instance } from "../models/Instance";
import { OntologyClass } from "../models/OntologyClass";

export abstract class OntologyRepository {
  abstract getOntology(): Promise<OntologyClass[]>;
  abstract getOntologyClassData(className: string): Promise<Instance[]>;
}