import { z } from "zod"
import { simulate } from "./simulate"
import type { FastifyTypedInstance } from "./types"

export async function routes(app: FastifyTypedInstance) {
  app.get("/", async () => {
    return { message: "Hello, World!" }
  })

  app.post(
    "/simulate",
    {
      schema: {
        body: z.object({
          input: z.string(),
          initial: z.string().nullable(),
          finals: z.array(z.string()),
          table: z.record(
            z.string(),
            z.record(z.string(), z.array(z.string())),
          ),
        }),
        response: {
          200: z.object({
            accepted: z.boolean(),
            steps: z.array(
              z.object({
                currentStates: z.array(z.string()),
                symbol: z.string(),
                nextStates: z.array(z.string()),
              }),
            ),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { input, initial, finals, table } = request.body

      if (!initial) {
        return reply.status(400).send({ error: "No initial state defined" })
      }

      try {
        return simulate(input, initial, finals, table)
      } catch (error) {
        return reply.status(400).send({
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  )
}
