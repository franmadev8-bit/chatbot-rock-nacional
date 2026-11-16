# Rock Nacional IA

Chatbot con RAG (Retrieval-Augmented Generation) que responde preguntas sobre bandas del rock argentino. Las respuestas salen solo de los documentos en Markdown de `data_source/`: si la información no está ahí, el bot dice que no la tiene en lugar de inventarla.

Es un proyecto de práctica para aprender a armar un pipeline de RAG de punta a punta: chunking, embeddings, búsqueda híbrida, reescritura de consultas con historial, autenticación y un front que consume todo.

## Stack

| Capa | Tecnología |
| --- | --- |
| Back | NestJS + TypeScript (ESM) |
| Base de datos | SQLite con Prisma 7 (`@prisma/adapter-better-sqlite3`) |
| Embeddings | Jina AI (`jina-embeddings-v5-text-small`, 1024 dimensiones) |
| LLM | Groq, a través del SDK de `openai` |
| Front | React 19 + Vite + TypeScript |
| UI | Ant Design 6 |
| HTTP | Axios |

## Estructura del repo

```
.
├── chatbot/          Back en NestJS
│   ├── data_source/  Documentos en Markdown, un archivo por banda
│   ├── prompts/      Prompts del sistema, del título y de la reescritura
│   ├── prisma/       Schema y migraciones
│   └── src/
└── chatbot-web/      Front en React + Vite
    └── src/
```

## Cómo funciona

### Indexado

El indexado es manual y se dispara con `POST /rag/index`, así `data_source/` se puede reindexar cada vez que cambia.

1. **Lectura:** se leen todos los `.md` de `data_source/`, salvo `FUENTES.md`.
2. **Chunking:** cada archivo se corta por secciones `## `. Las secciones de más de 1500 caracteres se parten por líneas. Cada chunk guarda la banda (`topic`), la sección, el texto, el archivo de origen y su orden.
3. **Embeddings:** los chunks se mandan a Jina en lotes de unos 20.000 tokens estimados, con la tarea `retrieval.passage`, en secuencia y con reintentos ante errores 429 o 5xx.
4. **Guardado:** los vectores se guardan en SQLite como `Float32` en un campo `Bytes`. El índice se reemplaza completo dentro de una transacción, junto con su metadata: modelo, dimensiones y cantidad de chunks.

Al arrancar, el back carga el índice completo en memoria. Si el modelo o las dimensiones no coinciden con la configuración actual, avisa que hay que reindexar.

### Búsqueda

La búsqueda es **híbrida**: combina la similitud semántica con un bonus por palabras clave.

- **Similitud semántica:** el producto punto entre el embedding de la pregunta (con la tarea `retrieval.query`) y el de cada chunk. Los vectores vienen normalizados, así que equivale a la similitud coseno.
- **Bonus por palabras clave:** hasta 0,2 puntos. Cada término pesa según su **IDF** (las palabras raras en `data_source/` valen más), y los **nombres propios** (palabras con mayúscula que no están al principio de la pregunta) pesan el triple. Esto corrige casos en los que el embedding se confunde; por ejemplo, "Divididos" se interpretaba como "separados".
- **Nombres desconocidos:** si la pregunta menciona un nombre propio que no aparece en ningún chunk, el bonus se anula. Así, una pregunta por una banda que no está en `data_source/` no pasa el umbral por coincidencias sueltas con otras palabras.

### Umbral y selección del contexto

- Si el mejor resultado no llega a `0,5`, el back responde que no tiene información, **sin llamar al LLM**.
- Si lo supera, entran al contexto los chunks que estén a menos de `0,1` del mejor, hasta un máximo de 5.

### Conversación

- **Historial:** cada pregunta se responde teniendo en cuenta los últimos 6 mensajes del chat.
- **Reescritura de la consulta:** antes de buscar, el LLM reescribe la pregunta para que se entienda sola. Por ejemplo, "¿Y cuál fue el último?" pasa a "¿Cuál fue el último disco de Sumo?". Si la reescritura falla, se usa la pregunta original.
- **Títulos automáticos:** al crear un chat, se le pone un título provisorio con el comienzo de la pregunta, y el LLM genera el definitivo en segundo plano.

### Autenticación

- JWT guardado en una cookie `httpOnly` (`access_token`), así el front nunca toca el token.
- Las rutas se protegen con un guard por controller.
- El logout revoca el token: guarda su `jti` en una tabla hasta que vence.
- Las contraseñas se guardan hasheadas.

### Front

El front sigue una arquitectura **MVVM**:

- **Model:** `models/` tiene los contratos, y `services/` las llamadas a la API con Axios.
- **Contextos:** `AuthProvider` y `ChatProvider` hacen las llamadas y guardan el estado compartido.
- **ViewModels:** los hooks de `hooks/` adaptan ese estado a cada vista y exponen los handlers.
- **Vistas:** `views/` compone las vistas a partir de los componentes de `components/`, todos con Ant Design.

En desarrollo, Vite reenvía todo lo que empieza con `/api` al back (`localhost:3000`). Como el navegador ve un solo origen, la cookie de sesión funciona sin configurar CORS.

## Requisitos

- Node.js 24
- pnpm 10
- Una API key de [Jina AI](https://jina.ai/embeddings/) y otra de [Groq](https://console.groq.com/keys). Las dos tienen un plan gratuito que no pide tarjeta.

## Puesta en marcha

### 1. Back

```bash
cd chatbot
pnpm install
```

pnpm bloquea por defecto los scripts de instalación. Aprobá los de `better-sqlite3` y Prisma, para que se compile el binario nativo:

```bash
pnpm approve-builds
pnpm rebuild better-sqlite3
```

Copiá las variables de entorno y completalas:

```bash
cp .env.example .env
```

Creá la base de datos y levantá el servidor:

```bash
pnpm prisma migrate dev
pnpm start:dev
```

### 2. Indexar `data_source/`

Con el back levantado, registrate, iniciá sesión y llamá a `POST /rag/index`. Esto genera los embeddings de todos los documentos y los guarda en SQLite. Hay que repetirlo cada vez que cambia algún archivo de `data_source/`.

### 3. Front

```bash
cd chatbot-web
pnpm install
pnpm dev
```

La app queda en `http://localhost:5173`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Ruta del archivo de SQLite, por ejemplo `file:./dev.db` |
| `JWT_SECRET` | Clave para firmar los tokens |
| `JWT_EXPIRES_IN` | Duración del token, con unidad (por ejemplo, `15m`) |
| `JINA_API_URL` | Endpoint de embeddings de Jina |
| `JINA_API_KEY` | API key de Jina |
| `JINA_MODEL` | Modelo de embeddings |
| `GROQ_API_KEY` | API key de Groq |
| `GROQ_MODEL` | Modelo de Groq que se usa para generar texto |

## API

Todas las rutas, salvo el registro y el login, requieren la cookie de sesión.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/sign-up` | Crea una cuenta: `{ name, email, password }` |
| `POST` | `/auth/sign-in` | Inicia sesión y deja la cookie: `{ email, password }` |
| `POST` | `/auth/sign-out` | Cierra la sesión y revoca el token |
| `GET` | `/auth/me` | Devuelve el usuario logueado |
| `GET` | `/chat` | Lista los chats del usuario, del más nuevo al más viejo |
| `GET` | `/chat/:id/messages` | Devuelve los mensajes de un chat |
| `POST` | `/chat/ask` | Envía una pregunta: `{ question, chatId? }`. Sin `chatId`, crea un chat nuevo |
| `POST` | `/rag/index` | Reindexa todo `data_source/` |

Ejemplo de respuesta de `/chat/ask`:

```json
{
  "chatId": "cb9ff5bf-6277-4f89-b0ad-cda83638828f",
  "title": "Discografía de Sumo",
  "answer": "El último disco de Sumo fue Fiebre, publicado en 1989...",
  "sources": [
    { "id": "sumo-cronologia-0", "topic": "Sumo", "section": "Cronología", "score": 0.845 }
  ]
}
```

## data_source

`data_source/` cubre a Patricio Rey y sus Redonditos de Ricota, Sumo, V8, Hermética, Ricardo Iorio, Viejas Locas, Intoxicados y Flema. Cada archivo tiene un título `#` con el nombre de la banda, una línea con la fecha de actualización y secciones `##` (formación, discografía, cronología, separación, etc.).

Para agregar una banda, creá un `.md` nuevo en `data_source/` con ese formato y volvé a indexar. Las fuentes consultadas están en `data_source/FUENTES.md`.

## Limitaciones

- El bot solo sabe lo que está en `data_source/`: no busca información en internet.
- La detección de nombres propios depende de que se escriban con mayúscula.
- Los mensajes que se cargan desde el historial no muestran sus fuentes, porque no se guardan en la base.
- El índice vive en memoria. Sirve para pocos documentos, como en este caso, pero para miles de documentos convendría una base vectorial.
