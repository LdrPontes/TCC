export interface OntologyClass {
  id: string;
  label: string;
  props?: Map<string, any>;
  children: OntologyClass[];
}