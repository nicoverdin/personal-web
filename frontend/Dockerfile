FROM node:20-slim  

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:3000

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]