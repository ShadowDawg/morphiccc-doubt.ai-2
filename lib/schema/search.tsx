import { DeepPartial } from 'ai'
import { z } from 'zod'

export const searchSchema = z.object({
  problem: z.string().describe(`The user's problem.`),
  // max_results: z
  //   .number()
  //   .max(20)
  //   .default(5)
  //   .describe('The maximum number of results to return'),
  // search_depth: z
  //   .enum(['basic', 'advanced'])
  //   .default('basic')
  //   .describe('The depth of the search')
})

export type PartialInquiry = DeepPartial<typeof searchSchema>
