import dotenv from 'dotenv';
dotenv.config();
// Define environment variables
const apiChatGPTCookies = process.env.API_CHATGPT_COOKIES;
const apiChatGPTAuthorization = process.env.API_CHATGPT_AUTHORIZATION;
const apiMessageId = process.env.API_MESSAGE_ID;
const apiConversationId = process.env.API_CONVERSATION_ID;
const apiParentMessageId = process.env.API_PARENTMESSAGE_ID;

// Check if environment variables are defined
if (!apiChatGPTCookies) {
  throw new Error('API_CHATGPT_COOKIES not found');
}

if (!apiChatGPTAuthorization) {
  throw new Error('API_CHATGPT_AUTHORIZATION not found');
}

if (!apiMessageId) {
  throw new Error('API_MESSAGE_ID not found');
}

if (!apiConversationId) {
  throw new Error('API_CONVERSATION_ID not found');
}

if (!apiParentMessageId) {
  throw new Error('API_PARENTMESSAGE_ID not found');
}


/**
 * Sends a message to OpenAI's GPT-3 chat API and returns the last message in the response.
 *
 * @param {string} text The message to send to the API.
 * @param {string} parent_message_id 
 *
 * @return {Promise<string>} A Promise that resolves with the text content of the last message in the API response.
 *
 * @example
 * const prompt = 'Hello, ChatGPT!';
 * const parent_message_id = '';
 *
 * chatgptConversation(prompt, parent_message_id).then((lastMessage: string) => {
 *   console.log(lastMessage); //Hello! How can I assist you today?\n
 * });
 */
export async function chatgptConversation(prompt: string, parent_message_id: string): Promise<object> {


  const data = {
    "action": "next",
    "messages": [{
      "id": apiMessageId,
      "role": "user",
      "content": {
        "content_type": "text",
        "parts": [
          prompt
        ]
      }
    }],
    //"conversation_id": apiConversationId,
    "parent_message_id": parent_message_id ?? apiParentMessageId,
    "model": "text-davinci-002-render-sha"
  };


  //{"action":"next","messages":[{"id":"5f92c28b-3a5c-4c0b-b13c-37dfb8bf7be7","role":"user","content":{"content_type":"text","parts":["You are VishnuGPT, a large language model trained by 360SoftDevelopment\nKnowledge cutoff: 2022-01\nCurrent date: 2023-02-20"]}}],"parent_message_id":"4a8827e7-1f45-49d6-bea9-09d46ab8759a","model":"text-davinci-002-render-sha"}
  //{"action":"next","messages":[{"id":"bd21dd8a-de8a-4ccb-8705-49397af2ec8e","role":"user","content":{"content_type":"text","parts":["Who are you?"]}}],"conversation_id":"f5080447-e665-4010-8c90-30104526d60f","parent_message_id":"e427458f-ea33-44f5-8d4e-9c3b0bf959d0","model":"text-davinci-002-render-sha"}

  console.log('📤 data:', data);
  console.log('📤 data:', data.messages[0].content);

  const res = await fetch('https://chat.openai.com/backend-api/conversation', {
    method: 'POST',
    headers: {
      'accept': 'text/event-stream',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'authorization': 'Bearer ' + apiChatGPTAuthorization,
      'content-type': 'application/json',
      'cookie': apiChatGPTCookies,
      'origin': 'https://chat.openai.com',
      'referer': 'https://chat.openai.com/chat',
      'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    } as HeadersInit,
    body: JSON.stringify(data)
  });

  let lastMessage = '';

  const reader = res.body!.getReader();
  var id="";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const text = new TextDecoder().decode(value);
    //console.log("\n\n\n");
    //console.log(text);


    //const text = decoder.decode(value);
    for (const message of text.trim().split('\n\n')) {
      try {
        const json = JSON.parse(message.substring(6));
        console.log(json);
        //if (json?.message?.content?.parts?.length) {
        id=json?.message?.id;
        lastMessage = json.message.content.parts[0];
        //  lastMessage = json.message.content.parts[0];
        //}
      } catch (error) {
        //console.error('Error parsing message:', error);
      }
    }


  }

  //console.log('Response fully received');
  return {"id":id,"text":lastMessage};
}
