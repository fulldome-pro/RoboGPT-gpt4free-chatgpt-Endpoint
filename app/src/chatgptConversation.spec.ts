const chatgptConversation = require('./chatgptConversation');

describe('chatgptConversation', () => {
  it('returns the message in the response', async () => {
    const text = 'Hello, ChatGPT!';
    const cookies = 'test-cookie';
    const authorization = 'test-auth';

    const response = {
      body: {
        getReader: () => {
          let i = 0;
          return {
            async read() {
              i++;
              if (i === 3) {
                return { done: true };
              }
              return { value: `data: {"message": {"content": {"parts": ["response ${i}"]}}}\n\n` };
            },
          };
        },
      },
    };

    global.fetch = jest.fn(() => Promise.resolve(response));

    const result = await chatgptConversation(text, cookies, authorization);

    expect(result).toEqual('Hello! How can I assist you today?\n');
  });
});