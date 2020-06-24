import { Application, Router, send } from 'https://deno.land/x/oak@v4.0.0/mod.ts';
import 'https://deno.land/x/dotenv/load.ts';
import { existsSync } from 'https://deno.land/std/fs/mod.ts';

// Services
import { Neo4j } from './Neo4j.ts';
import nlp from 'https://unpkg.com/compromise@13.2.0/builds/compromise.mjs';

// Routes.
import { Detect } from './routes/Detect.ts';
import { Record } from './routes/Record.ts';

// Variables
const port = 3001;
const application = new Application();
const router = new Router();

/**
 * Bootstrapping services
 */
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
router.get('/ws', Record)
router.get('/detect', await Detect(neo4j, nlp));

application.use(router.routes());
application.use(router.allowedMethods());

application.use(async (context) => {
    const fileName = context.request.url.pathname.replace('/uploads', '');
    await send(context, fileName, {
        root: `${Deno.cwd()}/uploads`,
    });
});

application.listen({ port });
console.log('Running...');