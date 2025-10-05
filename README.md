# 🔬 OTI UNI Tech Lab Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css) ![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?style=for-the-badge&logo=three.js)

**Plataforma moderna para la gestión integral del Laboratorio Tecnológico OTI UNI**

[🚀 Demo en Vivo](#) | [📖 Documentación](#características) | [🛠️ Instalación](#instalación)

</div>

## 🌟 Descripción

OTI UNI Tech Lab es una plataforma web moderna y futurista diseñada para la gestión integral de equipos tecnológicos de vanguardia en el laboratorio de la Oficina de Tecnologías de la Información (OTI) de la Universidad Nacional de Ingeniería.

### 🎯 Objetivos

- **Gestión eficiente** de inventario de equipos tecnológicos
- **Sistema de préstamos** automatizado con seguimiento
- **Visualización interactiva** de tecnologías emergentes
- **Experiencia inmersiva** con modelos 3D
- **Interface moderna** con soporte de temas claro/oscuro

## ✨ Características

### 🏠 **Página Principal**

- **Modelo 3D interactivo** con tecnología Three.js
- **Scroll horizontal animado** de tecnologías
- **Diseño futurista** con efectos neon y glassmorphism
- **Navegación intuitiva** y responsiva

### 📊 **Gestión de Inventario**

- Catálogo completo de equipos con imágenes
- **Filtros avanzados** por categoría, marca y estado
- **Búsqueda en tiempo real**
- **Cards interactivas** con información detallada
- Estados visuales: Disponible | En Préstamo

### 📝 **Sistema de Préstamos**

- **Tabla de préstamos activos** con seguimiento completo
- **Historial de préstamos** con filtros por fecha
- **Estados dinámicos** con códigos de color
- **Gestión de usuarios** y fechas de devolución

### 🚀 **Tecnologías Emergentes**

- **Routing dinámico** para 8 tecnologías principales:
  - 📡 **LoRa & IoT**: Comunicación de largo alcance
  - ⛓️ **Blockchain**: Tecnología de cadena de bloques
  - 🔧 **ESP32**: Microcontroladores y embedded systems
  - 🤖 **AI & Machine Learning**: Inteligencia artificial
  - 🌐 **Edge Computing**: Computación en el borde
  - ☁️ **Cloud Computing**: Arquitecturas en la nube
  - 🔒 **Cybersecurity**: Seguridad informática
  - 📊 **Big Data**: Análisis de grandes volúmenes de datos

### 🎨 **Sistema de Temas**

- **Tema claro/oscuro** con transiciones suaves
- **Persistencia** en localStorage
- **Detección automática** de preferencias del sistema
- **Variables CSS dinámicas** para consistencia visual

### 🔐 **Autenticación**

- **Sistema de login** con validación de formularios
- **UI moderna** con efectos glassmorphism
- **Manejo de estados** y validación en tiempo real

### 📞 **Página de Contacto**

- **Formulario de contacto** completamente funcional
- **Información de ubicación** y datos de contacto
- **Diseño responsivo** optimizado para móviles

## 🛠️ Tecnologías Utilizadas

### **Frontend Framework**

- **Next.js 15.5.4** - Framework React con App Router
- **React 18** - Biblioteca de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript

### **Estilos y UI**

- **Tailwind CSS** - Framework de utilidades CSS
- **Custom CSS Variables** - Sistema de temas dinámicos
- **Responsive Design** - Adaptable a todos los dispositivos

### **3D y Visualización**

- **Three.js** - Biblioteca para gráficos 3D
- **@react-three/fiber** - Renderer React para Three.js
- **@react-three/drei** - Utilidades adicionales para Three.js

### **Fuentes y Tipografía**

- **Google Fonts**: Geist, Montserrat, Roboto, Poppins
- **Bebas Neue** - Fuente display moderna

### **Gestión de Estado**

- **React Context API** - Estado global de temas
- **React Hooks** - useState, useEffect, useContext
- **localStorage** - Persistencia de preferencias

## 📁 Estructura del Proyecto

```
tech-lab/
├── 📁 public/
│   ├── 📁 models/          # Modelos 3D (.gltf, .bin)
│   └── 📁 icons/           # Iconos SVG
├── 📁 src/
│   ├── 📁 app/             # App Router de Next.js
│   │   ├── 📄 layout.tsx   # Layout principal
│   │   ├── 📄 page.tsx     # Página home
│   │   ├── 📄 globals.css  # Estilos globales y variables CSS
│   │   ├── 📁 contact/     # Página de contacto
│   │   ├── 📁 inventory/   # Gestión de inventario
│   │   ├── 📁 loans/       # Sistema de préstamos
│   │   ├── 📁 login/       # Autenticación
│   │   ├── 📁 equipment/   # Detalles de equipos
│   │   └── 📁 technologies/
│   │       └── 📁 [technology]/ # Routing dinámico
│   ├── 📁 components/      # Componentes reutilizables
│   │   ├── 📄 Header.tsx   # Navegación principal
│   │   ├── 📄 Footer.tsx   # Pie de página
│   │   ├── 📄 ThemeToggle.tsx    # Selector de temas
│   │   └── 📄 Model3DViewer.tsx  # Visor 3D
│   ├── 📁 contexts/        # React Contexts
│   │   └── 📄 ThemeContext.tsx   # Contexto de temas
│   └── 📁 data/           # Datos estáticos
│       └── 📄 technologies.json  # Base de datos de tecnologías
├── 📄 tailwind.config.js  # Configuración de Tailwind
├── 📄 next.config.ts      # Configuración de Next.js
└── 📄 package.json        # Dependencias del proyecto
```

## 🚀 Instalación

### **Prerrequisitos**

- Node.js 18+
- npm o yarn
- Git

### **1. Clonar el repositorio**

```bash
git clone https://github.com/eduardo202020/tech-lab.git
cd tech-lab
```

### **2. Instalar dependencias**

```bash
npm install
# o
yarn install
```

### **3. Ejecutar en modo desarrollo**

```bash
npm run dev
# o
yarn dev
```

### **4. Abrir en el navegador**

```
http://localhost:3000
```

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload

# Producción
npm run build        # Construir aplicación para producción
npm start           # Iniciar servidor de producción

# Utilidades
npm run lint        # Ejecutar ESLint
npm run type-check  # Verificar tipos TypeScript
```

## 🎨 Personalización de Temas

El sistema de temas utiliza variables CSS dinámicas definidas en `src/app/globals.css`:

```css
/* Tema Claro */
:root.light {
  --theme-bg: #f8fafc;
  --theme-text: #0f172a;
  --theme-secondary: #475569;
  --theme-border: #cbd5e1;
  --theme-card: #ffffff;
}

/* Tema Oscuro */
:root.dark {
  --theme-bg: #0f172a;
  --theme-text: #f1f5f9;
  --theme-secondary: #cbd5e1;
  --theme-border: rgba(255, 255, 255, 0.1);
  --theme-card: rgba(15, 23, 42, 0.6);
}
```

## 🔧 Configuración Avanzada

### **Añadir nuevas tecnologías**

Edita `src/data/technologies.json` y agrega:

```json
{
  "id": "nueva-tech",
  "name": "Nueva Tecnología",
  "description": "Descripción de la tecnología",
  "icon": "🚀",
  "gradient": "from-blue-500 to-purple-600",
  "features": ["Característica 1", "Característica 2"],
  "projects": [
    {
      "name": "Proyecto Ejemplo",
      "description": "Descripción del proyecto"
    }
  ]
}
```

### **Personalizar colores**

Modifica `tailwind.config.js` para ajustar la paleta de colores:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff00ff',
        'bright-blue': '#00ffff',
        // Agrega tus colores personalizados
      },
    },
  },
};
```

## 🤝 Contribución

1. **Fork** el proyecto
2. Crear una **rama de feature** (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** los cambios (`git commit -m 'feat: agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un **Pull Request**

### **Convenciones de Commits**

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `test:` Pruebas
- `chore:` Tareas de mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Eduardo Guevara** - _Desarrollador Full Stack_

- GitHub: [@eduardo202020](https://github.com/eduardo202020)
- LinkedIn: [Eduardo Guevara](https://www.linkedin.com/in/jhunior-guevara-889483162/)

## 🙏 Reconocimientos

- **Universidad Nacional de Ingeniería (UNI)** - Institución educativa
- **Oficina de Tecnologías de la Información (OTI)** - Laboratorio anfitrión
- **Three.js Community** - Recursos de modelos 3D
- **Next.js Team** - Framework excepcional
- **Tailwind CSS** - Sistema de diseño

## 🔮 Roadmap Futuro

### **Versión 2.0**

- [ ] 🔐 **Autenticación JWT** completa
- [ ] 📊 **Dashboard administrativo** con métricas
- [ ] 📱 **App móvil** con React Native
- [ ] 🔔 **Sistema de notificaciones** en tiempo real
- [ ] 📈 **Analytics** y reportes avanzados
- [ ] 🌐 **PWA** (Progressive Web App)
- [ ] 🤖 **Chatbot IA** para soporte
- [ ] 📦 **API REST** completa
- [ ] 🧪 **Testing** automatizado (Jest, Cypress)
- [ ] 🐳 **Dockerización** y CI/CD

---

<div align="center">

**⭐ Si te gusta este proyecto, no olvides darle una estrella ⭐**

**Hecho con ❤️ para la comunidad tecnológica de la UNI**

</div>
