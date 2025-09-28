# Au Pair Questionnaire System

A comprehensive web application for managing au pair applications with secure questionnaire forms, admin dashboard, and audit logging.

## Features

- **Secure Questionnaire System**: Unique invitation links for each au pair
- **Comprehensive Forms**: Detailed questionnaire covering all aspects of au pair applications
- **Admin Dashboard**: Overview of all submitted questionnaires with management tools
- **Audit Logging**: Complete change tracking for all questionnaire modifications
- **Real-time Updates**: Auto-save functionality and real-time data synchronization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Unique token-based access

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd au-pair-questionnaire
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Administrators

1. Navigate to `/admin` to access the admin dashboard
2. Click "Generate New Invitation Link" to create unique questionnaire links
3. Share the generated links with au pairs
4. View submitted questionnaires in the overview table
5. Click "Audit Logs" to see change history for any questionnaire

### For Au Pairs

1. Use the unique invitation link provided by the administrator
2. Fill out the comprehensive questionnaire
3. Save your progress at any time
4. Return to the same link to edit your responses

## Database Schema

The application uses two main models:

- **AuPairQuestionnaire**: Stores all questionnaire data including personal information, experience, preferences, etc.
- **AuditLog**: Tracks all changes made to questionnaires for administrator review

## API Endpoints

- `GET/PUT /api/questionnaire/[token]` - Retrieve and update questionnaire data
- `POST /api/admin/generate-link` - Generate new invitation links
- `GET /api/admin/overview` - Get overview of all questionnaires
- `GET /api/admin/audit-logs/[id]` - Retrieve audit logs for a specific questionnaire

## Environment Variables

The application uses the following environment variable:

- `DATABASE_URL`: SQLite database connection string (default: "file:./dev.db")
- `NEXT_PUBLIC_BASE_URL`: Base URL for invitation links (default: "http://localhost:3000")

## Deployment

### Local Production Build

```bash
npm run build
npm start
```

### Vercel Deployment

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Hosting Providers

The application can be deployed to any hosting provider that supports Node.js applications. For production, consider upgrading from SQLite to PostgreSQL by updating the `DATABASE_URL` environment variable and the Prisma schema.

## Security Considerations

- Each questionnaire is accessible only via its unique token
- Admin functions are separated from public questionnaire access
- All data changes are logged for audit purposes
- No authentication system is implemented - access control is token-based

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is available for use under standard open source licensing terms.
