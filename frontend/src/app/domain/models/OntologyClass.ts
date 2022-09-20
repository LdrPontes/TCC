import { Instance } from "./Instance";

export interface OntologyClass {
  name: string;
  fullName: string;
  children: OntologyClass[];
  instances?: Instance[];
}