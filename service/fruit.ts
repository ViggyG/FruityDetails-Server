import { FRUIT_SERVICE_PORT, BASE_SERVICE_URL } from '../config.js';
import express from 'express'
import cors from 'cors'
import {ApolloServer, gql} from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/federation'
import { getAllFruit } from '../controllers/fruit.js';

const port = FRUIT_SERVICE_PORT;

//express configuration
const app = express();

app.use(cors());
app.use(express.json());

//apollo configuration
const typeDefs = gql`
    extend type Query {
        getAllFruit: [Fruit]!
    }

    type Fruit @key(fields: "id") {
        id: ID!
        name: String!
        family: String,
        genus: String,
        order: String,
        nutritions: Nutritions
    }

    type Nutritions {
        carbohydrates: String,
        protein: String,
        fat: String,
        calories: String,
        sugar: String
    }
`;

//resolvers
const resolvers = {
    Query: {
        getAllFruit: async () => getAllFruit()
    }
};


//building server
const apolloServer = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers} ] )
});

const start = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({app, path: '/'});
    
    app.listen(port, () => {
        console.log(`fruit service is listening at: ${BASE_SERVICE_URL}${port}`);
    });
};

start();