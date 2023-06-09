# VFBOT-GPT

VFBOT-GPT is a chatbot that uses the GPT (Generative Pre-trained Transformer) model from OpenAI to provide responses to user messages in a chat conversation. This chatbot is developed using the @open-wa/wa-automate and openai libraries.

## Features

- Receives messages from users and provides responses using the GPT model from OpenAI.
- Uses previous context in the conversation to generate more contextual responses.
- Estimates processing time and provides an initial response to the user.
- Saves context and user data to a JSON file for use in subsequent conversations.

## Advantages

- Uses the GPT model trained by OpenAI, providing more natural and contextual responses.
- Can be integrated with WhatsApp using the @open-wa/wa-automate library, enabling it to be used as a virtual assistant in chat conversations.
- Can store and remember previous context in the conversation, providing a smoother conversational experience.

## Configuration

Make sure you have made the necessary configuration

### ApiKey
```json
{
    "apiKey": "YOUR_OPENAI_APIKEY"
}
```
Change the apikey configuration in `config.json` according to the ApiKey OpenAi you have. If you don't have it, you can get [here](https://platform.openai.com/account/api-keys) by registering an account


## Usage

1. Make sure you have Node.js and npm (Node Package Manager) installed on your computer.
2. Clone this repository to your computer.
3. Open a terminal or command prompt and navigate to the cloned repository directory.
4. Run the command `npm install` to install all required dependencies.
5. Run the command `npm run vf` to start the VFBOT-GPT chatbot.
6. Open WhatsApp on your device and scan the QR code that appears to log in to WhatsApp Web using VFBOT-GPT.
7. Start sending messages with the "vfbot" prefix on WhatsApp to interact with VFBOT-GPT.\
(example: `vfbot Hello, can you help me with math?`)

Make sure to understand and comply with the terms and conditions of using the OpenAI API when using the VFBOT-GPT chatbot.

---

_References:_
- @open-wa/wa-automate library: [https://github.com/open-wa/wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs)
