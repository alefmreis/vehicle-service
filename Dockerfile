
FROM node:20.16 as base_build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# SERVER
FROM gcr.io/distroless/nodejs20-debian12 as server
WORKDIR /app
COPY --from=base_build /app /app
CMD ["dist/server.js"]

# LAMBDA
FROM public.ecr.aws/lambda/nodejs:20 as lambda
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=base_build /app/dist ./
COPY --from=base_build /app/package*.json ./
RUN npm install --omit=dev --non-interactive
CMD ["lambda.handler"]
