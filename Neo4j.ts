interface Neo4jSettings {
    discoverUrl: string,
    database: string,
    user: string,
    password: string
}

interface Neo4jDiscovery {
    bolt_routing: string,
    transaction: string,
    bolt_direct: string,
    data: string,
    neo4j_version: string,
    neo4j_edition: string
}

export class Neo4j {
    settings: Neo4jSettings;
    discovery: Neo4jDiscovery;

    constructor(settings: Neo4jSettings, discovery: Neo4jDiscovery) {
        this.settings = settings;
        this.discovery = discovery;
    }

    async query (query: string, parameters: any = {}) {
        const url: string = this.discovery.data + 'transaction/commit';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    'statements' : [ {
                        'statement' : query,
                        'parameters' : parameters
                    } ]
                }),
                headers: {
                    'accept': 'application/json;charset=UTF-8',
                    'content-type': 'application/json',
                    'authorization': 'Basic ' + btoa(this.settings.user + ':' + this.settings.password)
                }
            });

            return await response.json();
        }
        catch (exception) {
            console.log(exception)
        }
    }
}

export async function initNeo4j (settings: Neo4jSettings): Promise<Neo4j> {
    const response = await fetch(settings.discoverUrl, {
        headers: { Accept: 'application/json' }
    });
    const discovery: any = await response.json();
    return new Neo4j(settings, discovery);
}