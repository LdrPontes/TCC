export interface Triple {
  subject: string;
  predicate: string;
  object: string;
  filter?: '<' | '>' | '<=' | '>=' | '!=' | '=';
}