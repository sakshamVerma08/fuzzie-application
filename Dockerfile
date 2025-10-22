# STage 1- Build Stage
FROM node:20-bullseye-slim AS builder

WORKDIR /app

#Clerk Variables
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL

ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

#Cloudinary Variables
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_URL
ARG NEXT_PUBLIC_CLOUDINARY_API_KEY

#NextJS Variables
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_OAUTH2_ENDPOINT
ARG NEXT_PUBLIC_SCHEME

#Social variables 
ARG NEXT_PUBLIC_GOOGLE_SCOPES
ARG NEXT_PUBLIC_DISCORD_REDIRECT
ARG NEXT_PUBLIC_NOTION_AUTH_URL
ARG NEXT_PUBLIC_SLACK_REDIRECT



COPY package.json package-lock.json prisma ./
RUN npm ci 

COPY . .

RUN npm run build



# Stage 2 -- Runner Setup

FROM node:20-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what is needed to run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./ 
COPY --from=builder /app/prisma ./prisma

# Just for safety, re-generate the Prisma Client.
RUN npx prisma generate


EXPOSE 3000

CMD ["npm","run","start"]

