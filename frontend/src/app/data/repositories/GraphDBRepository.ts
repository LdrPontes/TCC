import { http } from './../../../interfaces/http';
import { OntologyClass } from "../../domain/models/OntologyClass";
import { OntologyRepository } from "../../domain/repositories/OntologyRepository";
import { Instance } from '../../domain/models/Instance';

class GraphDBRepository implements OntologyRepository {
  async getOntology(): Promise<OntologyClass[]> {
    try {
      const response  = await http.get('rest/class-hierarchy?graphURI=');
      const data = response.data;

      const ontologyClasses = data.children.map((child: any) => {
        return {
          fullName: child.fullName,
          name: child.name.replace(':', ''),
          children: this.mapChildren(child.children),
        }
      });
      return ontologyClasses;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getOntologyClassData(className: string): Promise<Instance[]> {
    try {
      const query = encodeURIComponent(`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      select ?instance ?property ?value where {
          ?instance rdf:type education:${className} .
          ?instance ?property ?value
          filter not exists { ?instance rdf:type ?value }
      }`);

      const response  = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const instances: Instance[] = [];
      
      data.results.bindings.forEach((binding: any) => {
        const instance = instances.find(instance => instance.fullName === binding.instance.value);
        if (instance) {
          instance.properties.set(binding.property.value, binding.value.value);
        } else {
          const properties = new Map<string, string>();
          properties.set(binding.property.value, binding.value.value);
          instances.push({
            fullName: binding.instance.value,
            properties
          });
        }
      });
      
      return instances;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  mapChildren(children: any): OntologyClass[] {
    return children.map((child: any) => {
      return {
        fullName: child.fullName,
        name: child.name.replace(':', ''),
        children: this.mapChildren(child.children)
      }
    });
  }
}

export default new GraphDBRepository();