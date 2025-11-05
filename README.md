# JosePauloCamp (React/Vite + Express)

Aplicação migrada do projeto EJS para SPA em React/Vite com backend Express/MongoDB.

## Requisitos

- Node.js 18+
- MongoDB rodando localmente (ou string de conexão em DB_URL)
- Conta Cloudinary (para upload de imagens)
- Token Mapbox (para geocodificação e mapas)

## Variáveis de Ambiente

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
