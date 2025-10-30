-- =============================================
-- DATOS INICIALES PARA TECH LAB PLATFORM
-- =============================================
-- Script para insertar los datos iniciales basados en el Plan de Trabajo 2025-II

-- =============================================
-- 1. INSERTAR TECNOLOGÍAS
-- =============================================

INSERT INTO public.technologies (
    id, name, icon, gradient, primary_color, description,
    about_title, about_content, features_title, features_items, projects
) VALUES
-- IoT y Sistemas Embebidos
('iot', 'Internet of Things (IoT)', '🌐', 'from-blue-500 to-cyan-500', '#0ea5e9', 
 'Tecnologías de conectividad y sensores para crear ecosistemas inteligentes',
 'Infraestructura IoT del Tech Lab',
 ARRAY[
   'Desarrollo de redes inalámbricas IoT utilizando diversas tecnologías de comunicación',
   'Investigación en protocolos WiFi, Bluetooth, BLE y Thread para proyectos IoT',
   'Implementación con microcontroladores STM32 y nRF52840 para soluciones avanzadas',
   'Creación de sistemas de monitoreo y control distribuidos'
 ],
 'Capacidades Técnicas',
 '[
   {"text": "Protocolos inalámbricos múltiples", "color": "text-blue-400"},
   {"text": "Microcontroladores avanzados", "color": "text-cyan-400"},
   {"text": "Sensores inteligentes", "color": "text-green-400"},
   {"text": "Conectividad de largo alcance", "color": "text-purple-400"}
 ]'::jsonb,
 '[
   {"title": "Infraestructura IoT", "description": "Red inalámbrica IoT con tecnologías WiFi, BLE y Thread"},
   {"title": "Calidad de Aire Interior II", "description": "Dispositivo IoT para medir CO2 y ruido ambiental"}
 ]'::jsonb),

-- LoRa
('lora', 'LoRa WAN', '📡', 'from-green-500 to-blue-500', '#10b981', 
 'Red de comunicaciones de largo alcance y bajo consumo energético',
 'Red LoRa Autónoma UNI',
 ARRAY[
   'Implementación de red LoRa autónoma en toda la Universidad Nacional de Ingeniería',
   'Desarrollo con microcontroladores ARM STM32Cube IDE y Blue Pill',
   'Despliegue de módulos LoRaWan Rak 3172 para comunicaciones de largo alcance',
   'Gateway WisGate Edge Pro para infraestructura robusta'
 ],
 'Infraestructura LoRa',
 '[
   {"text": "Largo alcance (hasta 15km)", "color": "text-green-400"},
   {"text": "Bajo consumo energético", "color": "text-blue-400"},
   {"text": "Red mesh distribuida", "color": "text-purple-400"},
   {"text": "Gateway profesional", "color": "text-orange-400"}
 ]'::jsonb,
 '[
   {"title": "Tecnología LoRa II", "description": "Red de comunicaciones LoRa autónoma en toda la UNI"}
 ]'::jsonb),

-- Blockchain
('blockchain', 'Blockchain & DLT', '⛓️', 'from-purple-500 to-pink-500', '#8b5cf6', 
 'Tecnologías descentralizadas y contratos inteligentes',
 'Red Blockchain Privada UNI',
 ARRAY[
   'Despliegue de red privada basada en Ethereum en toda la UNI',
   'Desarrollo de Smart Contracts y Dapps con Go Ethereum y Foundry',
   'Investigación en billeteras digitales y criptomonedas',
   'Infraestructura blockchain para aplicaciones académicas'
 ],
 'Tecnologías Blockchain',
 '[
   {"text": "Smart Contracts", "color": "text-purple-400"},
   {"text": "DApps descentralizadas", "color": "text-pink-400"},
   {"text": "Go Ethereum", "color": "text-blue-400"},
   {"text": "Foundry Framework", "color": "text-green-400"}
 ]'::jsonb,
 '[
   {"title": "Blockchain", "description": "Red privada Ethereum para investigación en tecnologías descentralizadas"},
   {"title": "Contenedor Inteligente Reciclaje", "description": "Sistema de reciclaje con recompensas en tokens UNI"}
 ]'::jsonb),

-- Inteligencia Artificial
('ai', 'Inteligencia Artificial', '🤖', 'from-red-500 to-purple-500', '#ef4444', 
 'Machine Learning, Deep Learning y Computer Vision',
 'IA y Visión Artificial',
 ARRAY[
   'Desarrollo de sistemas de reconocimiento facial para monitoreo de acceso',
   'Investigación en modelos de IA y algoritmos de visión artificial',
   'Entrenamiento de modelos para clasificación automática de residuos',
   'Implementación de soluciones Back End y Front End con IA'
 ],
 'Capacidades de IA',
 '[
   {"text": "Computer Vision", "color": "text-red-400"},
   {"text": "Deep Learning", "color": "text-purple-400"},
   {"text": "Reconocimiento facial", "color": "text-pink-400"},
   {"text": "Clasificación automática", "color": "text-orange-400"}
 ]'::jsonb,
 '[
   {"title": "Reconocimiento Facial", "description": "Sistema de monitoreo de ingreso y salida de investigadores"},
   {"title": "AI Image Recognition Lab", "description": "Laboratorio de clasificación automática con deep learning"}
 ]'::jsonb),

-- Manufactura Digital
('manufacturing', 'Manufactura Digital', '🏭', 'from-orange-500 to-red-500', '#f97316', 
 'Impresión 3D, CNC y fabricación digital',
 'Centro de Manufactura Digital',
 ARRAY[
   'Capacitación en diversas impresoras 3D (Creality, Rise3D, Makerbot, Kywoo3D)',
   'Operación de equipos CNC para manufactura de PCBs siguiendo normas IPC-2221',
   'Técnicas avanzadas de calidad de impresión y optimización',
   'Fabricación de prototipos y componentes personalizados'
 ],
 'Equipos de Manufactura',
 '[
   {"text": "Impresoras 3D múltiples", "color": "text-orange-400"},
   {"text": "CNC para PCBs", "color": "text-red-400"},
   {"text": "Normas IPC-2221", "color": "text-blue-400"},
   {"text": "Cortadoras láser", "color": "text-green-400"}
 ]'::jsonb,
 '[
   {"title": "Operador de Impresoras 3D", "description": "Capacitación en fabricación aditiva"},
   {"title": "Operador de CNC", "description": "Manufactura de placas de circuitos impresos"}
 ]'::jsonb),

-- Energías Renovables
('renewable-energy', 'Energías Renovables', '☀️', 'from-yellow-500 to-orange-500', '#eab308', 
 'Sistemas fotovoltaicos y energía sostenible',
 'Sistemas Fotovoltaicos Autónomos',
 ARRAY[
   'Estudio y dimensionamiento de sistemas fotovoltaicos autónomos',
   'Instalación y puesta en marcha para alimentación de cargas DC',
   'Investigación en optimización de eficiencia energética',
   'Desarrollo de soluciones de almacenamiento de energía'
 ],
 'Tecnologías Solares',
 '[
   {"text": "Paneles fotovoltaicos", "color": "text-yellow-400"},
   {"text": "Sistemas autónomos", "color": "text-orange-400"},
   {"text": "Cargas DC optimizadas", "color": "text-green-400"},
   {"text": "Almacenamiento de energía", "color": "text-blue-400"}
 ]'::jsonb,
 '[
   {"title": "Sistemas Fotovoltaicos Autónomos", "description": "Instalación de sistemas solares para cargas DC"}
 ]'::jsonb),

-- Desarrollo Web y Plataformas
('web-platform', 'Plataformas Web', '💻', 'from-indigo-500 to-purple-500', '#6366f1', 
 'Desarrollo de aplicaciones web escalables y seguras',
 'Plataforma Tech Lab',
 ARRAY[
   'Desarrollo de infraestructura escalable con servidores y bases de datos',
   'Implementación de APIs robustas y sistemas de ciberseguridad',
   'Creación de interfaces modernas con React y Next.js',
   'Desarrollo de versión alfa para difusión de proyectos'
 ],
 'Stack Tecnológico',
 '[
   {"text": "Next.js 15", "color": "text-indigo-400"},
   {"text": "React 19", "color": "text-purple-400"},
   {"text": "APIs REST/GraphQL", "color": "text-blue-400"},
   {"text": "Ciberseguridad", "color": "text-green-400"}
 ]'::jsonb,
 '[
   {"title": "Plataforma Tech Lab", "description": "Plataforma web centralizada para todos los proyectos del laboratorio"}
 ]'::jsonb);

-- =============================================
-- 2. INSERTAR PROYECTOS BASADOS EN EL PLAN 2025-II
-- =============================================

INSERT INTO public.projects (
    title, description, category, technologies, related_technology_ids,
    status, priority, start_date, end_date, team_lead, team_members,
    budget, progress, objectives, challenges, gallery, demo_url, repository_url,
    documentation, created_by
) VALUES

-- Proyecto 1: Tecnología LoRa II
('Tecnología LoRa II', 
 'Continuación del proyecto LoRa I para desplegar una red de comunicaciones LoRa autónoma en toda la UNI para investigación y desarrollo de tecnologías de largo alcance.',
 'Telecomunicaciones',
 ARRAY['ARM STM32Cube IDE', 'Blue Pill', 'LoRaWan Rak 3172', 'WisGate Edge Pro', 'Raspberry Pi 4'],
 ARRAY['lora', 'iot'],
 'active', 'high', '2025-03-01', '2025-11-30', 'Dr. Carlos Telecomunicaciones',
 ARRAY['Ing. María Sistemas', 'Bach. Pedro Redes', 'Est. Ana LoRa'],
 15000.00, 65,
 ARRAY[
   'Desplegar red LoRa autónoma en toda la UNI',
   'Investigar y desarrollar microcontroladores ARM',
   'Programar dispositivos Blue Pill y módulos LoRaWan',
   'Implementar servidores de monitoreo en Raspberry Pi 4',
   'Establecer infraestructura con gateway WisGate Edge Pro'
 ],
 ARRAY[
   'Cobertura completa del campus universitario',
   'Interferencias con otras redes inalámbricas',
   'Optimización del consumo energético',
   'Integración con sistemas existentes'
 ],
 ARRAY['/images/projects/lora-network.jpg', '/images/projects/lora-gateway.jpg'],
 NULL, 'https://github.com/techlab/lora-network',
 'Documentación técnica completa en repositorio GitHub',
 NULL),

-- Proyecto 2: Blockchain
('Red Blockchain Privada UNI',
 'Despliegue de una red privada basada en Ethereum en toda la UNI para investigar tecnologías descentralizadas, Smart Contracts y aplicaciones DApps.',
 'Blockchain & DLT',
 ARRAY['Ethereum', 'Solidity', 'Go Ethereum', 'Foundry', 'Web3.js', 'Truffle'],
 ARRAY['blockchain'],
 'active', 'high', '2025-02-15', '2025-10-30', 'Dr. Sofia Blockchain',
 ARRAY['Ing. Roberto Crypto', 'Bach. Elena Smart Contracts', 'Est. Diego DApps'],
 20000.00, 45,
 ARRAY[
   'Crear infraestructura blockchain privada',
   'Desarrollar y documentar Smart Contracts',
   'Desplegar nodos Ethereum en el campus',
   'Investigar billeteras digitales cripto',
   'Crear aplicaciones DApps funcionales'
 ],
 ARRAY[
   'Escalabilidad de la red privada',
   'Seguridad de los Smart Contracts',
   'Integración con sistemas académicos',
   'Capacitación del personal técnico'
 ],
 ARRAY['/images/projects/blockchain-network.jpg', '/images/projects/smart-contracts.jpg'],
 'https://blockchain.uni.edu.pe', 'https://github.com/techlab/uni-blockchain',
 'Documentación completa de arquitectura blockchain',
 NULL),

-- Proyecto 3: Operador de Impresoras 3D
('Centro de Manufactura 3D',
 'Capacitación de estudiantes en el uso de diversas impresoras 3D para la fabricación de piezas, incluyendo técnicas de calidad de impresión y creación de manuales.',
 'Manufactura Digital',
 ARRAY['Creality Ender 3', 'Rise3D Pro2', 'Makerbot Replicator', 'Kywoo3D Tycoon', 'PLA', 'ABS', 'PETG'],
 ARRAY['manufacturing'],
 'active', 'medium', '2025-01-15', '2025-12-15', 'Ing. Miguel Manufactura',
 ARRAY['Téc. Laura 3D', 'Est. Carlos Impresión', 'Bach. Andrea Calidad'],
 8000.00, 70,
 ARRAY[
   'Capacitar estudiantes en impresión 3D',
   'Crear manuales de calidad de impresión',
   'Optimizar procesos de manufactura aditiva',
   'Desarrollar proyectos prácticos',
   'Mantener equipos en óptimas condiciones'
 ],
 ARRAY[
   'Mantenimiento constante de impresoras',
   'Calidad consistente en diferentes materiales',
   'Capacitación continua de usuarios',
   'Gestión de materiales de impresión'
 ],
 ARRAY['/images/projects/3d-printers.jpg', '/images/projects/3d-parts.jpg'],
 NULL, 'https://github.com/techlab/3d-manufacturing',
 'Manuales técnicos y guías de operación',
 NULL),

-- Proyecto 4: Operador de CNC
('Laboratorio CNC y PCB',
 'Capacitación de estudiantes en el uso de equipos CNC para manufactura de placas de circuitos impresos (PCB) siguiendo las normas IPC-2221.',
 'Electrónica',
 ARRAY['CNC Router', 'Cortadora Láser', 'Software CAM', 'Altium Designer', 'KiCad'],
 ARRAY['manufacturing'],
 'active', 'medium', '2025-01-20', '2025-11-30', 'Ing. Patricia CNC',
 ARRAY['Téc. Roberto PCB', 'Est. Marina Circuitos', 'Bach. Luis CAM'],
 12000.00, 55,
 ARRAY[
   'Capacitar en manufactura de PCBs con CNC',
   'Implementar normas IPC-2221',
   'Desarrollar procesos de cortadora láser',
   'Crear prototipos de circuitos avanzados',
   'Optimizar flujos de trabajo CAM'
 ],
 ARRAY[
   'Precisión en manufactura de PCBs',
   'Cumplimiento de normas internacionales',
   'Optimización de tiempos de producción',
   'Gestión de materiales especializados'
 ],
 ARRAY['/images/projects/cnc-machine.jpg', '/images/projects/pcb-manufacturing.jpg'],
 NULL, 'https://github.com/techlab/cnc-pcb',
 'Documentación de procesos y normas IPC',
 NULL),

-- Proyecto 5: Infraestructura IoT
('Red IoT Avanzada',
 'Despliegue de una red inalámbrica IoT utilizando diversas tecnologías como WiFi, Bluetooth, BLE y Thread con microcontroladores STM32 y nRF52840.',
 'Internet of Things',
 ARRAY['nRF52840', 'STM32', 'WiFi', 'Bluetooth', 'BLE', 'Thread', 'Zigbee'],
 ARRAY['iot', 'lora'],
 'active', 'high', '2025-02-01', '2025-12-31', 'Dr. Fernando IoT',
 ARRAY['Ing. Claudia Wireless', 'Bach. Sergio Sensors', 'Est. Valeria Thread'],
 18000.00, 40,
 ARRAY[
   'Investigar tecnologías inalámbricas múltiples',
   'Desarrollar proyectos IoT con STM32',
   'Implementar comunicaciones BLE y Thread',
   'Crear red mesh con nRF52840',
   'Integrar sensores inteligentes distribuidos'
 ],
 ARRAY[
   'Interoperabilidad entre protocolos',
   'Gestión de energía en dispositivos',
   'Escalabilidad de la red IoT',
   'Seguridad en comunicaciones inalámbricas'
 ],
 ARRAY['/images/projects/iot-network.jpg', '/images/projects/nrf52840.jpg'],
 'https://iot.uni.edu.pe', 'https://github.com/techlab/iot-infrastructure',
 'Arquitectura completa de red IoT',
 NULL),

-- Proyecto 6: Calidad de Aire Interior II
('Monitor Ambiental Inteligente',
 'Continuación del proyecto de calidad de aire interior, creando un dispositivo optimizado para medir parámetros como CO2, ruido y otros indicadores ambientales.',
 'IoT & Sensores',
 ARRAY['ESP32', 'Sensores CO2', 'Micrófono MEMS', 'PCB Custom', 'WiFi', 'LoRa'],
 ARRAY['iot', 'manufacturing'],
 'active', 'medium', '2025-01-10', '2025-09-30', 'Ing. Carmen Ambiental',
 ARRAY['Est. Ricardo Sensores', 'Bach. Mónica PCB', 'Téc. Alberto Firmware'],
 6000.00, 80,
 ARRAY[
   'Optimizar manufactura de PCB personalizada',
   'Mejorar firmware para mejor rendimiento',
   'Integrar sensores de CO2 precisos',
   'Desarrollar sistema de monitoreo de ruido',
   'Crear dashboard de visualización'
 ],
 ARRAY[
   'Precisión de sensores ambientales',
   'Optimización energética del dispositivo',
   'Calibración automática de sensores',
   'Resistencia a condiciones ambientales'
 ],
 ARRAY['/images/projects/air-quality.jpg', '/images/projects/co2-sensor.jpg'],
 'https://airquality.uni.edu.pe', 'https://github.com/techlab/air-quality-monitor',
 'Especificaciones técnicas y manuales',
 NULL),

-- Proyecto 7: Reconocimiento Facial
('Sistema de Acceso Inteligente',
 'Implementación de un sistema de reconocimiento facial para monitorear el ingreso y salida de investigadores, utilizando visión artificial y modelos de IA avanzados.',
 'Inteligencia Artificial',
 ARRAY['Python', 'OpenCV', 'TensorFlow', 'PyTorch', 'Raspberry Pi', 'Cámaras IP'],
 ARRAY['ai'],
 'active', 'high', '2025-02-10', '2025-10-15', 'Dr. Alejandro Vision',
 ARRAY['Ing. Beatriz AI', 'Bach. Gonzalo CV', 'Est. Isabella ML'],
 10000.00, 60,
 ARRAY[
   'Desarrollar algoritmos de reconocimiento facial',
   'Entrenar modelos de IA personalizados',
   'Implementar sistema Back End robusto',
   'Crear interfaz Front End intuitiva',
   'Integrar con sistema de control de acceso'
 ],
 ARRAY[
   'Precisión en diferentes condiciones de luz',
   'Privacidad y protección de datos',
   'Velocidad de procesamiento en tiempo real',
   'Escalabilidad para múltiples usuarios'
 ],
 ARRAY['/images/projects/facial-recognition.jpg', '/images/projects/access-control.jpg'],
 'https://access.uni.edu.pe', 'https://github.com/techlab/facial-recognition',
 'Documentación de modelos de IA y API',
 NULL),

-- Proyecto 8: Sistemas Fotovoltaicos Autónomos
('Energía Solar Inteligente',
 'Instalación y puesta en marcha de un sistema fotovoltaico autónomo para alimentar cargas DC, incluyendo estudio y dimensionamiento completo.',
 'Energías Renovables',
 ARRAY['Paneles Solares', 'Controladores MPPT', 'Baterías Litio', 'Inversores DC', 'Monitoreo IoT'],
 ARRAY['renewable-energy', 'iot'],
 'active', 'medium', '2025-03-01', '2025-11-15', 'Dr. Raúl Energía',
 ARRAY['Ing. Silvia Solar', 'Bach. Tomás MPPT', 'Est. Carolina Baterías'],
 25000.00, 30,
 ARRAY[
   'Dimensionar sistema fotovoltaico óptimo',
   'Instalar infraestructura solar completa',
   'Optimizar eficiencia energética',
   'Implementar monitoreo IoT inteligente',
   'Crear sistema de almacenamiento eficiente'
 ],
 ARRAY[
   'Optimización de orientación solar',
   'Gestión inteligente de baterías',
   'Predicción de demanda energética',
   'Mantenimiento preventivo automatizado'
 ],
 ARRAY['/images/projects/solar-panels.jpg', '/images/projects/energy-storage.jpg'],
 'https://solar.uni.edu.pe', 'https://github.com/techlab/solar-system',
 'Cálculos de dimensionamiento y manuales',
 NULL),

-- Proyecto 9: Contenedor Inteligente de Reciclaje Blockchain II
('EcoChain - Reciclaje Inteligente',
 'Desarrollo de un contenedor de reciclaje que clasifica residuos automáticamente y recompensa con tokens UNI utilizando tecnología blockchain y visión artificial.',
 'Blockchain & AI',
 ARRAY['Raspberry Pi 4', 'Computer Vision', 'Blockchain', 'Smart Contracts', 'Sensores', 'Tokens UNI'],
 ARRAY['blockchain', 'ai', 'iot'],
 'active', 'critical', '2025-01-05', '2025-12-20', 'Dr. Verde Sustentable',
 ARRAY['Ing. Eco Blockchain', 'Bach. Recicla AI', 'Est. Token Rewards'],
 30000.00, 50,
 ARRAY[
   'Desarrollar PCB modular mejorado',
   'Entrenar modelos de clasificación de residuos',
   'Implementar sistema de recompensas blockchain',
   'Crear arquitectura de software escalable',
   'Integrar con wallet de tokens UNI'
 ],
 ARRAY[
   'Precisión en clasificación de residuos',
   'Integración blockchain confiable',
   'Escalabilidad del sistema de tokens',
   'Resistencia a condiciones ambientales'
 ],
 ARRAY['/images/projects/smart-recycling.jpg', '/images/projects/blockchain-rewards.jpg'],
 'https://ecochain.uni.edu.pe', 'https://github.com/techlab/ecochain-recycling',
 'Arquitectura blockchain y modelos de IA',
 NULL),

-- Proyecto 10: Plataforma Tech Lab
('Tech Lab Platform',
 'Desarrollo de una plataforma web centralizada y escalable para todos los proyectos del Tech Lab, incluyendo gestión de investigadores, inventario y sistema de préstamos.',
 'Desarrollo Web',
 ARRAY['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
 ARRAY['web-platform'],
 'active', 'critical', '2024-12-01', '2025-06-30', 'Jhunior Eduardo Guevara Lázaro',
 ARRAY['Renzo Quispe Villena', 'Diego Leandro Leon Francia', 'Albert Ken Argumedo Rosales', 'Jorge Luis Parishuñaña Ortega'],
 15000.00, 85,
 ARRAY[
   'Crear infraestructura web escalable',
   'Desarrollar sistema de gestión completo',
   'Implementar seguridad y ciberseguridad',
   'Crear versión alfa funcional',
   'Optimizar para producción'
 ],
 ARRAY[
   'Escalabilidad de la plataforma',
   'Seguridad de datos sensibles',
   'Experiencia de usuario óptima',
   'Integración con sistemas existentes'
 ],
 ARRAY['/images/projects/tech-platform.jpg', '/images/projects/dashboard.jpg'],
 'https://tech-lab-smoky.vercel.app', 'https://github.com/eduardo202020/tech-lab',
 'Documentación completa de API y arquitectura',
 NULL);

-- =============================================
-- 3. INSERTAR INVESTIGADORES INICIALES
-- =============================================

INSERT INTO public.researchers (
    name, email, avatar_url, position, department, specializations,
    biography, academic_level, status, join_date, phone, linkedin_url,
    university, degree, research_interests, publications, achievements,
    projects_completed, publications_count, years_experience
) VALUES

-- Investigador Principal - Eduardo Guevara
('Jhunior Eduardo Guevara Lázaro', 'eduardo.guevara.l@uni.edu.pe', 
 'https://media.licdn.com/dms/image/v2/D4E03AQFpAYoEscpQdA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1672683113167?e=1762992000&v=beta&t=ljLjvnPW8tKPSC8bY5ECvmpOHwJWU28-LwmUcoBABIk',
 'Estudiante de Ingeniería Electrónica - Líder de Proyectos', 'Ingeniería Electrónica',
 ARRAY['Sistemas Embebidos', 'Microcontroladores', 'IoT', 'Desarrollo Web', 'Gestión de Proyectos'],
 'Estudiante del 10mo ciclo de Ingeniería Electrónica en la UNI. Líder de múltiples proyectos tecnológicos, especializado en sistemas embebidos, IoT y desarrollo de plataformas web. Experiencia en gestión de equipos multidisciplinarios.',
 'undergraduate', 'active', '2024-03-01', '+51 999 000 000', 
 'https://www.linkedin.com/in/jhunior-guevara-889483162/', 
 'Universidad Nacional de Ingeniería', 'Ingeniería Electrónica (en curso)',
 ARRAY['Sistemas Embebidos', 'Internet of Things (IoT)', 'Desarrollo Full Stack', 'Gestión de Proyectos Tecnológicos', 'Automatización Industrial'],
 ARRAY[
   'Plataforma Tech Lab: Sistema de Gestión Integral (2025)',
   'Sistemas IoT para Smart Cities (2024)',
   'Implementación de Redes LoRa en Campus Universitario (2024)'
 ],
 ARRAY[
   'Líder de desarrollo Plataforma Tech Lab',
   'Coordinador de proyectos IoT UNI',
   'Miembro activo del Tech Lab UNI',
   'Especialista en Next.js y React'
 ],
 5, 3, 3),

-- Doctora en IA
('Dra. Ana Silva', 'ana.silva@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150&h=150&fit=crop&crop=face',
 'Investigadora Principal - Inteligencia Artificial', 'Computer Science',
 ARRAY['Machine Learning', 'Computer Vision', 'Deep Learning', 'Medical AI'],
 'Doctora en Computer Science por MIT. Especialista mundial en visión artificial y deep learning con aplicaciones en medicina y sistemas autónomos. Investigadora principal en múltiples proyectos de IA.',
 'phd', 'active', '2023-01-15', '+51 987 123 456',
 'https://linkedin.com/in/ana-silva-ai',
 'Massachusetts Institute of Technology', 'PhD en Computer Science',
 ARRAY['Deep Learning', 'Computer Vision', 'Medical Image Analysis', 'Autonomous Systems'],
 ARRAY[
   'Advanced CNN Architectures for Medical Imaging (2024)',
   'Real-time Object Detection in Industrial Environments (2023)',
   'Transfer Learning in Computer Vision Applications (2022)'
 ],
 ARRAY[
   'Google Research Award 2023',
   'Best PhD Thesis MIT 2021',
   '10+ papers en revistas Q1'
 ],
 12, 25, 8),

-- Ingeniero Full Stack
('Carlos López', 'carlos.lopez@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
 'Desarrollador Senior Full Stack', 'Ingeniería de Software',
 ARRAY['Frontend Development', 'React', 'Next.js', 'UX/UI Design', 'TypeScript'],
 'Ingeniero de software especializado en desarrollo frontend y experiencia de usuario. Experto en tecnologías web modernas con énfasis en React y Next.js. Líder técnico en proyectos de plataformas web.',
 'bachelor', 'active', '2023-02-01', '+51 977 666 555',
 'https://linkedin.com/in/carlos-lopez-dev',
 'Universidad San Marcos', 'Ingeniería de Software',
 ARRAY[
   'User Experience Design',
   'Progressive Web Applications',
   'Accessibility in Web Development',
   'Frontend Performance Optimization'
 ],
 ARRAY[
   'Modern Frontend Architecture Patterns (2024)',
   'Accessibility Guidelines for Web Applications (2023)'
 ],
 ARRAY[
   'Hackathon Nacional Primer Lugar 2023',
   'Certificación Google UX Design',
   'Contribuidor Open Source React'
 ],
 5, 8, 4),

-- Especialista en Hardware
('María Rodríguez', 'maria.rodriguez@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
 'Especialista en Hardware IoT', 'Ingeniería Electrónica',
 ARRAY['Hardware IoT', 'Sistemas Embebidos', 'Sensores', 'PCB Design'],
 'Ingeniera electrónica especializada en desarrollo de hardware para sistemas IoT. Experta en diseño de PCBs, integración de sensores y optimización de sistemas embebidos de bajo consumo.',
 'master', 'active', '2022-08-10', '+51 966 777 888',
 'https://linkedin.com/in/maria-rodriguez-hw',
 'Universidad Nacional de Ingeniería', 'Maestría en Ingeniería Electrónica',
 ARRAY[
   'PCB Design and Manufacturing',
   'Low-Power IoT Systems',
   'Sensor Integration',
   'Smart Environmental Monitoring'
 ],
 ARRAY[
   'Low-Power IoT Sensors for Smart Cities (2024)',
   'Wireless Communication Protocols Comparison (2023)'
 ],
 ARRAY[
   'Beca de Excelencia Académica 2023',
   'Mejor Proyecto de Tesis Pregrado 2022',
   'Certificación Arduino Expert'
 ],
 3, 4, 2),

-- Data Scientist
('Pedro Morales', 'pedro.morales@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
 'Científico de Datos Senior', 'Data Science',
 ARRAY['Data Analysis', 'Machine Learning', 'Python', 'Statistical Analysis'],
 'Especialista en análisis de datos y machine learning. Experto en extracción de insights de grandes volúmenes de datos y desarrollo de modelos predictivos para aplicaciones industriales.',
 'master', 'active', '2022-11-15', '+51 955 444 333',
 'https://linkedin.com/in/pedro-morales-data',
 'Universidad Católica', 'Maestría en Data Science',
 ARRAY[
   'Big Data Analytics',
   'Predictive Modeling',
   'Data Visualization',
   'Statistical Analysis'
 ],
 ARRAY[
   'Predictive Analytics in Healthcare Systems (2024)',
   'Data-Driven Decision Making in Smart Cities (2023)'
 ],
 ARRAY[
   'Kaggle Competition Winner 2023',
   'Certificación AWS Data Analytics',
   'Databricks Certified Associate'
 ],
 6, 10, 5),

-- Especialista Blockchain
('Sofia Blockchain', 'sofia.crypto@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
 'Arquitecta Blockchain', 'Ingeniería de Sistemas',
 ARRAY['Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'DeFi'],
 'Arquitecta especializada en tecnologías blockchain y desarrollo de smart contracts. Experta en Ethereum, Solidity y creación de aplicaciones descentralizadas (DApps) para casos de uso académicos.',
 'master', 'active', '2023-06-01', '+51 944 555 666',
 'https://linkedin.com/in/sofia-blockchain',
 'Universidad de Chile', 'Maestría en Criptografía',
 ARRAY[
   'Blockchain Architecture',
   'Smart Contract Development',
   'Decentralized Applications (DApps)',
   'Cryptocurrency and Tokenomics'
 ],
 ARRAY[
   'Blockchain Applications in Academia (2024)',
   'Smart Contract Security Patterns (2023)',
   'Decentralized Identity Solutions (2022)'
 ],
 ARRAY[
   'Ethereum Developer Certification',
   'Hackathon Blockchain Winner 2023',
   'Solidity Expert Certification'
 ],
 4, 7, 3),

-- Miembros del Equipo Tech Lab Platform
('Renzo Quispe Villena', 'renzo.quispe@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
 'Desarrollador Full Stack', 'Ingeniería de Sistemas',
 ARRAY['React', 'Node.js', 'TypeScript', 'Database Design', 'API Development'],
 'Desarrollador full stack especializado en tecnologías web modernas. Experto en React, Node.js y diseño de bases de datos. Miembro clave del equipo de desarrollo de la Plataforma Tech Lab.',
 'undergraduate', 'active', '2024-01-15', '+51 987 111 222',
 'https://linkedin.com/in/renzo-quispe-dev',
 'Universidad Nacional de Ingeniería', 'Ingeniería de Sistemas (en curso)',
 ARRAY['Full Stack Development', 'Database Architecture', 'REST APIs', 'Web Performance Optimization'],
 ARRAY[
   'Modern Web Development Patterns (2024)',
   'Database Optimization Techniques (2024)'
 ],
 ARRAY[
   'Miembro destacado equipo Tech Lab',
   'Especialista en arquitectura de datos',
   'Contribuidor activo proyectos UNI'
 ],
 3, 2, 2),

('Diego Leandro Leon Francia', 'diego.leon@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
 'Desarrollador Frontend Especializado', 'Ingeniería de Software',
 ARRAY['React', 'Next.js', 'UI/UX Design', 'TypeScript', 'Responsive Design'],
 'Desarrollador frontend especializado en React y Next.js. Experto en diseño de interfaces de usuario y experiencia del usuario. Responsable del desarrollo de componentes reutilizables en la Plataforma Tech Lab.',
 'undergraduate', 'active', '2024-02-01', '+51 987 222 333',
 'https://linkedin.com/in/diego-leon-frontend',
 'Universidad Nacional de Ingeniería', 'Ingeniería de Software (en curso)',
 ARRAY['Frontend Architecture', 'Component Design', 'User Experience', 'Performance Optimization'],
 ARRAY[
   'Component-Based Architecture in React (2024)',
   'Modern Frontend Development Practices (2024)'
 ],
 ARRAY[
   'Especialista en componentes React',
   'Diseñador de interfaces UNI Tech Lab',
   'Experto en optimización frontend'
 ],
 2, 2, 2),

('Albert Ken Argumedo Rosales', 'albert.argumedo@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
 'Especialista en Backend y APIs', 'Ingeniería de Computación',
 ARRAY['Node.js', 'Express', 'PostgreSQL', 'API Design', 'Microservices'],
 'Especialista en desarrollo backend y arquitectura de APIs. Experto en Node.js, bases de datos y microservicios. Responsable de la arquitectura backend de la Plataforma Tech Lab.',
 'undergraduate', 'active', '2024-01-20', '+51 987 333 444',
 'https://linkedin.com/in/albert-argumedo-backend',
 'Universidad Nacional de Ingeniería', 'Ingeniería de Computación (en curso)',
 ARRAY['Backend Architecture', 'API Development', 'Database Design', 'Microservices Architecture'],
 ARRAY[
   'Microservices Architecture Patterns (2024)',
   'RESTful API Best Practices (2024)'
 ],
 ARRAY[
   'Arquitecto backend Tech Lab Platform',
   'Especialista en APIs RESTful',
   'Experto en PostgreSQL y Supabase'
 ],
 2, 2, 2),

('Jorge Luis Parishuñaña Ortega', 'jorge.parishunana@techlab.uni.edu.pe',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
 'DevOps y Especialista en Deployment', 'Ingeniería de Sistemas',
 ARRAY['DevOps', 'CI/CD', 'Docker', 'Vercel', 'Git Workflows'],
 'Especialista en DevOps y procesos de deployment. Experto en CI/CD, containerización y gestión de infraestructura. Responsable del deployment y mantenimiento de la Plataforma Tech Lab.',
 'undergraduate', 'active', '2024-01-10', '+51 987 444 555',
 'https://linkedin.com/in/jorge-parishunana-devops',
 'Universidad Nacional de Ingeniería', 'Ingeniería de Sistemas (en curso)',
 ARRAY['DevOps Engineering', 'Continuous Integration', 'Infrastructure Management', 'Deployment Automation'],
 ARRAY[
   'Modern DevOps Practices for Web Applications (2024)',
   'CI/CD Pipeline Optimization (2024)'
 ],
 ARRAY[
   'DevOps Engineer Tech Lab Platform',
   'Especialista en Vercel y deployment',
   'Experto en automatización de procesos'
 ],
 2, 2, 2);

-- =============================================
-- 4. INSERTAR RELACIONES PROYECTO-INVESTIGADOR
-- =============================================

-- Obtener IDs de proyectos para las relaciones (esto se hará manualmente o con consultas)
-- Por simplicidad, usaremos los títulos para hacer las relaciones

DO $$
DECLARE
    project_id UUID;
    researcher_id UUID;
BEGIN
    -- Eduardo Guevara en Plataforma Tech Lab (líder)
    SELECT id INTO project_id FROM public.projects WHERE title = 'Tech Lab Platform';
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Jhunior Eduardo Guevara Lázaro';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Líder de Proyecto', true);

    -- Equipo completo Plataforma Tech Lab
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Renzo Quispe Villena';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Desarrollador Full Stack', true);

    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Diego Leandro Leon Francia';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Desarrollador Frontend', true);

    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Albert Ken Argumedo Rosales';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Especialista Backend', true);

    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Jorge Luis Parishuñaña Ortega';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'DevOps Engineer', true);

    -- Dra. Ana Silva en Reconocimiento Facial (investigadora principal)
    SELECT id INTO project_id FROM public.projects WHERE title = 'Sistema de Acceso Inteligente';
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Dra. Ana Silva';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Investigadora Principal', true);

    -- Carlos López en Plataforma Tech Lab (desarrollador senior)
    SELECT id INTO project_id FROM public.projects WHERE title = 'Tech Lab Platform';
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Carlos López';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Desarrollador Frontend Senior', true);

    -- María Rodríguez en Calidad de Aire (especialista hardware)
    SELECT id INTO project_id FROM public.projects WHERE title = 'Monitor Ambiental Inteligente';
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'María Rodríguez';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Especialista en Hardware', true);

    -- Pedro Morales en EcoChain (data scientist)
    SELECT id INTO project_id FROM public.projects WHERE title = 'EcoChain - Reciclaje Inteligente';
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Pedro Morales';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Científico de Datos', true);

    -- Sofia Blockchain en múltiples proyectos blockchain
    SELECT id INTO project_id FROM public.projects WHERE title = 'Red Blockchain Privada UNI';
    SELECT id INTO researcher_id FROM public.researchers WHERE name = 'Sofia Blockchain';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Arquitecta Principal', true);

    SELECT id INTO project_id FROM public.projects WHERE title = 'EcoChain - Reciclaje Inteligente';
    INSERT INTO public.project_researchers (project_id, researcher_id, role, is_current) 
    VALUES (project_id, researcher_id, 'Especialista Blockchain', true);
END $$;

-- =============================================
-- 5. INSERTAR RELACIONES PROYECTO-TECNOLOGÍA
-- =============================================

DO $$
DECLARE
    project_id UUID;
BEGIN
    -- Tech Lab Platform con web-platform
    SELECT id INTO project_id FROM public.projects WHERE title = 'Tech Lab Platform';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'web-platform', 'primary');

    -- Tecnología LoRa II con lora e iot
    SELECT id INTO project_id FROM public.projects WHERE title = 'Tecnología LoRa II';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'lora', 'primary'), (project_id, 'iot', 'secondary');

    -- Red Blockchain con blockchain
    SELECT id INTO project_id FROM public.projects WHERE title = 'Red Blockchain Privada UNI';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'blockchain', 'primary');

    -- Manufactura 3D con manufacturing
    SELECT id INTO project_id FROM public.projects WHERE title = 'Centro de Manufactura 3D';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'manufacturing', 'primary');

    -- CNC con manufacturing
    SELECT id INTO project_id FROM public.projects WHERE title = 'Laboratorio CNC y PCB';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'manufacturing', 'primary');

    -- Red IoT con iot y lora
    SELECT id INTO project_id FROM public.projects WHERE title = 'Red IoT Avanzada';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'iot', 'primary'), (project_id, 'lora', 'secondary');

    -- Calidad de Aire con iot y manufacturing
    SELECT id INTO project_id FROM public.projects WHERE title = 'Monitor Ambiental Inteligente';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'iot', 'primary'), (project_id, 'manufacturing', 'secondary');

    -- Reconocimiento Facial con ai
    SELECT id INTO project_id FROM public.projects WHERE title = 'Sistema de Acceso Inteligente';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'ai', 'primary');

    -- Sistemas Fotovoltaicos con renewable-energy e iot
    SELECT id INTO project_id FROM public.projects WHERE title = 'Energía Solar Inteligente';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'renewable-energy', 'primary'), (project_id, 'iot', 'secondary');

    -- EcoChain con blockchain, ai e iot
    SELECT id INTO project_id FROM public.projects WHERE title = 'EcoChain - Reciclaje Inteligente';
    INSERT INTO public.project_technologies (project_id, technology_id, usage_type) 
    VALUES (project_id, 'blockchain', 'primary'), (project_id, 'ai', 'secondary'), (project_id, 'iot', 'secondary');
END $$;

-- =============================================
-- FINALIZACIÓN
-- =============================================

-- Verificar que todo se insertó correctamente
SELECT 'Tecnologías insertadas: ' || COUNT(*) FROM public.technologies;
SELECT 'Proyectos insertados: ' || COUNT(*) FROM public.projects;
SELECT 'Investigadores insertados: ' || COUNT(*) FROM public.researchers;
SELECT 'Relaciones proyecto-investigador: ' || COUNT(*) FROM public.project_researchers;
SELECT 'Relaciones proyecto-tecnología: ' || COUNT(*) FROM public.project_technologies;