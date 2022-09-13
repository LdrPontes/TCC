export interface OntologyClass {
  name: string;
  fullName: string;
  children: OntologyClass[];
}