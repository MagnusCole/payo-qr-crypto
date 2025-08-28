# Payo - App de Finanzas Personales

## 🎯 Resumen
Aplicación de finanzas personales construida sobre la base de Payo (plataforma de pagos crypto). Incluye gestión de ingresos/gastos, categorías, sugerencias inteligentes y gráficos de divisas.

## 🚀 Características Implementadas

### ✅ Funcionalidades Core
- **Dashboard Financiero**: Balance total, ingresos, gastos con cards glassmorphism
- **Gestión de Transacciones**: Agregar ingresos/gastos con categorías
- **Categorización**: comida, transporte, ocio, inversión, otros
- **Persistencia**: LocalStorage con Zustand
- **Gráficos**: Pie chart de gastos por categoría (Recharts)
- **Divisas**: Gráfico de línea USD/PEN con datos históricos

### ✅ Páginas
- **Dashboard** (`/`): Vista principal con estadísticas y transacciones recientes
- **AddTx** (`/add`): Formulario para agregar nuevas transacciones
- **Suggestions** (`/suggestions`): Sistema de alertas y recomendaciones
- **Currency** (`/currency`): Gráfico de evolución de divisas

### ✅ Componentes
- **BottomNav**: Navegación inferior con estilo glass
- **FabAdd**: Botón flotante para agregar transacciones
- **PayoLogo**: Logo reutilizable con diferentes tamaños

### ✅ Diseño
- **Glassmorphism**: Efectos de vidrio con gradientes
- **Tema Oscuro**: Por defecto con colores vibrantes
- **Responsive**: Optimizado para móvil y desktop
- **Gradientes**: Primario (lima-esmeralda) y secundario (cian-azul)

## 🏗️ Arquitectura

```
src/
├── domain/
│   ├── types.ts      # Tipos TypeScript (Transaction, Budget, etc.)
│   └── rules.ts      # Lógica de negocio (alertas, validaciones)
├── store/
│   └── useFinance.ts # Estado global con Zustand
├── components/
│   ├── BottomNav.tsx # Navegación inferior
│   └── FabAdd.tsx    # Botón flotante
└── pages/
    ├── Dashboard.tsx # Dashboard principal
    ├── AddTx.tsx     # Agregar transacción
    ├── Suggestions.tsx # Alertas y recomendaciones
    └── Currency.tsx   # Gráfico de divisas
```

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Estado**: Zustand (ligero, sin boilerplate)
- **Gráficos**: Recharts
- **Enrutamiento**: React Router v6
- **Persistencia**: LocalStorage
- **Iconos**: Lucide React

## 📊 Datos

### Transacciones
- **Tipos**: Ingreso / Gasto
- **Categorías**: comida, transporte, ocio, inversión, otros
- **Campos**: monto, tipo, categoría, nota, fecha
- **Persistencia**: LocalStorage automático

### Divisas
- **Archivo**: `public/data/rates.json`
- **Formato**: Array de objetos con fecha y tasa USD/PEN
- **Período**: 30 días de datos históricos

## 🎨 Sistema de Diseño

### Colores
- **Primary**: hsl(142, 76%, 36%) - Lima esmeralda
- **Secondary**: hsl(200, 98%, 39%) - Cian azul
- **Background**: Gradiente aurora (azul oscuro)
- **Glass**: Efectos de transparencia con blur

### Componentes UI
- **Cards**: `glass` con sombras glow
- **Botones**: Variantes `payo`, `glass`, `success`, `warning`, `danger`
- **Inputs**: Estilo glass con bordes sutiles
- **Navegación**: Bottom nav con estados activos

## 🚀 Cómo Usar

### Desarrollo
```bash
npm install
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

### Flujo de Usuario
1. **Login** → Dashboard (manteniendo funcionalidad original)
2. **Dashboard** → Ver balance, transacciones recientes, gráfico de categorías
3. **+ Añadir** → Crear nueva transacción (ingreso/gasto)
4. **Sugerencias** → Ver alertas y recomendaciones
5. **Divisas** → Ver evolución USD/PEN

## 🔧 Configuración

### Agregar Nuevas Categorías
Editar `src/domain/types.ts`:
```typescript
export type Category = 'comida'|'transporte'|'ocio'|'inversion'|'otros'|'nueva_categoria';
```

### Modificar Reglas de Alertas
Editar `src/domain/rules.ts`:
```typescript
export function evaluateAlerts(txs: Transaction[], monthlyIncome: number) {
  // Lógica personalizada
}
```

### Cambiar Tema de Colores
Editar `src/index.css` y `tailwind.config.ts`

## 📈 Próximas Mejoras

- [ ] Conectar con APIs reales de divisas
- [ ] Agregar más monedas y conversión automática
- [ ] Sistema de presupuestos por categoría
- [ ] Exportación de datos (CSV, PDF)
- [ ] Notificaciones push
- [ ] Modo offline con IndexedDB
- [ ] Integración con bancos

## 🎯 MVP Checklist ✅

- [x] Instalar Zustand
- [x] Crear estructura de archivos
- [x] Implementar tipos y reglas
- [x] Crear store de finanzas
- [x] Desarrollar páginas principales
- [x] Agregar navegación
- [x] Implementar gráficos
- [x] Crear datos de divisas
- [x] Conectar rutas
- [x] Aplicar estilo glassmorphism
- [x] Probar funcionalidad completa

¡La aplicación está lista para usar! 🎉
