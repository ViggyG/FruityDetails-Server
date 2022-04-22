import express from 'express';
import https from 'https';
import fs from 'fs';
import { GATEWAY_PORT, CERT_PATH, BASE_SERVICE_URL, FRUIT_SERVICE_PORT } from './config.js';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import cors from 'cors';

const port = GATEWAY_PORT;

//express configuration
const app = express();

app.use(cors());
app.use(express.json());

//subgraph consolidation
const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            {name: "fruit", url: `${BASE_SERVICE_URL}${FRUIT_SERVICE_PORT}`}
        ]
    })
})


//build server
const apolloServer = new ApolloServer({
    gateway,
});

const start = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({app, path: '/graphql'});
    
    https
    .createServer(
    {
        key: fs.readFileSync(`${CERT_PATH}key.pem`),
        cert: fs.readFileSync(`${CERT_PATH}cert.pem`)
    },
    app)
    .listen(port, () => {
        console.log(`app is listening on port ${port}`);
        console.log(`graphql endpoints: ${apolloServer.graphqlPath}`)
    });
};

start();