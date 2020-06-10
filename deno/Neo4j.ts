interface Neo4jSettings {
    url: string,
    user: string,
    password: string
}

export class Neo4j {
    settings: Neo4jSettings;

    constructor(settings: Neo4jSettings) {
        this.settings = settings;
    }

    public async query (query: string, parameters: any = {}) {
        const url: string = this.settings.url + '/transaction/commit';

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
