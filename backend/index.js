import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDB } from "./db/connectDb.js";

dotenv.config();

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs : mergedTypeDefs,
    resolvers : mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start();

app.use(
    '/',
    cors(),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`Server is up and running at ${4000}`)