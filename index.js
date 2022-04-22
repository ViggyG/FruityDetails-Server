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
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const config_js_1 = require("./config.js");
const apollo_server_express_1 = require("apollo-server-express");
const gateway_1 = require("@apollo/gateway");
const cors_1 = __importDefault(require("cors"));
const port = config_js_1.GATEWAY_PORT;
//express configuration
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//subgraph consolidation
const gateway = new gateway_1.ApolloGateway({
    supergraphSdl: new gateway_1.IntrospectAndCompose({
        subgraphs: [
            { name: "fruit", url: `${config_js_1.BASE_SERVICE_URL}${config_js_1.FRUIT_SERVICE_PORT}` }
        ]
    })
});
//build server
const apolloServer = new apollo_server_express_1.ApolloServer({
    gateway,
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    https_1.default
        .createServer({
        key: fs_1.default.readFileSync(`${config_js_1.CERT_PATH}key.pem`),
        cert: fs_1.default.readFileSync(`${config_js_1.CERT_PATH}cert.pem`)
    }, app)
        .listen(port, () => {
        console.log(`app is listening on port ${port}`);
        console.log(`graphql endpoints: ${apolloServer.graphqlPath}`);
    });
});
start();
