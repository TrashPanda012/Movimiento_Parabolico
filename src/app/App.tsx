import { useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Label } from "./components/ui/label";
import jaguarcito from "../imports/jaguarcito.jpeg";

const G = 9.81;
const PX_PER_M = 8;
const COLLISION_THRESHOLD_M = 0.001;
const TARGET_COLLISION_RADIUS_PX = 34;
const PROJECTILE_RADIUS_PX = 5;

export default function App() {
  const [velocidad, setVelocidad] = useState(35);
  const [distancia, setDistancia] = useState(50);
  const [alturaObjetivo, setAlturaObjetivo] = useState(30);
  const [alturaCanon, setAlturaCanon] = useState(5);

  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [choque, setChoque] = useState(false);
  const [posProyectil, setPosProyectil] = useState({ x: 0, y: 5 });
  const [posObjetivo, setPosObjetivo] = useState({ x: 50, y: 30 });

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const simTimeRef = useRef(0);

  const theta = Math.atan2(alturaObjetivo - alturaCanon, distancia);
  const tiempoImpacto = distancia / (velocidad * Math.cos(theta));

  const canvasWidth = 900;
  const canvasHeight = 500;
  const groundY = canvasHeight - 40;

  const toCanvas = (xm: number, ym: number) => ({
    cx: 60 + xm * PX_PER_M,
    cy: groundY - ym * PX_PER_M,
  });

  const reiniciar = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTimeRef.current = null;
    simTimeRef.current = 0;
    setTiempo(0);
    setCorriendo(false);
    setChoque(false);
    setPosProyectil({ x: 0, y: alturaCanon });
    setPosObjetivo({ x: distancia, y: alturaObjetivo });
  };

  useEffect(() => {
  
  }, [velocidad, distancia, alturaObjetivo, alturaCanon]);

  useEffect(() => {
    if (!corriendo) return;

    const step = (ts: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      const previousT = simTimeRef.current;
      const nextT = previousT + dt;
      const impactaEnEsteFrame = previousT < tiempoImpacto && nextT >= tiempoImpacto;
      const t = impactaEnEsteFrame ? tiempoImpacto : nextT;
      simTimeRef.current = t;

      const px = velocidad * Math.cos(theta) * t;
      const py = alturaCanon + velocidad * Math.sin(theta) * t - 0.5 * G * t * t;

      const ox = distancia;
      const oy = alturaObjetivo - 0.5 * G * t * t;

      setTiempo(t);
      setPosProyectil({ x: px, y: py });
      setPosObjetivo({ x: ox, y: oy });

      const distMetros = Math.hypot(px - ox, py - oy);

      const radioColisionMetros = (TARGET_COLLISION_RADIUS_PX + PROJECTILE_RADIUS_PX) / PX_PER_M;

      if (impactaEnEsteFrame || distMetros <= radioColisionMetros + COLLISION_THRESHOLD_M) {
        setChoque(true);
        setCorriendo(false);
        rafRef.current = null;
        return;
      }

      if (py < -1 || oy < -1 || px > distancia + 20) {
        setCorriendo(false);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
 
  }, [corriendo]);

  const iniciar = () => {
    if (choque) return;
    setCorriendo(true);
  };
  const pausar = () => setCorriendo(false);

  const proyCanvas = toCanvas(posProyectil.x, Math.max(posProyectil.y, 0));
  const objCanvas = toCanvas(posObjetivo.x, Math.max(posObjetivo.y, 0));
  const canonPos = toCanvas(0, alturaCanon);
  const angleDeg = (theta * 180) / Math.PI;
  const trayectoriaProyectil = useMemo(() => {
    const muestras = Math.max(2, Math.ceil(tiempo * 45));

    return Array.from({ length: muestras + 1 }, (_, i) => {
      const t = (tiempo * i) / muestras;
      const x = velocidad * Math.cos(theta) * t;
      const y = alturaCanon + velocidad * Math.sin(theta) * t - 0.5 * G * t * t;
      const punto = toCanvas(x, Math.max(y, 0));

      return `${punto.cx.toFixed(2)},${punto.cy.toFixed(2)}`;
    }).join(" ");
    
  }, [tiempo, velocidad, theta, alturaCanon]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-1">
          <h1 className="tracking-tight">Extermina a Jaguarcito</h1>
          <p className="text-slate-400">
            Simulación del experimento clásico de movimiento parabólico y caída libre.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden border-slate-700 bg-slate-950/60 p-0 gap-0">
            <div className="relative">
              <svg
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                className="w-full"
                style={{ background: "linear-gradient(to bottom, #0f172a, #1e293b)" }}
              >
                <defs>
                  <clipPath id="cabeza-jaguarcito">
                    <path d="M -30 -6 C -39 -23 -31 -39 -15 -33 C -6 -45 9 -45 18 -33 C 35 -39 42 -20 30 -5 C 35 15 23 33 0 35 C -23 33 -36 15 -30 -6 Z" />
                  </clipPath>
                </defs>
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`v${i}`} x1={60 + i * 70} x2={60 + i * 70} y1={20} y2={groundY} stroke="#1e293b" strokeWidth={1} />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={`h${i}`} x1={60} x2={canvasWidth - 20} y1={groundY - i * 70} y2={groundY - i * 70} stroke="#1e293b" strokeWidth={1} />
                ))}

                <line x1={0} x2={canvasWidth} y1={groundY} y2={groundY} stroke="#64748b" strokeWidth={2} />

                <line
                  x1={canonPos.cx}
                  y1={canonPos.cy}
                  x2={toCanvas(distancia, alturaObjetivo).cx}
                  y2={toCanvas(distancia, alturaObjetivo).cy}
                  stroke="#475569"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />

                {tiempo > 0 && (
                  <g>
                    <polyline
                      points={trayectoriaProyectil}
                      fill="none"
                      stroke="#fb7185"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.9}
                    />
                    <polyline
                      points={trayectoriaProyectil}
                      fill="none"
                      stroke="#fecdd3"
                      strokeWidth={1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.8}
                    />
                  </g>
                )}

                <g transform={`translate(${canonPos.cx}, ${canonPos.cy}) rotate(${-angleDeg})`}>
                  <rect x={-4} y={-6} width={36} height={12} fill="#f59e0b" rx={2} />
                </g>
                <circle cx={canonPos.cx} cy={canonPos.cy} r={10} fill="#b45309" />
                <rect x={canonPos.cx - 8} y={canonPos.cy} width={16} height={groundY - canonPos.cy} fill="#78350f" />

                <g transform={`translate(${objCanvas.cx}, ${objCanvas.cy})`}>
                  <line x1={0} y1={-54} x2={0} y2={-34} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />
                  <path
                    d="M -30 -6 C -39 -23 -31 -39 -15 -33 C -6 -45 9 -45 18 -33 C 35 -39 42 -20 30 -5 C 35 15 23 33 0 35 C -23 33 -36 15 -30 -6 Z"
                    fill="#020617"
                    opacity={0.5}
                    transform="translate(2 3)"
                  />
                  <path
                    d="M -30 -6 C -39 -23 -31 -39 -15 -33 C -6 -45 9 -45 18 -33 C 35 -39 42 -20 30 -5 C 35 15 23 33 0 35 C -23 33 -36 15 -30 -6 Z"
                    fill="#f8fafc"
                    stroke="#facc15"
                    strokeWidth={4}
                    strokeLinejoin="round"
                  />
                  <g clipPath="url(#cabeza-jaguarcito)">
                    <image href={jaguarcito} x={-41} y={-36} width={120} height={120} preserveAspectRatio="xMinYMin meet" />
                  </g>
                  <path
                    d="M -30 -6 C -39 -23 -31 -39 -15 -33 C -6 -45 9 -45 18 -33 C 35 -39 42 -20 30 -5 C 35 15 23 33 0 35 C -23 33 -36 15 -30 -6 Z"
                    fill="none"
                    stroke="#78350f"
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                  <circle cx={10} cy={-13} r={8} fill="#ffffff" opacity={0.16} />
                </g>

                <circle cx={proyCanvas.cx} cy={proyCanvas.cy} r={5} fill="#ef4444" />

                <g>
                  <rect x={proyCanvas.cx + 8} y={proyCanvas.cy - 28} width={150} height={22} rx={4} fill="rgba(15,23,42,0.85)" stroke="#ef4444" />
                  <text x={proyCanvas.cx + 14} y={proyCanvas.cy - 13} fill="#fecaca" fontSize={11} fontFamily="monospace">
                    Proyectil ({posProyectil.x.toFixed(1)}, {posProyectil.y.toFixed(1)}) m
                  </text>
                </g>
                <g>
                  <rect x={objCanvas.cx + 42} y={objCanvas.cy - 13} width={150} height={22} rx={4} fill="rgba(15,23,42,0.85)" stroke="#a16207" />
                  <text x={objCanvas.cx + 48} y={objCanvas.cy + 2} fill="#fde68a" fontSize={11} fontFamily="monospace">
                    Objetivo ({posObjetivo.x.toFixed(1)}, {posObjetivo.y.toFixed(1)}) m
                  </text>
                </g>

                {choque && (
                  <g>
                    <rect x={canvasWidth / 2 - 160} y={canvasHeight / 2 - 35} width={320} height={70} rx={8} fill="rgba(239,68,68,0.95)" />
                    <text x={canvasWidth / 2} y={canvasHeight / 2 + 8} fill="#fff" fontSize={26} fontWeight="bold" textAnchor="middle">
                      ¡El choque ocurrió!
                    </text>
                  </g>
                )}
              </svg>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-700 bg-slate-900/80 p-4">
                <Button onClick={iniciar} disabled={corriendo || choque} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  Iniciar Disparo
                </Button>
                <Button onClick={pausar} disabled={!corriendo} variant="secondary">
                  Pausar Animación
                </Button>
                <Button onClick={reiniciar} variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800 hover:text-white">
                  Reiniciar
                </Button>
                <div className="ml-auto font-mono text-sm text-slate-400">
                  t = {tiempo.toFixed(2)} s · θ = {angleDeg.toFixed(2)}°
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-slate-700 bg-slate-950/60 p-5 gap-0 space-y-6">
            <div>
              <h2 className="text-slate-100">Controles</h2>
              <p className="text-xs text-slate-400">Ajusta los parámetros del experimento.</p>
            </div>

            <ControlSlider label="Velocidad Inicial" unidad="m/s" value={velocidad} min={5} max={80} step={1} onChange={setVelocidad} />
            <ControlSlider label="Distancia horizontal" unidad="m" value={distancia} min={10} max={100} step={1} onChange={setDistancia} />
            <ControlSlider label="Altura del objetivo" unidad="m" value={alturaObjetivo} min={1} max={50} step={1} onChange={setAlturaObjetivo} />
            <ControlSlider label="Altura del cañón" unidad="m" value={alturaCanon} min={0} max={40} step={1} onChange={setAlturaCanon} />

            <div className="rounded-md border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300 space-y-1 font-mono">
              <div>Proyectil: ({posProyectil.x.toFixed(2)}, {posProyectil.y.toFixed(2)}) m</div>
              <div>Objetivo:  ({posObjetivo.x.toFixed(2)}, {posObjetivo.y.toFixed(2)}) m</div>
              <div>Ángulo:    {angleDeg.toFixed(2)}°</div>
              <div>Tiempo:    {tiempo.toFixed(3)} s</div>
            </div>

            {choque && (
              <div className="rounded-md border border-red-500 bg-red-500/10 p-3 text-center font-bold text-red-300">
                ¡El choque ocurrió!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({
  label,
  unidad,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unidad: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label className="text-slate-200">{label}</Label>
        <span className="font-mono text-sm text-emerald-400">
          {value} {unidad}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}
