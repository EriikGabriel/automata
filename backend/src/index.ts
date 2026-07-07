import { fastifyCors } from "@fastify/cors"
import { fastifySwagger } from "@fastify/swagger"
import ScalarApiReference from "@scalar/fastify-api-reference"
import { fastify } from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { z } from "zod"

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

await server.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
})

await server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Ametista Engine API",
      description: "API documentation for the Ametista Engine",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
})

await server.register(ScalarApiReference, {
  routePrefix: "/docs",
})

server.get("/", async () => {
  return { message: "Hello, World!" }
})

server.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on http://localhost:3000")
  console.log("API documentation available at http://localhost:3000/docs")
})
