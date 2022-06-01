export interface OntologyClass {
  id: string;
  label: string;
  props?: Map<string, any>;
  children: OntologyClass[];
  //TODO Data Properties
  //TODO Object Properties
}