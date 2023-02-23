import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { chatgptConversation } from './chatgptConversation';
import cors from 'cors';
import swaggerDocument from '../swagger/swagger.json';

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/v1/conversation', async (req: Request, res: Response) => {
  const parent_message_id: string = req.body.parent_message_id
  const prompt: string = req.body.prompt;
  try {
    console.log(`💬 ${parent_message_id}:${prompt}`);
    const response = await chatgptConversation(prompt, parent_message_id);
    console.log('✅',response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message }); // Cast error to Error type
    console.log('❌ Conversation error:', (error as Error).message);
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});

/*
Usecase:
Here is an example of HTTP REST request for translating an array of text:
POST /v1/conversation

{
"prompt": "Hello, ChatGPT!",
}

Here is an example of the JSON response for the above request:
{
"text": "Hello! How can I assist you today?\n"
}
*/