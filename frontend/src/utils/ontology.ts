import { Instance } from '../app/domain/models/Instance';
import { ontologyPrefix } from '../constants/ontology';
import { OntologyClass } from './../app/domain/models/OntologyClass';

export const getInstanceByName = (ontology: OntologyClass, name: string): {instance: Instance | undefined, father: string} | undefined => {
  const instance = ontology.instances?.find((instance) => instance.fullName === name || instance.fullName.replace(ontologyPrefix, '') === name);
  if (!instance) {
    for(let i = 0; i < ontology.children.length; i++) {
      const aux = getInstanceByName(ontology.children[i], name);
      if (aux) {
        return aux;
      }
    }
  } else {
    return {instance, father: ontology.name};
  }
}