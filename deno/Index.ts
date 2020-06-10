import 'https://deno.land/x/dotenv/load.ts';
import { Neo4j } from './Neo4j.ts';
import { opine, serveStatic } from 'https://deno.land/x/opine@master/mod.ts';
import { Detect } from './Detect.ts';
import { join } from "https://deno.land/std@0.52.0/path/mod.ts";
import nlp from 'https://unpkg.com/compromise@13.2.0/builds/compromise.mjs';

/**
 * Bootstrapping services
 */
const app = opine();
const cwd = import.meta.url.replace('deno/Index.ts', '');

if (
    !Deno.env.get('THEOGRAPHIC_URL') || 
    !Deno.env.get('THEOGRAPHIC_USER') || 
    !Deno.env.get('THEOGRAPHIC_PASSWORD')
) {
    throw `Please fill in the theographic credentials in .env`;
}

const neo4j = new Neo4j({
    url: Deno.env.get('THEOGRAPHIC_URL')!,
    user: Deno.env.get('THEOGRAPHIC_USER')!,
    password: Deno.env.get('THEOGRAPHIC_PASSWORD')!,
});

/**
 * Routes
 */
app.get('/detect', Detect(neo4j, nlp));
app.use(serveStatic(join(cwd, 'public')));
app.listen({ port: 3001 });


