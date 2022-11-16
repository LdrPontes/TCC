import { ontologyPrefix } from './../../../constants/ontology';
import { http } from './../../../interfaces/http';
import { OntologyClass } from "../../domain/models/OntologyClass";
import { OntologyRepository } from "../../domain/repositories/OntologyRepository";
import { Instance } from '../../domain/models/Instance';
import { Property } from '../../domain/models/Property';
import { ObjectSearch } from '../../domain/models/ObjectSearch';
import { Triple } from '../../domain/models/Triple';

class GraphDBRepository implements OntologyRepository {
  async getDataPropertiesByName(className: string): Promise<Property[]> {
    try {

      const query = encodeURIComponent(`PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      select distinct ?property where {
          ?subject rdf:type education:${className.replace(ontologyPrefix, '')} .
          ?subject ?property ?value .
          ?property rdf:type owl:DatatypeProperty
      }`);

      const response = await http.get(`repositories/TCC?query=${query}&infer=true`);
      const data = response.data;

      const properties: Property[] = [];

      data.results.bindings.forEach((binding: any) => {
        properties.push({
          fullName: binding.property.value,
        });
      });

      const promises = properties.map(async (property) => {
        const queryPropertyType = encodeURIComponent(`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
          select distinct (datatype(?y) as ?datatype) where {
              ?x education:${property.fullName.replace(ontologyPrefix, '')} ?y .
          }`);

        const responseType = await http.get(`repositories/TCC?query=${queryPropertyType}&infer=true`);
        const dataType = responseType.data;
        property.type = dataType.results.bindings[0].datatype.value;
      });
      await Promise.all(promises);

      console.log(properties);

      return properties;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async searchByObjectProperties(triple: Triple[]): Promise<ObjectSearch[]> {
    const mapVariables = new Map<string, string>();

    triple.forEach((triple, index) => {
      mapVariables.set(triple.subject, `?subject${index}`);
      if (triple.object.includes(ontologyPrefix)) {
        mapVariables.set(triple.object, `?object${index}`);
      }
    });

    try {
      const triples = triple.map((item) => {
        if (!isNaN(Number(item.object)) && (item.filter === '=' || item.filter === null || item.filter === undefined)) {
          return `${mapVariables.get(item.subject)} education:${item.predicate.replace(ontologyPrefix, '')} ${item.object.includes(ontologyPrefix) ? mapVariables.get(item.object) : item.object} .`;
        } else if (!isNaN(Number(item.object)) && item.filter !== null && item.filter !== undefined) {
          return `${mapVariables.get(item.subject)} education:${item.predicate.replace(ontologyPrefix, '')} ${mapVariables.get(item.subject)}${item.predicate.replace(ontologyPrefix, '')}filter .
          FILTER (${mapVariables.get(item.subject)}${item.predicate.replace(ontologyPrefix, '')}filter ${item.filter} ${item.object}) .`;
        } else {
          return `${mapVariables.get(item.subject)} education:${item.predicate.replace(ontologyPrefix, '')} ${item.object.includes(ontologyPrefix) ? mapVariables.get(item.object) : `"${item.object}"`} .`;
        }
      });
      const triplesTypes = triple.map((item) => {
        return `${mapVariables.get(item.subject)} rdf:type education:${item.subject.replace(ontologyPrefix, '')} .`;
      });
      const triplesObjectTypes = triple.filter((item) => item.object.includes(ontologyPrefix)).map((item) => {
        return `${mapVariables.get(item.object)} rdf:type education:${item.object.replace(ontologyPrefix, '')} .`;
      });

      const query = encodeURIComponent(`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      SELECT DISTINCT ${mapVariables.get(triple[0].subject)} ${mapVariables.get(triple[0].object)} 
      WHERE {
        ${triples.join('\n')}
        ${triplesTypes.join('\n')}
        ${triplesObjectTypes.join('\n')}
      }`);

      const response = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const search: ObjectSearch[] = [];

      data.results.bindings.forEach((binding: any) => {
        search.push({
          subject: binding[mapVariables.get(triple[0].subject)!.replace('?', '')].value,
          value: binding[mapVariables.get(triple[0].object)!.replace('?', '')].value,
          property: triple[0].predicate,
        });
      });
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
      select distinct ?value where {
           education:${property} rdfs:range ?value
      }`);

      const response = await http.get(`repositories/TCC?query=${query}&infer=true`);
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

      const response = await http.get(`repositories/TCC?query=${query}&infer=true`);
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

  async getInstanceData(fullName: string): Promise<Instance> {
    try {
      const response = await http.get(`rest/explore/graph?uri=${encodeURIComponent(fullName)}&inference=all&role=subject&bnodes=true&sameAs=true&context=`, { headers: { 'Accept': 'application/x-graphdb-table-results+json' } });
      const data = response.data;

      const instance: Instance = { fullName: fullName, properties: new Map<string, string | string[]>() };

      data.results.bindings.forEach((binding: any) => {
        const currentValue = instance.properties.get(binding.predicate.value);
        if (currentValue) {
          if (Array.isArray(currentValue)) {
            instance.properties.set(binding.predicate.value, [...currentValue, binding.object.value]);
          } else {
            instance.properties.set(binding.predicate.value, [currentValue, binding.object.value]);
          }

        } else {
          instance.properties.set(binding.predicate.value, binding.object.value);
        }
      });

      return instance;
    } catch (error) {
      console.log(error);
      return { fullName: fullName, properties: new Map<string, string | string[]>() };

    }
  }
  async getInstanceTypes(fullName: string): Promise<string[]> {
    try {
      const query = encodeURIComponent(`PREFIX education: <http://www.semanticweb.org/mateus/ontologies/2019/9/mobility_&_education#>
      select ?property ?value where {
          education:${fullName.replace(ontologyPrefix, "")} ?property ?value
      }`);

      const response = await http.get(`repositories/TCC?query=${query}`);
      const data = response.data;

      const types: string[] = [];

      data.results.bindings.forEach((binding: any) => {
        if (binding.property.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' && binding.value.value.includes(ontologyPrefix)) {
          types.push(binding.value.value);
        }
      });

      return types;
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