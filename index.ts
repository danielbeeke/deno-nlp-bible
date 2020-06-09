import {initNeo4j} from "./Neo4j.ts";
import opine from "https://deno.land/x/opine@master/mod.ts";
import nlp from 'https://unpkg.com/compromise@13.2.0/builds/compromise.mjs';

const app = opine();

export const Neo4jService = await initNeo4j({
    discoverUrl: 'http://68.183.135.124:7474/',
    database: 'data',
    user: 'biblereader',
    password: 'theographic'
});

app.get("/detect", async function (req, res) {
    const text = req.query.text;
    const doc = nlp(text);

    let response: any = [];

    for (const noun of doc.nouns().json()) {
        const metaInformation = await Neo4jService.query(`MATCH (person:Person) WHERE person.name = "${noun.text}" RETURN person;`);

        if (metaInformation?.results?.[0]?.data?.[0]?.row?.[0]) {
            response.push(metaInformation?.results?.[0]?.data?.[0]?.row?.[0]);
        }
    }

    res.send(JSON.stringify(response, null, 2));
});

app.listen({ port: 3000 });


