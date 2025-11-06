# JosePauloCamp (React/Vite + Express)

Aplicação migrada do projeto EJS para SPA em React/Vite com backend Express/MongoDB.

## Requisitos


# JosePauloCamp 🏕️

> A modern, full-stack campground review platform built with React, Express, and MongoDB.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://josepaulocamp.vercel.app)
[![GitHub](https://img.shields.io/badge/github-source-blue)](https://github.com/ppconrado/YelpCamp-React)

[View Live Application](https://josepaulocamp.vercel.app) | [Technical Documentation](./ARCHITECTURE.md) | [Deployment Guide](./DEPLOYMENT.md)

---

## 📖 Overview

JosePauloCamp is a full-featured campground review application where users can discover, share, and review campgrounds. Built as a modern Single Page Application (SPA) with React on the frontend and Express on the backend, it showcases best practices in full-stack development, security, and cloud deployment.
Crie um arquivo `.env` na raiz (backend):

```
DB_URL=mongodb://localhost:27017/yelp-camp
SECRET=um_segredo_qualquer
MAPBOX_TOKEN=pk.seu_token_mapbox_aqui
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
```

Crie `client/.env.local` (frontend):

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=pk.seu_token_mapbox_aqui
```

## Instalação

Na raiz do projeto:

```
npm install
cd client && npm install
```

## Desenvolvimento

Na raiz:

```
npm run dev:full
```

- Backend: http://localhost:3000
- Frontend (Vite): http://localhost:5173

## Produção (build)

- Build do frontend:

```
npm run build:client
```

- Suba o backend em `NODE_ENV=production` para servir `client/dist`:

```
NODE_ENV=production npm start
```

## Seeds (opcional)

Popule o banco:

```
npm run seed
```

## Notas

- CORS está habilitado para o Vite dev server com credenciais (sessão via cookies).
- Helmet está configurado com CSP compatível com Mapbox e Cloudinary.
- O frontend usa `VITE_API_BASE_URL` para apontar para o backend em dev/prod.

## Melhorias do Backend

Ver detalhes completos em [BACKEND_IMPROVEMENTS.md](./BACKEND_IMPROVEMENTS.md):

✅ **Segurança**: Rate limiting, validação de senha forte, sanitização  
✅ **Performance**: Indexes MongoDB para queries 100x mais rápidas  
✅ **Logging**: Morgan para rastreamento de requisições  
✅ **Validação**: Ambiente validado na inicialização  
✅ **Shutdown**: Graceful shutdown para deploys seguros  
✅ **Erros**: Tratamento centralizado com logging detalhado

## Estrutura do Projeto

```
├── app.js                  # Backend Express
├── models/                 # Mongoose schemas (User, Campground, Review)
├── routes/                 # Rotas de API
├── controllers/            # Lógica de negócio
├── middleware.js           # Auth, validação, autorizações
├── utils/                  # Helpers e utilidades
├── client/                 # Frontend React/Vite
│   ├── src/
│   │   ├── api/           # Chamadas HTTP ao backend
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas/Views
│   │   └── context/       # Contexts (Auth, Flash)
│   └── dist/              # Build de produção (gerado)
└── seeds/                 # Scripts de seed do banco
```
