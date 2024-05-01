import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { ExperimentalMessage, experimental_streamObject } from 'ai'
import { PartialRelated, relatedSchema } from '@/lib/schema/related'
import { Section } from '@/components/section'
import SearchRelated from '@/components/search-related'
import { OpenAI } from '@ai-sdk/openai'

export async function querySuggestor(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: ExperimentalMessage[]
) {
  const openai = new OpenAI({
    baseUrl: process.env.OPENAI_API_BASE, // optional base URL for proxies etc.
    apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY
    organization: '' // optional organization
  })
  const objectStream = createStreamableValue<PartialRelated>()
  uiStream.append(
    <Section title="Related" separator={true}>
      <SearchRelated relatedQueries={objectStream.value} />
    </Section>
  )

  await experimental_streamObject({
    //model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo'),
    model: openai.chat('gpt-3.5-turbo'),
    system: `As a tutor for high school students in India, your task is to generate a set of three queries that explore the subject matter more deeply, building upon the initial doubt asked by the user and the information uncovered in its results.

    For instance, if the original query was "What's the 2nd law of thermodynamics?", your output should follow this format:

    "{
      "related": [
        "How does the 2nd law of thermodynamics define entropy?",
        "Examples of the 2nd law of thermodynamics in daily life.",
        "Differences between the Kelvin-Planck and Clausius statements of the 2nd law."
      ]
    }"

    Aim to create queries that progressively delve into more specific aspects, implications, or adjacent topics related to the initial query. The goal is to anticipate the user's potential information needs and guide them towards a more comprehensive understanding of the subject matter. Keep the queries restricted to the subject of math, physics, chemistry or biology. 
    Please match the language of the response to the user's language.`,
    messages,
    schema: relatedSchema
  })
    .then(async result => {
      for await (const obj of result.partialObjectStream) {
        objectStream.update(obj)
      }
    })
    .finally(() => {
      objectStream.done()
    })
}
