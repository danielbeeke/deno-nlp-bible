import { Neo4j } from "./Neo4j.ts";

export const Detect = (neo4j: Neo4j, nlp: any) => {
  return async function (req: any, res: any) {
    const text = req.query.text;
    const doc = nlp(text);
  
    let response: any = [];
  
    for (const noun of doc.nouns().json()) {
        const metaInformation = await neo4j.query(`MATCH (person:Person) WHERE person.name = '${noun.text}' RETURN person;`);
  
        if (metaInformation?.results?.[0]?.data?.[0]?.row?.[0]) {
            response.push(metaInformation?.results?.[0]?.data?.[0]?.row?.[0]);
        }
    }
  
    res.setStatus(200).json(response);
  };
}