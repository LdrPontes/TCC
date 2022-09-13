import { http } from './../../../interfaces/http';
import { OntologyClass } from "../../domain/models/OntologyClass";
import { OntologyRepository } from "../../domain/repositories/OntologyRepository";

export class GraphDBRepository implements OntologyRepository {
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
      console.log(ontologyClasses);
      return ontologyClasses;
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