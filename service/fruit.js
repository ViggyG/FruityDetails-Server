"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("../config.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const federation_1 = require("@apollo/federation");
const fruit_js_1 = require("../controllers/fruit.js");
const port = config_js_1.FRUIT_SERVICE_PORT;
//express configuration
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//apollo configuration
const typeDefs = (0, apollo_server_express_1.gql) `
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
        getAllFruit: () => __awaiter(void 0, void 0, void 0, function* () { return (0, fruit_js_1.getAllFruit)(); })
    }
};
//building server
const apolloServer = new apollo_server_express_1.ApolloServer({
    schema: (0, federation_1.buildSubgraphSchema)([{ typeDefs, resolvers }])
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/' });
    app.listen(port, () => {
        console.log(`fruit service is listening at: ${config_js_1.BASE_SERVICE_URL}${port}`);
    });
});
start();
