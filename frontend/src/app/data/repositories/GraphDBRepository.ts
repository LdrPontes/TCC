import { ontologyPrefix } from './../../../constants/ontology';
import { http } from './../../../interfaces/http';
import { OntologyClass } from "../../domain/models/OntologyClass";
import { OntologyRepository } from "../../domain/repositories/OntologyRepository";
import { Instance } from '../../domain/models/Instance';
import { Property } from '../../domain/models/Property';
import { ObjectSearch } from '../../domain/models/ObjectSearch';
import { Triple } from '../../domain/models/Triple';

class GraphDBRepository implements OntologyRepository {
  async searchByObjectProperties(triple: Triple): Promise<ObjectSearch[]> {
    try {
      const query = encodeURIComponent(`PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      select ?subject ?object where {
          ?university education:${triple.predicate.replace(ontologyPrefix, '')} ?object . 
          ?subject rdf:type education:${triple.subject.replace(ontologyPrefix, '')} . 
          ?object rdf:type education:${triple.object.replace(ontologyPrefix, '')} .
      }`);

      const response = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const search: ObjectSearch[] = [];

      data.results.bindings.forEach((binding: any) => {
        search.push({
          subject: binding.subject.value,
          value: binding.object.value,
          property: triple.predicate,
        });
      });
      console.log(search);
      return search;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getValueByProperty(property: string): Promise<Property[]> {
    try {
      const query = encodeURIComponent(`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      select ?value where {
           education:${property} rdfs:range ?value
      }`);

      const response = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const properties: Property[] = [];

      data.results.bindings.forEach((binding: any) => {
       properties.push({
          fullName: binding.value.value,
       });
      });

      return properties;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getObjectPropertiesByName(className: string): Promise<Property[]> {
    try {
      const query = encodeURIComponent(`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      select distinct ?property where {
          ?subject rdf:type education:${className} .
          ?subject ?property ?value .
          ?property rdf:type owl:ObjectProperty
      }`);

      const response = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const properties: Property[] = [];

      data.results.bindings.forEach((binding: any) => {
       properties.push({
          fullName: binding.property.value,
       });
      });

      return properties;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getOntology(): Promise<OntologyClass[]> {
    try {
      const response = await http.get('rest/class-hierarchy?graphURI=');
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

      const response = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const instances: Instance[] = [];

      data.results.bindings.forEach((binding: any) => {
        const instance = instances.find(instance => instance.fullName === binding.instance.value);
        if (instance) {
          const currentValue = instance.properties.get(binding.property.value);
          if (currentValue) {
            if (Array.isArray(currentValue)) {
              instance.properties.set(binding.property.value, [...currentValue, binding.value.value]);
            } else {
              instance.properties.set(binding.property.value, [currentValue, binding.value.value]);
            }

          } else {
            instance.properties.set(binding.property.value, binding.value.value);
          }
        } else {
          const properties = new Map<string, string | string[]>();
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