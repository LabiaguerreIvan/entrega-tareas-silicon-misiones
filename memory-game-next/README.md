# Memory Game - Juego de Memoria

## Descripción
Juego clásico de parejas Memory (Juego de Memoria) construido con Next.js App Router, JavaScript y Tailwind CSS. El juego presenta una cuadrícula de cartas volteables donde el objetivo es encontrar todas las parejas matching.

## Características
- **Cuadrícula 4x4 o 6x6** — Selecciona el tamaño del tablero antes de iniciar
- **Animaciones CSS 3D** — Las cartas giran con animaciones de flip en 3D
- **Contador de movimientos** — Se incrementa solo después de evaluar la pareja
- **Temporizador** — Empieza al hacer la primera carta, se detiene al ganar, formato `m:ss`
- **Pantalla de victoria** — Muestra el tiempo y movimientos con botón "Jugar de nuevo"
- **Anti-trampa** — El estado `evaluando` bloquea clics durante la comparación de parejas
- **Idioma completo en español** — README, componentes y comentarios del código

## Tecnologías
- Next.js 14 + App Router
- React 18
- Tailwind CSS 3
- lucide-react para iconos

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo Next.js |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter de Next.js |

## Cómo jugar

1. El juego comienza con un tablero 4x4 (16 cartas, 8 parejas)
2. Haz clic en una carta para voltearla
3. Haz clic en otra carta para intentar encontrar la pareja
4. Si las cartas coinciden, se mantienen volteadas. Si no, se ocultan después de unos segundos
5. Continúa hasta encontrar todas las parejas
6. Al ganar, se mostrará la pantalla de victoria con tu tiempo y movimientos

## Controles del Tablero

- Haz clic en las cartas para voltearlas
- Selecciona 4x4 o 6x6 con el selector de tamaño en la parte superior
- El temporizador empieza automáticamente al hacer la primera carta
- El contador de movimientos incrementa después de cada par evaluado

## Estructura del Proyecto

```
memory-game-next/
├── app/           # App Router de Next.js
│   ├── globals.css # Variables CSS y animaciones flip
│   ├── layout.jsx # Layout raíz con idioma español
│   └── page.jsx # Página principal con el juego
├── components/    # Componentes React
│   ├── Board.jsx   # Cuadrícula de cartas
│   ├── Card.jsx    # Carta individual con flip 3D
│   ├── GridSelector.jsx # selector 4x4/6x6
│   ├── Score.jsx   # Contador de movimientos
│   ├── Timer.jsx   # Temporizador m:ss
│   └── VictoryScreen.jsx # Pantalla de victoria
├── hooks/         # useGame.js — Estado central del juego
├── lib/           # gameLogic.js — Funciones puras
│   ├── crearTablero() # Genera y barreja el tablero
│   ├── shuffle()      # Fisher-Yates shuffle
│   ├── completarEvaluacion() # Evalúa par de cartas
│   └── formatearTiempo() # Formato m:ss
├── next.config.js # Configuración de Next.js
├── tailwind.config.js # Configuración de Tailwind
└── package.json   # Dependencias del proyecto
```

## Requisitos del Sistema
- Node.js 18+ recomendado
- npm o yarn

## Notas de Desarrollo
- Todas las componentes interactivas tienen la directiva `"use client"` al inicio
- Las funciones puras están en `lib/gameLogic.js` sin efectos secundarios
- El hook `useGame.js` gestiona todo el estado: tablero, movimientos, temporizador, anti-trampa
- Las animaciones flip usan CSS variables y clases Tailwind `transition-transform`
- El código incluye comentarios en español explicando la lógica anti-trampa y el contador de movimientos