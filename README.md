# 🐆 Extermina a Jaguarcito - Simulador de Movimiento Parabólico

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

*Una aplicación web interactiva para visualizar y calcular la física del movimiento parabólico y la caída libre*

[Iniciar Proyecto](#-instalación) • [Características](#-características) • [Tecnologías](#-tecnologías) • [Uso](#-uso)

</div>

## 📋 Descripción

**Extermina a Jaguarcito** es un simulador educativo que implementa las leyes de la cinemática para calcular y visualizar el **movimiento parabólico**. Esta herramienta está diseñada para que estudiantes y entusiastas de la física puedan experimentar interactivamente con la trayectoria de un proyectil disparado hacia un objetivo en caída libre.

### 🎯 Objetivo Principal

- **Visualizar** la trayectoria exacta de un proyectil en un plano 2D.
- **Calcular** el tiempo, ángulo y posición en cada instante del vuelo.
- **Comprender** la independencia de los movimientos horizontal y vertical.
- **Experimentar** con la detección de colisiones basada en coordenadas físicas.

## ✨ Características

### ⚙️ Control de Parámetros
- **Velocidad Inicial**: Ajusta la fuerza del disparo (5 a 80 m/s).
- **Distancias y Alturas**: Modifica la distancia horizontal, la altura del objetivo y la altura del cañón.
- **Cálculo de Ángulo Automático**: El cañón se orienta matemáticamente hacia el objetivo inicial.
- **Gestión Dinámica**: Controles deslizantes (sliders) con actualización en tiempo real.

### 📊 Motor Físico
- **Cinemática**: Uso de gravedad estándar (`g = 9.81 m/s²`).
- **Trayectoria**: Cálculo de posiciones `(x, y)` mediante funciones trigonométricas en cada *frame*.
- **Detección de Colisiones**: Algoritmo de intersección calculando la distancia entre los centros de masa del proyectil y el objetivo.
- **Tiempo Simulado**: Sincronización de los cálculos matemáticos con los fotogramas del navegador usando `requestAnimationFrame`.

### 🎨 Visualización Interactiva
- **Gráficos SVG**: Renderizado limpio y escalable del plano cartesiano, trayectorias y entidades.
- **Rastro de Trayectoria**: Dibujo del arco parabólico del proyectil durante el vuelo.
- **Panel de Telemetría**: Visualización en vivo de las coordenadas del proyectil, el objetivo, el ángulo de disparo y el tiempo transcurrido.
- **Feedback Visual**: Alertas claras cuando ocurre un impacto exitoso.

### 💻 Interfaz de Usuario
- **Diseño Moderno**: UI oscura y elegante utilizando Tailwind CSS y componentes base.
- **Responsive Design**: Controles organizados en un panel lateral.
- **Botones de Acción**: Controles simples para Iniciar, Pausar y Reiniciar la simulación.

## 🛠 Tecnologías

### Frontend Core
- **React 18** - Biblioteca principal para la interfaz de usuario.
- **TypeScript** - Tipado estático para asegurar cálculos estrictos y prevención de errores.
- **Vite** - Build tool rápido y moderno.

### Estilos y UI
- **Tailwind CSS** - Framework de CSS utility-first para el diseño.
- **Componentes UI** - Basados en una arquitectura modular (tipo shadcn/ui) para Sliders, Botones y Tarjetas.

### Visualización
- **SVG Dinámico** - Generación y manipulación de gráficos vectoriales integrados directamente en el DOM de React.

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm
