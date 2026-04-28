/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Code, 
  Database, 
  Download, 
  GraduationCap, 
  Info, 
  PlayCircle,
  FileCode,
  Table as TableIcon,
  CheckCircle2
} from 'lucide-react';

// --- Types ---

interface CodeLine {
  code: string;
  explanation: string;
}

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  type: 'intro' | 'code' | 'exercise' | 'conclusion';
  content?: React.ReactNode;
  codeLines?: CodeLine[];
  resultData?: any[];
  csvTarget?: string;
}

// --- Data Constants for Client-Side Download ---

const ESTUDIANTES_CSV = `id_estudiante,nombre,edad,carrera,indice,aprobado
101,Ana Garcia,20,Ingenieria de Computacion,4.5,True
102,Luis Perez,22,Ingenieria Electronica,3.8,True
103,Maria Rodriguez,19,Matematicas,4.2,True
104,Jose Hernandez,21,Ingenieria de Computacion,2.9,False
105,Elena Martinez,23,Arquitectura,4.1,True
106,Pedro Castillo,20,Ingenieria Mecanica,3.5,True
107,Sofia Lopez,22,Ingenieria de Computacion,4.8,True
108,Carlos Ruiz,21,Matematicas,3.2,False
109,Diego Torres,20,Ingenieria de Computacion,3.9,True
110,Laura Gomez,19,Ingenieria Electronica,4.6,True
111,Andres Bello,24,Matematicas,2.5,False
112,Beatriz Gil,21,Arquitectura,4.9,True
113,Ricardo Zuloaga,22,Ingenieria Electronica,3.1,False
114,Carmen Perez,20,Ingenieria de Computacion,4.2,True
115,Samuel Robinson,23,Matematicas,4.7,True`;

const VENTAS_CSV = `fecha,producto,categoria,cantidad,precio_unitario,sucursal
2024-01-01,Laptop,Electronica,5,1200,Sartenejas
2024-01-02,Mouse,Accesorios,15,25,Litoral
2024-01-03,Monitor,Electronica,8,300,Sartenejas
2024-01-04,Teclado,Accesorios,10,45,Sartenejas
2024-01-05,Laptop,Electronica,2,1200,Litoral
2024-01-06,Impresora,Oficina,4,150,Sartenejas
2024-01-07,Mouse,Accesorios,20,25,Sartenejas
2024-01-08,Monitor,Electronica,5,300,Litoral
2024-01-09,Laptop,Electronica,3,1200,Sartenejas
2024-01-10,Teclado,Accesorios,12,45,Litoral
2024-01-11,Proyector,Electronica,2,500,Sartenejas
2024-01-12,Altavoces,Accesorios,10,80,Litoral
2024-01-13,Laptop,Electronica,4,1200,Sartenejas`;

// --- Components ---

const CodeViewer = ({ lines }: { lines: CodeLine[] }) => {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  return (
    <div className="bg-slate-900/50 rounded-2xl overflow-hidden shadow-inner border border-slate-700 font-mono text-sm group">
      <div className="flex justify-between items-center px-4 py-3 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-400 text-xs font-bold font-mono">pandas_tutorial.py</span>
        </div>
        <div className="flex gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        {lines.map((line, idx) => (
          <div 
            key={idx}
            className={`flex transition-all py-1 px-2 rounded-md ${hoveredLine === idx ? 'bg-indigo-500/10 border-l-2 border-indigo-500 -ml-2 pl-2.5' : 'border-l-2 border-transparent'}`}
            onMouseEnter={() => setHoveredLine(idx)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <span className="text-slate-500 w-8 text-right mr-4 select-none italic text-xs">{String(idx + 1).padStart(2, '0')}</span>
            <code className="text-slate-200 whitespace-pre">
              {line.code.split(' ').map((word, i) => {
                if (['import', 'as', 'from', 'df', 'print', ' Ventas'].includes(word.toLowerCase())) return <span key={i} className="text-pink-400">{word} </span>;
                if (word.startsWith("'") || word.startsWith('"')) return <span key={i} className="text-amber-200">{word} </span>;
                if (word.startsWith('#')) return <span key={i} className="text-slate-500 italic">{word} </span>;
                return <span key={i}>{word} </span>;
              }) || ' '}
            </code>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {hoveredLine !== null && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-indigo-500/10 border-t border-slate-700/50"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg shrink-0">
                <Info className="w-3 h-3 text-indigo-300" />
              </div>
              <p className="text-xs text-indigo-100/80 leading-relaxed italic pr-4">
                <span className="font-bold text-indigo-300 block not-italic mb-0.5 uppercase tracking-tighter text-[10px]">Explicación:</span>
                {lines[hoveredLine].explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DataTable = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-indigo-500/20 bg-indigo-900/10 backdrop-blur-sm shadow-sm">
      <table className="w-full text-[11px] text-left border-separate border-spacing-y-1 px-2 pb-2">
        <thead className="sticky top-0 text-indigo-400 font-bold">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-3 py-3 capitalize first:rounded-l-lg last:rounded-r-lg">{h.replace('_', ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody className="space-y-1">
          {data.map((row, i) => (
            <tr key={i} className="bg-slate-800/40 hover:bg-slate-700/60 transition-colors rounded-lg group">
              {headers.map((h, j) => (
                <td key={h} className={`px-3 py-2 text-slate-300 ${j === 0 ? 'rounded-l-lg font-mono text-indigo-300/80' : ''} ${j === headers.length - 1 ? 'rounded-r-lg' : ''}`}>
                  {row[h] === true ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : row[h] === false ? <span className="opacity-40">❌</span> : row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- App Content ---

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const slides: Slide[] = [
    {
      id: 'welcome',
      title: 'Dominando Pandas en Python',
      subtitle: 'Algoritmia y Programación 1 - Universidad Simón Bolívar',
      type: 'intro',
      content: (
        <div className="space-y-8 text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 3, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20"
            >
              <Database className="w-12 h-12" />
            </motion.div>
          </div>
          <p className="text-2xl font-medium text-slate-100 leading-relaxed">
            Bienvenidos, estudiantes. Hoy exploraremos la herramienta más potente para el análisis de datos en Python: <span className="text-indigo-400 font-black">Pandas</span>.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: BookOpen, label: 'Teoría Clara', color: 'bg-emerald-500/10 text-emerald-400' },
              { icon: Code, label: 'Código Real', color: 'bg-indigo-500/10 text-indigo-400' },
              { icon: PlayCircle, label: 'Ejercicios', color: 'bg-amber-500/10 text-amber-400' }
            ].map((item, i) => (
              <div key={i} className="p-5 bento-card-glass flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
                <div className={`p-3 rounded-full ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-80">{item.label}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setCurrentSlide(1)}
            className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto uppercase text-sm tracking-widest"
          >
            Comenzar Clase <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      id: 'simple',
      title: 'Nivel 1: Carga y Exploración Básica',
      subtitle: 'Comprendiendo el "DataFrame"',
      type: 'code',
      codeLines: [
        { code: 'import pandas as pd', explanation: 'Importamos la librería y le asignamos el alias universal "pd".' },
        { code: '', explanation: '' },
        { code: '# Cargar datos de estudiantes', explanation: 'Cargar un archivo CSV es el primer paso habitual.' },
        { code: "df = pd.read_csv('estudiantes.csv')", explanation: 'read_csv crea un objeto "DataFrame" que es como una hoja de cálculo potente.' },
        { code: '', explanation: '' },
        { code: '# Ver las primeras 5 filas', explanation: 'Antes de trabajar, siempre debemos ver qué tenemos.' },
        { code: 'print(df.head())', explanation: 'head() muestra las primeras filas para inspeccionar columnas y tipos de datos.' },
        { code: '', explanation: '' },
        { code: '# Resumen estadístico', explanation: 'Analizar tendencias numéricas rápidamente.' },
        { code: 'info_basica = df.describe()', explanation: 'describe() calcula media, desviación, min, max, etc., de columnas numéricas.' }
      ],
      resultData: [
        { id_estudiante: 101, nombre: 'Ana Garcia', edad: 20, carrera: 'Computacion', indice: 4.5 },
        { id_estudiante: 102, nombre: 'Luis Perez', edad: 22, carrera: 'Electronica', indice: 3.8 },
        { id_estudiante: 103, nombre: 'Maria Rodriguez', edad: 19, carrera: 'Matematicas', indice: 4.2 }
      ],
      csvTarget: 'estudiantes.csv'
    },
    {
      id: 'filtering-adv',
      title: 'Nivel 2.1: Filtrado de Multi-condición',
      subtitle: 'Operadores lógicos & (AND) y | (OR)',
      type: 'code',
      codeLines: [
        { code: '# ¿Qué estudiantes de Computación tienen un índice bajo?', explanation: 'Buscamos alumnos que necesiten tutoría académica.' },
        { code: 'riesgo = df[(df["carrera"] == "Computacion") & (df["indice"] < 3.5)]', explanation: 'Usamos & para requerir ambas condiciones. IMPORTANTE: Los paréntesis son obligatorios.' },
        { code: '', explanation: '' },
        { code: '# Alumnos veteranos o con índice muy alto', explanation: 'Buscamos perfiles para preparaduría.' },
        { code: 'preparadores = df[(df["edad"] >= 23) | (df["indice"] > 4.7)]', explanation: 'El operador | permite que se cumpla cualquiera de las dos condiciones.' },
        { code: '', explanation: '' },
        { code: '# Ver solo columnas específicas', explanation: 'No siempre necesitamos todas las columnas del DataFrame.' },
        { code: 'print(preparadores[["nombre", "indice"]])', explanation: 'Al pasar una LISTA de nombres de columnas, filtramos verticalmente los datos.' }
      ],
      resultData: [
        { nombre: 'Jose Hernandez', carrera: 'Computacion', indice: 2.9 },
        { nombre: 'Elena Martinez', edad: 23, carrera: 'Arquitectura', indice: 4.1 },
        { nombre: 'Sofia Lopez', edad: 22, carrera: 'Computacion', indice: 4.8 }
      ]
    },
    {
      id: 'cleaning',
      title: 'Nivel 2.2: Limpieza de Datos',
      subtitle: 'Tratando valores nulos y duplicados',
      type: 'code',
      codeLines: [
        { code: '# Detectar si hay valores vacíos', explanation: 'En el mundo real, los datos vienen con errores o huecos.' },
        { code: 'print(df.isnull().sum())', explanation: 'isnull() devuelve True si es nulo; sum() cuenta cuántos True hay por columna.' },
        { code: '', explanation: '' },
        { code: '# Opción A: Borrar filas incompletas', explanation: 'Si la fila no tiene sentido sin esos datos, la eliminamos.' },
        { code: 'df_limpio = df.dropna()', explanation: 'dropna() elimina cualquier fila que contenga al menos un valor NaN.' },
        { code: '', explanation: '' },
        { code: '# Opción B: Rellenar con un valor por defecto', explanation: 'Ideal para no perder registros estadísticos.' },
        { code: 'df["indice"] = df["indice"].fillna(0.0)', explanation: 'fillna(X) reemplaza todos los valores nulos de esa columna por X.' }
      ],
      resultData: [
        { columna: 'id_estudiante', nulos_encontrados: 0 },
        { columna: 'nombre', nulos_encontrados: 0 },
        { columna: 'indice', nulos_encontrados: 2, accion: 'fillna(0.0)' }
      ]
    },
    {
      id: 'medium',
      title: 'Nivel 2.3: Transformación Vectorizada',
      subtitle: 'Seleccionando subconjuntos de datos específicos',
      type: 'code',
      codeLines: [
        { code: '# Filtrar estudiantes destacados (indice > 4.0)', explanation: 'El filtrado se hace pasando una máscara booleana entre corchetes.' },
        { code: 'destacados = df[df["indice"] > 4.0]', explanation: "df['indice'] > 4.0 crea una serie de True/False. El DataFrame solo muestra los True." },
        { code: '', explanation: '' },
        { code: '# Crear una nueva columna', explanation: 'Podemos operar entre columnas o asignar valores fijos.' },
        { code: 'df["antiguedad"] = df["edad"] - 18', explanation: 'Operación vectorizada: se aplica a TODAS las filas en una sola línea de código.' }
      ],
      resultData: [
        { nombre: 'Ana Garcia', indice: 4.5, antiguedad: 2 },
        { nombre: 'Maria Rodriguez', indice: 4.2, antiguedad: 1 },
        { nombre: 'Sofia Lopez', indice: 4.8, antiguedad: 4 }
      ]
    },
    {
      id: 'complex',
      title: 'Nivel 3: Agrupación y Análisis (GroupBY)',
      subtitle: 'Resumiendo grandes volúmenes de datos',
      type: 'code',
      codeLines: [
        { code: '# Cargar datos de ventas reales', explanation: 'Usaremos un conjunto de datos más denso para este ejemplo.' },
        { code: "ventas = pd.read_csv('ventas.csv')", explanation: 'Leemos el archivo ventas.csv generado para la clase.' },
        { code: '', explanation: '' },
        { code: '# ¿Cuál es la sucursal que más vende?', explanation: 'Groupby es esencial para análisis categórico.' },
        { code: 'resumen = ventas.groupby("sucursal")["cantidad"].sum()', explanation: 'Agrupa por sucursal, toma la columna "cantidad" y suma sus valores.' },
        { code: '', explanation: '' },
        { code: '# Ordenar resultados', explanation: 'Visualizar los datos de mayor a menor.' },
        { code: 'resumen = resumen.sort_values(ascending=False)', explanation: 'sort_values organiza los datos. ascending=False los pone de mayor a menor.' }
      ],
      resultData: [
        { sucursal: 'Sartenejas', total_items: 47, facturacion_estimada: '$24,500' },
        { sucursal: 'Litoral', total_items: 25, facturacion_estimada: '$12,300' }
      ],
      csvTarget: 'ventas.csv'
    },
    {
      id: 'merging',
      title: 'Nivel 4: Combinando Tablas (Merge)',
      subtitle: 'Relacionando diferentes fuentes de datos',
      type: 'code',
      codeLines: [
        { code: '# Supongamos que tenemos un catálogo de departamentos', explanation: 'Es común tener la información normalizada en varias tablas.' },
        { code: 'departamentos = pd.DataFrame({"carrera": ["Matematicas", "Computacion"], "edificio": ["MEM", "MYS"]})', explanation: 'Creamos un DataFrame pequeño manualmente para el ejemplo.' },
        { code: '', explanation: '' },
        { code: '# Realizar el "JOIN"', explanation: 'Pandas usa merge para unir tablas basándose en una columna común.' },
        { code: 'df_completo = pd.merge(df, departamentos, on="carrera", how="left")', explanation: 'Unimos el df original con departamentos usando "carrera" como llave.' },
        { code: '', explanation: '' },
        { code: '# ¿Quién está en el edificio MYS?', explanation: 'Ahora podemos filtrar por datos que antes no estaban en la tabla.' },
        { code: 'print(df_completo[df_completo["edificio"] == "MYS"])', explanation: 'Seleccionamos a los alumnos que ahora tienen asignado el edificio MYS.' }
      ],
      resultData: [
        { nombre: 'Ana Garcia', carrera: 'Computacion', edificio: 'MYS' },
        { nombre: 'Luis Perez', carrera: 'Electronica', edificio: 'NaN' },
        { nombre: 'Maria Rodriguez', carrera: 'Matematicas', edificio: 'MEM' }
      ]
    },
    {
      id: 'timeseries',
      title: 'Nivel 5: Análisis Temporal',
      subtitle: 'Extrayendo valor de las fechas',
      type: 'code',
      codeLines: [
        { code: '# Convertir columna de texto a fecha real', explanation: 'Por defecto, Pandas lee las fechas como texto (Strings).' },
        { code: 'ventas["fecha"] = pd.to_datetime(ventas["fecha"])', explanation: 'to_datetime activa todas las herramientas de tiempo de Python.' },
        { code: '', explanation: '' },
        { code: '# Extraer el mes y el día de la semana', explanation: 'Útil para saber qué días se vende más.' },
        { code: 'ventas["mes"] = ventas["fecha"].dt.month', explanation: 'El atributo .dt permite acceder a propiedades de fecha (mes, año, hora).' },
        { code: 'ventas["dia_nombre"] = ventas["fecha"].dt.day_name()', explanation: 'day_name() nos devuelve "Monday", "Tuesday", etc.' },
        { code: '', explanation: '' },
        { code: '# ¿Qué mes tuvo más ventas?', explanation: 'Análisis estacional.' },
        { code: 'reporte_mensual = ventas.groupby("mes")["cantidad"].sum()', explanation: 'Agrupamos cronológicamente.' }
      ],
      resultData: [
        { fecha: '2024-01-01', mes: 1, dia_nombre: 'Monday', producto: 'Laptop' },
        { fecha: '2024-01-05', mes: 1, dia_nombre: 'Friday', producto: 'Teclado' }
      ]
    },
    {
      id: 'exercise',
      title: 'Reto para la Casa (USB)',
      subtitle: 'Caso: Análisis Curricular',
      type: 'exercise',
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-500/10 p-8 bento-card border-none border-l-4 border-indigo-500">
            <h4 className="font-black text-indigo-400 mb-3 flex items-center gap-3 text-lg">
              <GraduationCap className="w-6 h-6" /> Enunciado del Proyecto
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Considere el archivo <code className="bg-slate-900/50 px-2 py-0.5 rounded text-indigo-300 border border-slate-700 font-mono text-xs">estudiantes.csv</code>. 
              Escriba un programa en Python que calcule el <strong className="text-white">Índice Promedio</strong> por cada <strong className="text-white">Carrera</strong>, 
              pero solo considere a los alumnos que están <strong className="text-emerald-400">Aprobados</strong>.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bento-card-glass">
              <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-4">Estrategia de Solución</h5>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> <span className="opacity-80">Cargar el CSV con Pandas</span></li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> <span className="opacity-80">Filtrar: <code className="text-xs bg-slate-900 px-1 rounded text-orange-400">df['aprobado'] == True</code></span></li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> <span className="opacity-80">Agrupar por 'carrera'</span></li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> <span className="opacity-80">Aplicar <code className="text-xs bg-slate-900 px-1 rounded text-orange-400">.mean()</code> al indice</span></li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white flex flex-col justify-center items-center gap-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-20 h-20" />
              </div>
              <FileCode className="w-10 h-10 text-indigo-100" />
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-100 mb-1">Material de Apoyo</p>
                <p className="text-[11px] text-indigo-200 leading-tight px-4">Utilice el esqueleto de código proporcionado en las láminas anteriores.</p>
              </div>
              <button className="w-full bg-white text-indigo-900 py-3 rounded-2xl font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">
                Descargar Plantilla .py
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'end',
      title: '¡Clase Terminada!',
      subtitle: 'Resumen de Recursos',
      type: 'conclusion',
      content: (
        <div className="text-center space-y-8">
          <div className="relative inline-block">
            <motion.div 
               animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
               transition={{ repeat: Infinity, duration: 3 }}
               className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
          </div>
          
          <div className="max-w-md mx-auto space-y-6">
            <p className="text-slate-400 italic text-sm">"La mejor forma de aprender es metiendo las manos en el código."</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => downloadCSV(ESTUDIANTES_CSV, 'estudiantes.csv')}
                className="flex items-center justify-between p-5 bento-card-glass hover:bg-indigo-500/10 transition-colors group w-full text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-white uppercase tracking-tighter">estudiantes.csv</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Nivel 1 y 2</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button 
                onClick={() => downloadCSV(VENTAS_CSV, 'ventas.csv')}
                className="flex items-center justify-between p-5 bento-card-glass hover:bg-indigo-500/10 transition-colors group w-full text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-white uppercase tracking-tighter">ventas.csv</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Nivel 3</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => setCurrentSlide(0)}
            className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] hover:text-indigo-300 transition-colors pt-4 block mx-auto"
          >
            Reiniciar Clase
          </button>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col p-4 md:p-6 gap-4">
      {/* Header */}
      <header className="bento-card-glass px-6 py-5 shadow-2xl z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <motion.div 
               whileHover={{ scale: 1.1, rotate: 5 }}
               className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/20 text-white"
            >
              USB
            </motion.div>
            <div>
              <h1 className="text-xl font-black text-white leading-tight tracking-tighter">Algoritmia y Programación 1</h1>
              <p className="text-[10px] uppercase tracking-[0.35em] text-indigo-400 font-black opacity-80 italic">Seminario: Análisis de Datos con Pandas</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Clase Activa
            </div>
            <div className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-700">
               Pág. {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/5 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

        <div className="max-w-5xl w-full h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bento-card overflow-hidden flex-1 flex flex-col"
            >
              <div className="flex flex-col md:flex-row flex-1">
                
                {/* Visuals / Code Side */}
                <div className={`p-8 md:p-10 flex-1 flex flex-col ${current.type === 'intro' || current.type === 'conclusion' ? 'items-center justify-center text-center' : ''}`}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">{current.title}</h2>
                    <p className="text-indigo-400/60 text-xs font-black uppercase tracking-[0.2em]">{current.subtitle}</p>
                  </div>

                  {current.content && <div className="flex-1 w-full">{current.content}</div>}

                  {current.codeLines && (
                    <div className="flex-1 flex flex-col justify-center">
                      <CodeViewer lines={current.codeLines} />
                    </div>
                  )}
                </div>

                {/* Info / Result Side */}
                {current.type === 'code' && (
                  <div className="w-full md:w-[42%] bg-slate-900/40 p-8 md:p-10 border-l border-slate-700/50 flex flex-col gap-8 shadow-inner">
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-5 flex items-center gap-3 tracking-[0.2em]">
                        <TableIcon className="w-4 h-4" /> Vista Previa del Dataset
                      </h4>
                      <DataTable data={current.resultData || []} />
                      <p className="text-[9px] text-slate-500 mt-4 italic font-medium uppercase tracking-tighter opacity-50 text-center">320 registros omitidos...</p>
                    </div>

                    <div className="mt-auto space-y-5">
                      <div className="p-5 bg-indigo-900/20 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Info className="w-16 h-16" />
                        </div>
                        <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Concepto Clave</h5>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          {current.id === 'simple' && 'El método read_csv es el más común, pero Pandas soporta Excel, JSON, SQL e incluso HTML.'}
                          {current.id === 'medium' && 'El filtrado en Pandas utiliza "Lógica Vectorizada", lo que lo hace mucho más rápido que usar ciclos "for".'}
                          {current.id === 'complex' && 'Groupby sigue el paradigma Split-Apply-Combine: divide los datos, aplica el cálculo y los combina nuevamente.'}
                        </p>
                      </div>
                      
                      {current.csvTarget && (
                        <div className="flex items-center justify-between text-[11px] font-black text-indigo-300 bento-card-glass px-5 py-3 hover:bg-slate-700/50 transition-colors">
                          <span className="flex items-center gap-3"><Database className="w-4 h-4 text-indigo-400" /> {current.csvTarget}</span>
                          <button 
                            onClick={() => downloadCSV(current.csvTarget === 'estudiantes.csv' ? ESTUDIANTES_CSV : VENTAS_CSV, current.csvTarget as string)} 
                            className="p-2 hover:bg-indigo-500/20 rounded-xl transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bento-card-glass p-4 flex items-center justify-between px-8 shadow-2xl">
        <button 
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-3 px-6 py-2.5 text-xs font-black text-slate-500 hover:text-indigo-400 disabled:opacity-10 transition-all uppercase tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" /> Anterior
        </button>
        
        <div className="hidden sm:flex gap-3">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'w-4 bg-slate-700 hover:bg-slate-600'}`}
            />
          ))}
        </div>

        <button 
          onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 disabled:opacity-10 transition-all uppercase tracking-widest"
        >
          Siguiente <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
