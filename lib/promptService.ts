import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";


const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

const standaloneQuestionTemplate = `
Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`;

const answerTemplate = `
   You are a friendly and helpful support bot named {botName}. Your job is to answer questions about {botName} using the provided context and conversation history. Follow these rules:

    1. Look for the answer in the given context first.
    2. If not found, check the conversation history.
    3. If the answer is still not found, say: "I'm sorry, I don't know the answer to that." Then direct the user to email: <a href="mailto:{contactEmail}" target="_blank">{contactEmail}</a>.
    4.(mandatory) If the user wants to contact us or contacted by us, share this link: <a href="{contactLink}" target="_blank">contact link</a>, or email: <a href="mailto:{contactEmail}" target="_blank">{contactEmail}</a>.
    5. Format all answers as clean HTML for better readability (no CSS required).
    6. Always respond in a friendly and conversational tone, as if chatting with a friend. Never make up answers.

    Context: {context}
    Conversation History: {conv_history}
    Question: {question}
    Answer:
`;

export const standaloneQuestionChain = PromptTemplate.fromTemplate(standaloneQuestionTemplate)
    .pipe(llm)
    .pipe(new StringOutputParser());

export const answerChain = PromptTemplate.fromTemplate(answerTemplate)
    .pipe(llm)
    .pipe(new StringOutputParser());



const answerTemplateForInApp = `
    You are a friendly and helpful support bot named {botName}. Your job is to answer questions about {botName} using the provided context and conversation history. Follow these rules:
    
    1. Look for the answer in the given context first.
    2. If not found, check the conversation history.
    3. If you still can't find the answer, say: "I'm sorry, I don't know the answer to that." Then direct the user to email {contactEmail}.
    4. If the user wants to contact support, provide this link: {contactLink} or email: {contactEmail}.
    5. If the user introduces themselves, introduce yourself as a support bot.

    Always communicate in a friendly, conversational tone, as if chatting with a friend. Never guess or make up answers.

    Context: {context}
    Conversation History: {conv_history}
    Question: {question}
    Answer:
`;

export const answerChainForInApp = PromptTemplate.fromTemplate(answerTemplateForInApp)
    .pipe(llm)
    .pipe(new StringOutputParser());
