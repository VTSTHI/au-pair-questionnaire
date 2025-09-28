# Quick Start Guide

## Starting the Application

### Option 1: Using the start script (Recommended)
```bash
./start.sh
```

### Option 2: Manual commands
```bash
# Generate Prisma client
npx prisma generate

# Start development server
npx next dev
```

### Option 3: Using npm (if npm is working properly)
```bash
npm run dev
```

## Accessing the Application

Once the server starts, you can access:

- **Home Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Questionnaire**: http://localhost:3000/questionnaire/[unique-token]

## First Steps

1. **Start the application** using one of the methods above
2. **Go to the Admin Dashboard** at http://localhost:3000/admin
3. **Generate an invitation link** by clicking "Generate New Invitation Link"
4. **Test the questionnaire** by visiting the generated link
5. **View submissions** in the admin dashboard

## Troubleshooting

If you encounter issues:

1. **Database not found**: Run `npx prisma db push` to recreate the database
2. **Dependencies missing**: Delete `node_modules` and `package-lock.json`, then run `npm install`
3. **Port already in use**: Add `--port 3001` to use a different port

## Key Features

✅ **Unique invitation links** - Each questionnaire has a secure, unique URL
✅ **Comprehensive forms** - 70+ fields covering all au pair profile aspects  
✅ **Admin dashboard** - View all submissions and generate new links
✅ **Audit logging** - Track all changes made to questionnaires
✅ **Auto-save** - Progress is saved automatically
✅ **Responsive design** - Works on desktop and mobile devices

## Project Structure

```
📁 src/
  📁 app/
    📄 page.tsx              # Home page
    📁 admin/
      📄 page.tsx            # Admin dashboard
    📁 questionnaire/[token]/
      📄 page.tsx            # Au pair questionnaire form
    📁 api/                  # Backend API routes
  📁 lib/
    📄 prisma.ts             # Database connection
    📄 token.ts              # Token generation utilities
📁 prisma/
  📄 schema.prisma           # Database schema
  📄 dev.db                  # SQLite database file
```

## Environment Variables

The application comes pre-configured with:
- `DATABASE_URL="file:./dev.db"` (SQLite database)
- Default base URL for local development

For production deployment, update these in your hosting environment.