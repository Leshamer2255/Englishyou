# EnglishYou - Interactive English Learning Platform

An interactive platform for learning English through various exercises, spaced repetition, and AI-powered assistance.

## Features

- 🎯 Interactive exercises (grammar, vocabulary, listening)
- 🔄 Spaced repetition system for vocabulary
- 🎧 Listening exercises with audio integration
- 🤖 AI-powered assistance for explanations and examples
- 📊 Progress tracking and statistics
- 🔐 User authentication and profiles

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Audio**: Web Speech API, YouTube API
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Database (PostgreSQL)
   DATABASE_URL="postgresql://user:password@localhost:5432/englishyou?schema=public"

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # OpenAI (for future AI features)
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
/src
  /app                 # Next.js app directory
    /api              # API routes
    /auth             # Authentication pages
    /dashboard        # Dashboard and user pages
    /exercises        # Exercise pages
  /components         # Reusable UI components
  /hooks              # Custom React hooks
  /lib                # Utility functions
  /types              # TypeScript type definitions
  /styles             # Global styles
```

## Features in Detail

### Authentication
- Email/Password authentication
- Google OAuth integration
- Protected routes with middleware

### Exercises
- Vocabulary flashcards with spaced repetition
- Grammar exercises
- Listening comprehension
- Speaking practice

### Progress Tracking
- Exercise completion statistics
- Learning streaks
- Performance analytics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 