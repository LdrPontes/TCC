import { OntologyClass } from "../../domain/models/OntologyClass";
import { OntologyRepository } from "../../domain/repositories/OntologyRepository";

export class MockOntologyRepository extends OntologyRepository {
  async getOntology(): Promise<OntologyClass[]> {
    return [
      {
        fullName: "0",
        name: "Educational Institution",
        children: [
          {
            fullName: "1",
            name: 'University',
            children: [
              {
                fullName: "2",
                name: 'UTFPR',
                children: []
              },
              {
                fullName: "3",
                name: 'UFPR',
                children: []
              }
            ]
          }
        ]
      },
      {
        fullName: "4",
        name: "Access Point",
        children: [
          {
            fullName: "5",
            name: 'Bus Stop',
            children: [
              {
                fullName: "6",
                name: 'Bus Stop A',
                children: []
              }
            ]
          },
        ]
      },
      {
        fullName: "7",
        name: 'Bus Station',
        children: [
          {
            fullName: "8",
            name: 'Bus Station A',
            children: []
          }
        ]
      },
    ];
  }

}