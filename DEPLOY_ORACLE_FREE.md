# Deploy em maquina gratuita e fraca (Oracle Cloud Always Free)

Este passo a passo sobe o projeto em uma VM pequena (ARM ou AMD), sem depender de plano pago e sem encerrar o processo do Node quando voce fecha o terminal.

## 1) Criar a VM gratuita
1. Crie conta em Oracle Cloud Free Tier.
2. Em **Compute > Instances > Create instance**:
   - Imagem: Ubuntu 22.04
   - Shape gratis (Always Free)
   - Libere as portas **22**, **80**, **443** (e 3001 temporariamente, se quiser testar direto)
3. Acesse via SSH:
   ```bash
   ssh ubuntu@SEU_IP_PUBLICO
   ```

## 2) Preparar servidor
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx
```

Instale Node 20 LTS:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Instale PM2 globalmente (mantem app rodando):
```bash
sudo npm i -g pm2
pm2 -v
```

## 3) Clonar projeto e instalar dependencias
```bash
git clone <URL_DO_SEU_REPO>.git
cd chat-bot-medico

cd backend && npm install
cd ../frontend && npm install && npm run build
cd ..
```

## 4) Configurar variaveis do backend
No `backend/.env`:
```env
OPENAI_API_KEY=coloque_sua_chave
OPENAI_MODEL=gpt-5
PORT=3001
```

> Importante: nunca exponha `OPENAI_API_KEY` no frontend.

## 5) Subir backend com PM2 (nao encerra)
```bash
cd backend
pm2 start server.js --name chatbot-backend
pm2 save
pm2 startup
```

O `pm2 startup` vai mostrar um comando `sudo ...` para habilitar auto start no boot. Copie e execute esse comando.

Checar status:
```bash
pm2 status
pm2 logs chatbot-backend
```

## 6) Publicar frontend com Nginx
Copie build do Vite:
```bash
cd ~/chat-bot-medico
sudo rm -rf /var/www/chatbot
sudo mkdir -p /var/www/chatbot
sudo cp -r frontend/dist/* /var/www/chatbot/
```

Crie config do site:
```bash
sudo tee /etc/nginx/sites-available/chatbot <<'NGINX'
server {
  listen 80;
  server_name _;

  root /var/www/chatbot;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
NGINX
```

Ative site e recarregue Nginx:
```bash
sudo ln -sf /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/chatbot
sudo nginx -t
sudo systemctl restart nginx
```

## 7) HTTPS gratis com Let's Encrypt (opcional, recomendado)
Se tiver dominio apontado para o IP da VM:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## 8) Atualizacao sem derrubar tudo
Sempre que atualizar codigo:
```bash
cd ~/chat-bot-medico
git pull

cd frontend && npm install && npm run build
sudo cp -r dist/* /var/www/chatbot/

cd ../backend && npm install
pm2 restart chatbot-backend
```

## 9) Checklist de estabilidade
- Ver se backend esta no ar: `curl http://127.0.0.1:3001/api/health`
- Ver processos: `pm2 status`
- Ver logs: `pm2 logs chatbot-backend --lines 100`
- Reinicio automatico no boot: `pm2 startup` + `pm2 save`
- Firewall aberto para 80/443.

## 10) Alternativa ainda mais simples (sem Nginx)
Se quiser subir rapido, rode so backend com PM2 e acesse por `http://IP:3001`. Nao e o ideal para producao, mas funciona em maquina fraca e nao encerra.

---

Se quiser, o proximo passo pode ser adicionar **Docker + docker compose** para facilitar restore e migracao para outro host gratis.
