# Fé Match

> Deus une, vocês dão match

App de relacionamento para jovens cristãos (maiores de 18). Só mobile: iOS e Android.

| Pasta     | O quê                                                               |
| --------- | ------------------------------------------------------------------- |
| `mobile/` | App React Native com Expo (SDK 58), Expo Router e TypeScript strict |
| `server/` | API em Node.js + Express 5 + TypeScript, PostgreSQL com Prisma 7    |

As duas pastas são projetos independentes, cada uma com o seu `package.json`.
Corre os comandos **dentro** da pasta respetiva. A configuração do Prettier
(`.prettierrc`) está na raiz e é partilhada pelas duas.

## Requisitos

- Node.js 22.18+ (ou 24 / 26)
- PostgreSQL 15+ a correr localmente
- iPhone com a app **Expo Go** (App Store), na mesma rede Wi-Fi que o computador
- Para Android: Android Studio com um emulador criado

## 1. Servidor

```bash
cd server
cp .env.example .env        # depois edita o .env com os teus valores
createdb fe_match           # cria a base de dados (uma vez)
npm install                 # também gera o cliente Prisma
npm run db:migrate          # aplica as migrações
npm run db:seed             # cria 10 utilizadores fictícios
npm run dev                 # arranca em http://localhost:3000 com reload automático
```

Testar: `curl http://localhost:3000/health` → `{"status":"ok"}`

| Script               | O que faz                                                     |
| -------------------- | ------------------------------------------------------------- |
| `npm run dev`        | Servidor em modo desenvolvimento (reinicia ao gravar)         |
| `npm run build`      | Compila para `dist/`                                          |
| `npm start`          | Corre a versão compilada                                      |
| `npm run db:migrate` | Cria/aplica migrações depois de mudar o `schema.prisma`       |
| `npm run db:seed`    | Repõe os utilizadores fictícios (pode correr-se várias vezes) |
| `npm run db:reset`   | Apaga a BD, reaplica as migrações e corre o seed              |
| `npm run db:studio`  | Abre o Prisma Studio para ver os dados no browser             |
| `npm run lint`       | ESLint                                                        |
| `npm run typecheck`  | Verificação de tipos do TypeScript                            |
| `npm run format`     | Formata o código com Prettier                                 |

Os utilizadores do seed têm emails `nome@example.com` (ex.: `beatriz@example.com`)
e a password definida em `SEED_USER_PASSWORD` no teu `.env`.

## 2. App mobile

```bash
cd mobile
npm install
npx expo start
```

- **iPhone (Expo Go):** abre a app Câmara e aponta para o QR code que aparece no
  terminal. O iPhone e o computador têm de estar na mesma rede Wi-Fi. Se não
  ligar (redes de universidade costumam bloquear), usa `npx expo start --tunnel`.
- **Emulador Android:** com o terminal do `expo start` aberto, carrega na tecla `a`.
  O Expo abre o emulador e instala o Expo Go sozinho.

### Ligar a app ao servidor (para a próxima fase)

No telemóvel, `localhost` é o próprio telemóvel e não o teu computador. Cria
`mobile/.env` a partir de `mobile/.env.example`:

- iPhone físico: `EXPO_PUBLIC_API_URL=http://IP_DO_COMPUTADOR:3000`
  (no Mac: `ipconfig getifaddr en0`)
- Emulador Android: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`

Depois de mudar o `.env`, reinicia o `npx expo start`.

| Script              | O que faz                          |
| ------------------- | ---------------------------------- |
| `npm start`         | Servidor de desenvolvimento Expo   |
| `npm run lint`      | ESLint (config do Expo + Prettier) |
| `npm run typecheck` | Verificação de tipos               |
| `npm run format`    | Formata com Prettier               |

## Onde mudar o quê

- **Nome e slogan da app:** `mobile/src/config/brand.json` (exposto como
  `APP_NAME` / `APP_SLOGAN` em `mobile/src/config/app.ts`)
- **Cores, tipografia, espaçamentos, cantos:** `mobile/src/theme/`
- **Modelo de dados:** `server/prisma/schema.prisma`. Depois de mudar, corre
  `npm run db:migrate`.

## Segurança

- Nenhuma password ou chave está no código: tudo vem do `.env`, que não vai para o git.
- Variáveis `EXPO_PUBLIC_*` ficam visíveis dentro da app. Nunca pôr segredos aí.
- A regra dos 18 anos está garantida na própria base de dados (constraint `users_min_age_18`).
