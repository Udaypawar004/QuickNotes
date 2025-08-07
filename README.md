# QuickNote

QuickNote is a project designed to help users organize thoughts, notes, and ideas efficiently.

## Features

- Note-taking and organization
- Search and filter notes
- User-friendly interface

## Installation

```bash
git clone https://github.com/udaypawar004/quicknotes.git
cd _____
# Follow project-specific setup instructions
```

  
Before running the project, make sure to:

- Set up a [Supabase](https://supabase.com/) project and obtain your API keys.
- Configure your database schema using [Prisma](https://www.prisma.io/).
- Obtain a Gemini API key for AI-powered features.

Create a `.env` file in the project root with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_prisma_database_url
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```


1. Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to use QuickNote.

## Usage

1. Start the application.
2. Create and manage your notes.
3. Search and organize as needed.

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.