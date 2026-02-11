# Chatbot Clinica COF

Este repositorio contem um frontend em React (Vite) e um backend em Node/Express que conecta o chat ao modelo da OpenAI. O objetivo e atender pacientes com um fluxo de triagem seguindo regras estritas definidas no prompt do backend.

## Estrutura
- `frontend/`: Interface web do chat.
- `backend/`: API que chama a OpenAI.

## Requisitos
- Node.js 18+
- NPM 9+

## Configuracao do backend
1. Instale dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Crie o arquivo de ambiente:
   ```bash
   copy .env.example .env
   ```
3. Edite `.env` e informe sua chave:
   ```env
   OPENAI_API_KEY=chave_aqui
   OPENAI_MODEL=gpt-5
   PORT=3001
   ```

## Rodar o backend
```bash
cd backend
npm run dev
```

## Rodar o frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend usa proxy do Vite para encaminhar chamadas `/api` para `http://localhost:3001`.

## Endpoints
- `GET /api/health` => status simples
- `POST /api/chat` => recebe `{ messages: [{ role, content }] }` e retorna `{ reply }`

## Observacoes importantes
- A chave da OpenAI deve ficar somente no backend.
- Se ocorrer erro 429 (quota/billing), verifique seu plano e limites no painel da OpenAI.

## Scripts
### Backend
- `npm run dev` inicia com `node --watch`
- `npm start` inicia em modo normal

### Frontend
- `npm run dev` inicia o Vite
- `npm run build` gera o build

## Licenca
Uso interno.
