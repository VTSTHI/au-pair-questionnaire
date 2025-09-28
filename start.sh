#!/bin/bash
echo "Starting Au Pair Questionnaire System..."
echo "Generating Prisma client..."
npx prisma generate
echo "Starting Next.js development server..."
npx next dev --port 3000