import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import {
  AssistantContent,
  ExperimentalMessage,
  ToolCallPart,
  ToolResultPart,
  experimental_streamText
} from 'ai'
import { searchSchema } from '@/lib/schema/search'
import { Section } from '@/components/section'
import { OpenAI } from '@ai-sdk/openai'
import { BotMessage } from '@/components/message'
import Exa from 'exa-js'
import { Card } from '@/components/ui/card'
import { SearchResults } from '../types'
import { SearchSection } from '@/components/search-section'

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamText: ReturnType<typeof createStreamableValue<string>>,
  messages: ExperimentalMessage[],
  useSpecificModel?: boolean
) {
  const openai = new OpenAI({
    baseUrl: process.env.OPENAI_API_BASE, // optional base URL for proxies etc.
    apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY
    organization: '' // optional organization
  })

  const searchAPI: 'tavily' | 'exa' = 'tavily'

  let fullResponse = ''
  let hasError = false
  const answerSection = (
    <Section title="Answer">
      <BotMessage content={streamText.value} />
    </Section>
  )

  const system_pormpt = `
  You are a language model designed to assist high school students with their academic inquiries. Your main role is to utilize the "get_solution_to_problem" web search tool to find detailed solutions for the users' questions. Given the vast information available online, it's highly probable that solutions to students' questions can already be found on the web. Therefore, your first step should always involve using the "solutions_to_problem" tool to search the internet for the specific problem mentioned by the user, paying special attention to multiple-choice questions (MCQs) where the order of options might differ.

  After finding relevant solutions, your task involves several critical steps:

  1. Verify Problem Match: First, verify if the user's problem exactly matches any of the problems found during the search. This involves comparing the question's content and structure to ensure accuracy, with particular attention to MCQs. For MCQs, verify the correctness based on the content of the options rather than their order.

  2. Selecting the Best Solution: If an exact match is found, select the most accurate and detailed solution from the available options. This decision should be based on the clarity, depth of explanation, and relevance, ensuring that the solution aligns with the user's provided options' content.

  3. Adaptation and Explanation: If the user's problem does not match exactly but is similar, or if the MCQ options' order differs, use the solutions found as a basis to adapt and create a solution specific to the user's question. This involves modifying values, steps, or matching the solution to the correct option based on the content, not the position.

  Your explanations should be clear, step-by-step, and tailored to high school students' level of understanding, breaking down complex concepts into simpler, digestible parts. If the search results do not yield a satisfactory answer, or if the solutions are too complex to adapt directly, use your built-in knowledge to guide the student, still focusing on providing a step-by-step explanation.

  Guidelines for interaction have been refined to include:

  1. Initial Search and Verification: Always begin with the "solution_to_problem" tool to search for solutions and verify the match with the user's problem, with special attention to the content of MCQ options.
  2. Solution Selection and Adaptation: Choose the best solution for exact matches or adapt solutions for similar problems, ensuring explanations are clear and tailored. Pay close attention to aligning the solution with the user's MCQ options based on content.
  3. Customized Explanations: Ensure your language and the complexity of explanations are appropriate for high school students.
  4. Encouragement of Further Learning: Motivate students to engage in critical thinking and explore related concepts for a deeper understanding of the subject matter.
  5. Crafting Tailored Solutions: If a direct or adaptable answer is not found, craft a solution using your knowledge base, ensuring an easy-to-follow, step-by-step approach.
  6. Maintaining a Positive Learning Environment: Prioritize safety, respect, and encouragement in all interactions.

  You must enclose your LaTeX expression between $$ or $$$ for inline and displayed math respectively.
  For example:
  Inline math: Let $$ P_1 = 100 $$
  Displayed math:
  $$
  P_2 = 50
  $$

  Your responses must follow this structured format and be presented in latex for clarity and precision, especially when dealing with chemical reactions, math equations, and other specialized content.The headings must be in very big font:

  ## Problem Verification: Confirm whether the user's problem matches the searched problem.
  ## Given Data: List the given values concisely, relevant to the problem at hand.
  ## Objective: Clarify what is asked to be found or solved.
  ## Solution Steps:  Provide a list of steps to achieve the answer, adapted if necessary. Use bold or italics for emphasis on keywords or important concepts, and properly format chemical reactions and math equations, enclosing your LaTeX expression between $ or \`\`\`\`
  ## Conclusion: Offer a brief overview of the solution, highlighting how it addresses the user's specific question.

  DO NOT USE PARENTHESIS () FOR DISPLAYING MATH EQUATIONS. ONLY USE \`$$\` or \`$$$\` for inline and displayed math respectively!
  `

  let isFirstToolResponse = true
  console.log("Messages sent to researcher: ")
  console.log(messages)
  console.log("Last message sent to researcher: \n\n")

  console.log(messages[messages.length - 1])

  // FIXING MESSAGE
  type ResultEntry = {
    content: string;
    title: string;
    url: string;
  };

  type ToolResult = {
      type: string;
      toolCallId: string;
      toolName: string;
      args: object;
      result: {
          images: string[];
          query: string;
          results: ResultEntry[];
      };
  };

  type ToolContent = {
      role: string;
      content: ToolResult[];
  };

  function extractContent(data: ToolContent): string {
    let contentString = "";

    // Check if data.content is indeed an array
    if (Array.isArray(data.content)) {
      const contentArray = data.content as ToolResult[];  // Type assertion
      for (let i = 0; i < contentArray.length; i++) {
        const toolResult = contentArray[i];
        for (let j = 0; j < toolResult.result.results.length; j++) {
            const result = toolResult.result.results[j];
            if (result.title === "Toppr") {
                contentString += "\n" + "Toppr:\n" + result.content
                contentString += result.content + " ";
            }
            else if (result.title === "Byjus") {
              contentString += "\n" + "Byjus:\n" + result.content
              contentString += result.content + " ";
            }
        }
      }
  } else {
      console.log('Expected data.content to be an array, but it was not.');
      const contentArray = data.content as ToolResult[];  // Type assertion
      for (let i = 0; i < contentArray.length; i++) {
        const toolResult = contentArray[i];
        for (let j = 0; j < toolResult.result.results.length; j++) {
            const result = toolResult.result.results[j];
            if (result.title === "Toppr") {
                contentString += "\n" + "Toppr:\n" + result.content
                contentString += result.content + " ";
            }
            else if (result.title === "Byjus") {
              contentString += "\n" + "Byjus:\n" + result.content
              contentString += result.content + " ";
            }
        }
      }
  }

    // TODO: Remove "Try BYJU's free classes today and shit from result!"

    return contentString.trim();
  }

  const modifiedMessages = [...messages]; // Shallow copy of the original array

  if (messages[messages.length - 1].role === 'tool') {
    let lastMessage = messages[messages.length - 1] as ToolContent;
    console.log("Edited Message:")
    console.log(lastMessage)

    let extractedContent = extractContent(lastMessage);
    if (extractedContent === '') {
      extractedContent = 'No solution found online, I must solve the problem myself and provide an excellent explanation.'
    }
    console.log("EXTRACTED DATAA! AAAH!")
    console.log(extractedContent)

    const modifiedMessages = [...messages]; // Shallow copy of the original array
    modifiedMessages.pop(); // Remove the last message
    const myMessage: ExperimentalMessage = {
      role: "assistant",
      content: extractedContent as AssistantContent
    }
    modifiedMessages.push(myMessage); // Add your own message

  }

  


  const result = await experimental_streamText({
    model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo'),
    maxTokens: 2500,
    // system: `As a professional search expert, you possess the ability to search for any information on the web. 
    // For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
    // If there are any images relevant to your answer, be sure to include them as well.
    // Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
    // Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly.
    // Please match the language of the response to the user's language.`,
    system: system_pormpt,
    //messages,
    messages: modifiedMessages,  // TESTING MODIFIED LAST MESSAGE
    temperature: 0.0,
    
    tools: {
      get_solution_to_problem: {
        description: 'Call this function with the user problem as argument, the argument must be the exact same as the user problem, word for word',
        parameters: searchSchema,
        execute: async ({
          problem,
          // max_results,
          // search_depth
        }: {
          problem: string
          // max_results: number
          // search_depth: 'basic' | 'advanced'
        }) => {
          // If this is the first tool response, remove spinner
          if (isFirstToolResponse) {
            isFirstToolResponse = false
            uiStream.update(null)
          }
          // Append the search section
          const streamResults = createStreamableValue<string>()
          uiStream.append(<SearchSection result={streamResults.value} />)

          // Tavily API requires a minimum of 5 characters in the query
          const filledQuery =
            problem.length < 5 ? problem + ' '.repeat(5 - problem.length) : problem
          let searchResult
          try {
            // searchResult =
            //   searchAPI === 'tavily'
            //     ? await tavilySearch(filledQuery, max_results, search_depth)
            //     : await exaSearch(query)
            
            searchResult = await get_sol(filledQuery)

          } catch (error) {
            console.error('Search API error:', error)
            hasError = true
          }

          if (hasError) {
            fullResponse += `\nAn error occurred while searching for "${problem}.`
            uiStream.update(
              <Card className="p-4 mt-2 text-sm">
                {`An error occurred while searching for "${problem}".`}
              </Card>
            )
            return searchResult
          }

          streamResults.done(JSON.stringify(searchResult))

          return searchResult
        }
      }
    }
  })

  const toolCalls: ToolCallPart[] = []
  const toolResponses: ToolResultPart[] = []
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta':
        if (delta.textDelta) {
          // If the first text delata is available, add a ui section
          if (fullResponse.length === 0 && delta.textDelta.length > 0) {
            // Update the UI
            uiStream.update(answerSection)
          }

          fullResponse += delta.textDelta
          streamText.update(fullResponse)
        }
        break
      case 'tool-call':
        toolCalls.push(delta)
        break
      case 'tool-result':
        // Append the answer section if the specific model is not used
        if (!useSpecificModel && toolResponses.length === 0) {
          uiStream.append(answerSection)
        }
        toolResponses.push(delta)
        break
      case 'error':
        hasError = true
        fullResponse += `\nError occurred while executing the tool`
        break
    }
  }
  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls]
  })

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses })
  }

  return { result, fullResponse, hasError, toolResponses }
}


async function get_sol(
  problem: string,
): Promise<any> {

  // Constructing the URL where the Flask API is listening
  const apiUrl = 'https://doubt-ai-2.el.r.appspot.com/solve_problem';

  // Local testing
  // const apiUrl = 'http://127.0.0.1:5000/solve_problem';

  // Setting up the request options for a POST request
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // Stringify your JSON body payload
    body: JSON.stringify({ problem: problem })
  };

  // Fetching the data from the Flask API
  const response = await fetch(apiUrl, options);

  // const apiKey = process.env.TAVILY_API_KEY
  // const response = await fetch('https://api.tavily.com/search', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     api_key: apiKey,
  //     query,
  //     max_results: maxResults < 5 ? 5 : maxResults,
  //     search_depth: searchDepth,
  //     include_images: true,
  //     include_answers: true
  //   })
  // })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  const data = await response.json()
  // console.log(data)
  return data
}

async function tavilySearch(
  problem: string,
): Promise<any> {


  const apiKey = process.env.TAVILY_API_KEY
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: apiKey,
      // query,
      // max_results: maxResults < 5 ? 5 : maxResults,
      // search_depth: searchDepth,
      // include_images: true,
      // include_answers: true
    })
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  const data = await response.json()
  // console.log(data)
  return data
}

async function exaSearch(query: string, maxResults: number = 10): Promise<any> {
  const apiKey = process.env.EXA_API_KEY
  const exa = new Exa(apiKey)
  return exa.searchAndContents(query, {
    highlights: true,
    numResults: maxResults
  })
}
