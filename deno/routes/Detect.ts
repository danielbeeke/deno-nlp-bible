import { RouterContext } from 'https://deno.land/x/oak@v4.0.0/mod.ts';
import { Neo4j } from "../Neo4j.ts";

export const Detect = async (neo4j: Neo4j, nlp: any) => {
  
  return async (ctx: RouterContext) => {
    const text = ctx.request.url.searchParams.get('text');
    const doc = nlp(text);
  
    let response: any = [];
  
    for (const noun of doc.nouns().json()) {
        const metaInformation = await neo4j.query(`MATCH (person:Person) WHERE person.name = '${noun.text}' RETURN person;`);
  
        if (metaInformation?.results?.[0]?.data?.[0]?.row?.[0]) {
            response.push(metaInformation?.results?.[0]?.data?.[0]?.row?.[0]);
        }
    } 
    
    ctx.response.body = response;
  }
}