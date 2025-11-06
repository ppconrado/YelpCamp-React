# 📦 DEPLOYMENT.md - Guia de Deploy

## 🎯 Visão Geral

Este projeto usa uma arquitetura separada:

- **Frontend (React)**: Deploy no Vercel
- **Backend (Express)**: Deploy no Render
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary

---

## 🚀 Parte 1: Deploy do Backend (Render)

### Passo 1: Preparar o Repositório

✅ Já feito - Código pronto para deploy

### Passo 2: Criar Conta no Render

1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Conecte sua conta do GitHub

### Passo 3: Criar Web Service

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório `YelpCamp-React`
4. Configure:
   - **Name**: `yelpcamp-backend` (ou o nome que preferir)
   - **Region**: US West (Oregon) ou mais próximo de você
   - **Branch**: `main`
   - **Root Directory**: (deixe vazio - raiz do projeto)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Plan**: Free

### Passo 4: Configurar Variáveis de Ambiente

No Render, na seção "Environment", adicione:

```
NODE_ENV=production
DB_URL=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/yelpcamp?retryWrites=true&w=majority
SECRET=seu-secret-super-seguro-aqui-minimum-32-caracteres
CLOUDINARY_CLOUD_NAME=seu-cloudinary-cloud-name
CLOUDINARY_KEY=sua-cloudinary-key
CLOUDINARY_SECRET=seu-cloudinary-secret
MAPBOX_TOKEN=seu-mapbox-token
FRONTEND_URL=https://seu-app.vercel.app
```

⚠️ **IMPORTANTE**:

- `FRONTEND_URL` será preenchido após deploy do frontend (Passo 2)
- Por enquanto, deixe como: `FRONTEND_URL=http://localhost:5173`

### Passo 5: Deploy

1. Clique em "Create Web Service"
2. Aguarde o build (~2-3 minutos)
3. ✅ Anote a URL: `https://yelpcamp-backend-xxxx.onrender.com`

---

## 🎨 Parte 2: Deploy do Frontend (Vercel)

### Passo 1: Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Conecte sua conta do GitHub

### Passo 2: Importar Projeto

1. No dashboard, clique em "Add New... > Project"
2. Selecione seu repositório `YelpCamp-React`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Passo 3: Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
VITE_API_URL=https://yelpcamp-backend-xxxx.onrender.com
VITE_MAPBOX_TOKEN=seu-mapbox-token
```

⚠️ Substitua `yelpcamp-backend-xxxx.onrender.com` pela URL do Render (Parte 1, Passo 5)

### Passo 4: Deploy

1. Clique em "Deploy"
2. Aguarde o build (~1-2 minutos)
3. ✅ Anote a URL: `https://seu-app.vercel.app`

---

## 🔄 Parte 3: Conectar Frontend e Backend

### Atualizar Backend com URL do Frontend

1. Volte ao Render dashboard
2. Acesse seu web service `yelpcamp-backend`
3. Vá em "Environment"
4. Atualize a variável:
   ```
   FRONTEND_URL=https://seu-app.vercel.app
   ```
5. Clique em "Save Changes"
6. O Render fará redeploy automático

---

## ✅ Parte 4: Verificar Deploy

### Checklist:

- [ ] Backend responde em `https://yelpcamp-backend-xxxx.onrender.com/api/campgrounds`
- [ ] Frontend carrega em `https://seu-app.vercel.app`
- [ ] Login funciona
- [ ] Pode criar campground
- [ ] Imagens fazem upload (Cloudinary)
- [ ] Mapa aparece (Mapbox)

### Testar CORS:

Abra o console do navegador (F12) no frontend e verifique se não há erros de CORS.

---

## 🐛 Troubleshooting Comum

### Backend não conecta ao MongoDB

- Verifique se o IP do Render está na whitelist do MongoDB Atlas
- No Atlas: Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0)

### Frontend não conecta ao Backend

- Verifique se `VITE_API_URL` no Vercel aponta para a URL correta do Render
- Verifique se `FRONTEND_URL` no Render aponta para a URL correta do Vercel
- Confira se cookies estão configurados com `sameSite: 'none'` e `secure: true`

### Backend "dorme" (cold start)

- É normal no plano free do Render
- Primeiro acesso após 15min de inatividade demora ~30s
- Solução: usar cron job para manter acordado (opcional)

### Erro de Session/Cookie

- Certifique-se que `withCredentials: true` está no Axios (http.js)
- Verifique se cookie está com `secure: true` e `sameSite: 'none'` em produção

---

## 🔄 Deploy Automático

### Configurado! ✅

- Push para `main` → Vercel e Render redeployam automaticamente
- Desenvolvimento local usa `.env.local` (não comitar!)
- Produção usa variáveis do Vercel/Render

---

## 📝 Variáveis de Ambiente - Resumo

### Backend (Render):

```
NODE_ENV=production
DB_URL=mongodb+srv://...
SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
MAPBOX_TOKEN=...
- Frontend:
FRONTEND_URL=https://josepaulocamp.vercel.app
```

### Frontend (Vercel):

```
VITE_API_URL=https://josepaulocamp-backend.onrender.com
VITE_MAPBOX_TOKEN=...
```

---

## 🎉 Pronto!

Sua aplicação está no ar:

- Frontend: https://josepaulocamp.vercel.app
- Backend: https://josepaulocamp-backend.onrender.com/

Qualquer push no GitHub atualiza automaticamente! 🚀
