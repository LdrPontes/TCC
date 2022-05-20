import { OntologyClass } from "../models/OntologyClass";

export abstract class OntologyRepository {
  abstract getOntology(): Promise<OntologyClass[]>;
}