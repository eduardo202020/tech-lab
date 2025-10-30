# 🚀 Migración a Supabase - Tech Lab Platform

## 📋 Resumen de la Migración

Esta documentación describe el proceso completo de migración de datos hardcodeados a una base de datos Supabase para el Tech Lab Platform.

## 🎯 Objetivos

- ✅ Migrar de datos estáticos a base de datos real
- ✅ Implementar autenticación robusta con Supabase Auth
- ✅ Crear esquema normalizado y escalable
- ✅ Mantener todas las funcionalidades existentes
- ✅ Mejorar rendimiento y escalabilidad

## 🏗️ Arquitectura de la Base de Datos

### **Tablas Principales**

1. **`user_profiles`** - Perfiles de usuario complementarios a Supabase Auth
2. **`technologies`** - Catálogo de tecnologías del Tech Lab
3. **`projects`** - Proyectos de investigación y desarrollo
4. **`researchers`** - Investigadores y trabajadores del laboratorio
5. **`inventory_items`** - Inventario de equipos y materiales
6. **`loans`** - Sistema de préstamos de equipos

### **Tablas de Relaciones**

1. **`project_researchers`** - Relación many-to-many proyectos ↔ investigadores
2. **`project_technologies`** - Relación many-to-many proyectos ↔ tecnologías

## 🔄 Proceso de Migración

### **Paso 1: Configuración Inicial**

```bash
# Instalar dependencias
npm install @supabase/supabase-js

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### **Paso 2: Ejecutar Schema en Supabase**

1. Ve a tu proyecto Supabase
2. Abre el SQL Editor
3. Ejecuta el contenido de `supabase/schema.sql`
4. Verifica que todas las tablas se crearon correctamente

### **Paso 3: Insertar Datos Iniciales**

1. En el SQL Editor de Supabase
2. Ejecuta el contenido de `supabase/seed-data.sql`
3. Verifica que los datos se insertaron correctamente

### **Paso 4: Configurar Autenticación**

1. En Supabase Auth settings
2. Configurar providers de autenticación
3. Establecer URLs de redirect
4. Configurar políticas de seguridad

### **Paso 5: Actualizar Código de la Aplicación**

Los nuevos hooks están disponibles:
- `useSupabaseProjects()` - Gestión de proyectos
- `useSupabaseResearchers()` - Gestión de investigadores
- Próximamente: `useSupabaseTechnologies()`, `useSupabaseInventory()`

## 📊 Datos Migrados

### **Proyectos del Plan de Trabajo 2025-II**

1. **Tecnología LoRa II** - Red LoRa autónoma UNI
2. **Blockchain** - Red privada Ethereum
3. **Operador de Impresoras 3D** - Centro de manufactura
4. **Operador de CNC** - Laboratorio PCB
5. **Infraestructura IoT** - Red inalámbrica avanzada
6. **Calidad de Aire Interior II** - Monitor ambiental
7. **Reconocimiento Facial** - Sistema de acceso inteligente
8. **Sistemas Fotovoltaicos** - Energía solar inteligente
9. **Contenedor Reciclaje Blockchain II** - EcoChain
10. **Plataforma Tech Lab** - Plataforma web centralizada

### **Tecnologías Implementadas**

- **IoT & Sistemas Embebidos** - nRF52840, STM32, sensores
- **LoRa WAN** - Red de largo alcance
- **Blockchain & DLT** - Ethereum, Smart Contracts
- **Inteligencia Artificial** - ML, Computer Vision
- **Manufactura Digital** - Impresión 3D, CNC
- **Energías Renovables** - Sistemas fotovoltaicos
- **Plataformas Web** - Next.js, React, APIs

### **Investigadores Iniciales**

**Equipo Core Tech Lab Platform:**
- **Jhunior Eduardo Guevara Lázaro** - Líder de Proyecto y Arquitecto Principal
- **Renzo Quispe Villena** - Desarrollador Full Stack
- **Diego Leandro Leon Francia** - Desarrollador Frontend Especializado  
- **Albert Ken Argumedo Rosales** - Especialista Backend y APIs
- **Jorge Luis Parishuñaña Ortega** - DevOps y Deployment Engineer

**Investigadores Especializados:**
- **Dra. Ana Silva** - Investigadora Principal IA
- **Carlos López** - Desarrollador Senior Full Stack
- **María Rodríguez** - Especialista Hardware IoT
- **Pedro Morales** - Científico de Datos Senior
- **Sofia Blockchain** - Arquitecta Blockchain

## 🔐 Seguridad y Permisos

### **Row Level Security (RLS)**

Todas las tablas tienen RLS habilitado con políticas específicas:

- **Lectura pública**: Tecnologías, proyectos, investigadores
- **Escritura restringida**: Solo admins pueden modificar datos sensibles
- **Datos personales**: Los usuarios solo pueden modificar sus propios datos

### **Roles de Usuario**

1. **visitor** - Acceso de solo lectura
2. **student** - Puede solicitar préstamos de equipos
3. **researcher** - Puede gestionar proyectos
4. **admin** - Control total del sistema

## 🚀 Beneficios de la Migración

### **Rendimiento**

- ✅ **Consultas optimizadas** con índices apropiados
- ✅ **Carga bajo demanda** en lugar de datos estáticos
- ✅ **Paginación automática** para grandes datasets
- ✅ **Cache inteligente** con React Query

### **Escalabilidad**

- ✅ **Base de datos PostgreSQL** robusta y escalable
- ✅ **APIs REST y GraphQL** automáticas
- ✅ **Realtime subscriptions** para updates en vivo
- ✅ **Backup automático** y recuperación de desastres

### **Funcionalidades Nuevas**

- ✅ **Autenticación real** con Supabase Auth
- ✅ **Gestión de usuarios** granular
- ✅ **Roles y permisos** avanzados
- ✅ **Auditoría de cambios** automática
- ✅ **Sincronización en tiempo real**

## 🔧 Configuración Avanzada

### **Variables de Entorno Requeridas**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica
SUPABASE_SERVICE_ROLE_KEY=tu-clave-servicio
```

### **Políticas de Backup**

- **Backup diario** automático
- **Retención de 30 días**
- **Point-in-time recovery** habilitado
- **Backup en múltiples regiones**

## 🚧 Próximos Pasos

### **Fase 2 - Funcionalidades Avanzadas**

- [ ] Migrar sistema de inventario
- [ ] Implementar sistema de préstamos
- [ ] Crear dashboard de analíticas
- [ ] Integrar notificaciones en tiempo real

### **Fase 3 - Optimizaciones**

- [ ] Implementar cache Redis
- [ ] Optimizar consultas complejas
- [ ] Crear índices especializados
- [ ] Monitoreo de performance

## 📚 Recursos Adicionales

- [Documentación Supabase](https://supabase.io/docs)
- [Guías de PostgreSQL](https://www.postgresql.org/docs/)
- [Best Practices React + Supabase](https://supabase.io/docs/guides/with-react)

## 🆘 Troubleshooting

### **Problemas Comunes**

1. **Error de conexión**: Verificar variables de entorno
2. **Políticas RLS**: Revisar permisos de usuario
3. **Tipos TypeScript**: Regenerar tipos con Supabase CLI

### **Comandos Útiles**

```bash
# Generar tipos TypeScript
supabase gen types typescript --project-id YOUR_PROJECT_ID

# Reset de base de datos (desarrollo)
supabase db reset

# Ejecutar migraciones
supabase db push
```

---

**Desarrollado con ❤️ para el Tech Lab UNI**  
*Migración completada - Octubre 2025*