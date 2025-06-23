# OpenRouter Prompt Interface

A modern web interface for interacting with various AI models through OpenRouter's API.

## Features

- Clean and modern UI built with Next.js 14 and Tailwind CSS
- Support for multiple AI models (GPT-4, GPT-3.5, Claude 2, etc.)
- Searchable model selection
- Real-time response streaming
- Loading states and error handling
- Secure API key handling

## Prerequisites

- Node.js 18.17 or later
- An OpenRouter API key (get one at [OpenRouter](https://openrouter.ai))

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd openrouter_prompt_interface
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter your name
2. Input your OpenRouter API key
3. Select an AI model from the dropdown
4. Type your prompt
5. Click Submit and wait for the response

## Deployment

This project is ready to be deployed to Netlify. Simply connect your repository to Netlify and it will automatically build and deploy your application.

## Built With

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Select](https://react-select.com/) - Flexible select input
- [React Spinners](https://www.npmjs.com/package/react-spinners) - Loading animations

## License

This project is open source and available under the MIT License.
