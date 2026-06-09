# ¿Nos conocemos?

Juego de preguntas en tiempo real para dos personas.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm run install:all
```

Esto instala las dependencias del proyecto raíz, del servidor y del cliente.

## Correr localmente

```bash
npm start
```

Esto levanta en paralelo:
- **Servidor** en `http://localhost:3000` (WebSocket en el mismo puerto)
- **Cliente** en `http://localhost:5173`

Abre `http://localhost:5173` en tu navegador. Se genera automáticamente un ID de sala en la URL — copia ese link y compártelo con la otra persona.

## Estructura

```
wendy/
├── server/
│   ├── index.js        # Express + WebSocket server
│   └── questions.js    # Banco de preguntas
└── client/
    ├── index.html
    └── src/
        ├── App.jsx             # Lógica principal + WebSocket
        ├── App.css             # Todos los estilos
        ├── constants.js        # Metadata de categorías
        └── components/
            ├── Lobby.jsx       # Sala de espera + selector de categorías
            ├── Game.jsx        # Pantalla de juego
            ├── Timer.jsx       # Cronómetro SVG animado
            ├── ReactionBar.jsx # Barra de emojis
            └── EndScreen.jsx   # Pantalla final
```

## Cómo jugar

1. Abre `http://localhost:5173` — se crea una sala automáticamente
2. Copia el link que aparece y mándaselo a la otra persona
3. Cuando ambos estén conectados (2/2), seleccionen las categorías
4. Cualquiera de los dos puede presionar **¡Empezar juego!**
5. Respondan cada pregunta en voz alta — 60 segundos por pregunta
6. Usen **Pasar (3)** para preguntas incómodas (hay 3 pases por partida)
7. Reaccionen con los emojis — aparecen en ambas pantallas

## Protocolo WebSocket

### Cliente → Servidor
| Mensaje | Descripción |
|---|---|
| `join_room` | Entrar a una sala |
| `start` | Iniciar partida con categorías activas |
| `next` | Siguiente pregunta |
| `skip` | Pasar pregunta (consume un pase) |
| `reaction` | Enviar emoji de reacción |
| `reset` | Volver al lobby |

### Servidor → Cliente
| Mensaje | Descripción |
|---|---|
| `state` | Estado completo del juego |
| `tick` | Tick del cronómetro cada segundo |
| `reaction` | Reacción enviada por cualquier jugador |
| `player_count` | Número de jugadores conectados |
| `game_over` | Fin de la partida |
