# Trabalho de Conclusão de Curso - UTFPR
## Requisitos
- [GraphDB Free](https://graphdb.ontotext.com/)
- [NodeJS](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/)

## Passo a passo da instalação
### GraphDB
1. Abra o GraphDB e na janela de *log* clique em **Settings**
2.  Adicione as seguintes regras customizadas para o Java
    * graphdb.workbench.cors.enable = true
    * graphdb.workbench.cors.origin = *
 
3.  Na interface web do GraphDB, crie um repositório chamado **TCC**
4.  Baixe o arquivo [final_ontology.owl](https://github.com/LdrPontes/TCC/blob/main/ontologias/final_ontology.owl)
5.  Importe o arquivo **final_ontology.owl** no GraphDB como RDF

### Frontend
1. Digite no terminal **yarn install** para instalar as dependências do projeto
2. Para rodar o projeto digite **yarn start**

---
## Sobre

***INTERFACE PARA INTERAÇÃO DE PESSOAS NÃO TÉCNICAS COM DADOS ABERTOS CONECTADOS***

O objetivo deste trabalho consiste no desenvolvimento de uma interface para a
interação com dados abertos conectados com o foco na utilização no contexto de Cidades
Inteligentes, voltado para cidadãos não técnicos.

## Autores
[Leandro Pontes Berleze](https://www.linkedin.com/in/ldrpontes/)

[João Pedro Costa Severo](https://www.linkedin.com/in/joaopcostasevero/)

**Orientadora:** Prof. Dra. Rita Cristina Galarraga Berardi
