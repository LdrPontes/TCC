import { OntologyClass } from "../../domain/models/OntologyClass";
import { OntologyRepository } from "../../domain/repositories/OntologyRepository";

export class MockOntologyRepository extends OntologyRepository {
  async getOntology(): Promise<OntologyClass[]> {
    return [
      {
        id: "0",
        label: "Educational Institution",
        children: [
          {
            id: "1",
            label: 'University',
            children: [
              {
                id: "2",
                label: 'UTFPR',
                children: []
              },
              {
                id: "3",
                label: 'UFPR',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: "4",
        label: "Access Point",
        children: [
          {
            id: "5",
            label: 'Bus Stop',
            children: [
              {
                id: "6",
                label: 'Bus Stop A',
                children: []
              }
            ]
          },
        ]
      },
      {
        id: "7",
        label: 'Bus Station',
        children: [
          {
            id: "8",
            label: 'Bus Station A',
            children: []
          }
        ]
      },
      {
        id: "0",
        label: "Educational Institution",
        children: [
          {
            id: "1",
            label: 'University',
            children: [
              {
                id: "2",
                label: 'UTFPR',
                children: []
              },
              {
                id: "3",
                label: 'UFPR',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: "4",
        label: "Access Point",
        children: [
          {
            id: "5",
            label: 'Bus Stop',
            children: [
              {
                id: "6",
                label: 'Bus Stop A',
                children: []
              }
            ]
          },
        ]
      },
      {
        id: "7",
        label: 'Bus Station',
        children: [
          {
            id: "8",
            label: 'Bus Station A',
            children: []
          }
        ]
      },
    ];
  }

}