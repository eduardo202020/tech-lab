-- =============================================
-- SCRIPT LIMPIO PARA POBLAR TECH LAB PLATFORM
-- Este script primero borra datos existentes y luego inserta data seed
-- =============================================

-- =============================================
-- 1. BORRAR DATOS EXISTENTES (en orden inverso de dependencias)
-- =============================================

-- Borrar loans (depende de inventory_items y user_profiles)
TRUNCATE TABLE public.loans CASCADE;

-- Borrar inventory_items (depende de user_profiles)
TRUNCATE TABLE public.inventory_items CASCADE;

-- Borrar project_researchers (depende de projects y researchers)
TRUNCATE TABLE public.project_researchers CASCADE;

-- Borrar project_technologies (depende de projects y technologies)
TRUNCATE TABLE public.project_technologies CASCADE;

-- Borrar projects (depende de user_profiles)
TRUNCATE TABLE public.projects CASCADE;

-- Borrar researchers (depende de user_profiles)
TRUNCATE TABLE public.researchers CASCADE;

-- Borrar technologies (no tiene dependencias de otras tablas de datos)
TRUNCATE TABLE public.technologies CASCADE;

-- =============================================
-- 2. INSERTAR TECNOLOGÍAS
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
-- 3. INSERTAR PROYECTOS
-- =============================================

INSERT INTO public.projects (
    id, title, description, category, technologies, related_technology_ids,
    status, priority, start_date, end_date, team_lead, team_members,
    budget, progress, objectives, challenges, gallery, demo_url, repository_url,
    documentation, created_by
) VALUES

-- Proyecto 1: Smart Parking System
('00000000-0000-0000-0000-000000000001'::uuid, 'Smart Parking System',
 'Sistema inteligente de estacionamiento que utiliza sensores IoT y visión artificial para detectar espacios disponibles en tiempo real y optimizar la búsqueda de estacionamiento.',
 'IoT & IA',
 ARRAY['IoT Sensors', 'Computer Vision', 'MQTT', 'Node.js', 'React', 'PostgreSQL'],
 ARRAY['iot', 'ai'],
 'active', 'high', '2025-01-15', '2025-10-30', 'Ing. Juan García',
 ARRAY['Ing. María López', 'Bach. Carlos Mendez', 'Est. Sofia Torres'],
 18000.00, 55,
 ARRAY[
   'Implementar red de sensores en estacionamientos',
   'Desarrollar algoritmo de detección con IA',
   'Crear aplicación web y móvil',
   'Integrar sistema de reservas',
   'Optimizar consumo energético'
 ],
 ARRAY[
   'Cobertura de sensores en grandes áreas',
   'Precisión del reconocimiento de espacios',
   'Latencia en tiempo real',
   'Seguridad y privacidad de datos'
 ],
 ARRAY['/images/projects/smart-parking-1.jpg', '/images/projects/smart-parking-2.jpg'],
 'https://smartparking.demo.com', 'https://github.com/techlab/smart-parking',
 'Documentación técnica completa',
 NULL),

-- Proyecto 2: Tecnología LoRa II
('00000000-0000-0000-0000-000000000002'::uuid, 'Tecnología LoRa II', 
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

-- Proyecto 3: Red Blockchain Privada
('00000000-0000-0000-0000-000000000003'::uuid, 'Red Blockchain Privada UNI',
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

-- Proyecto 4: Centro de Manufactura 3D
('00000000-0000-0000-0000-000000000004'::uuid, 'Centro de Manufactura 3D',
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
 ARRAY['/images/projects/3d-printing-1.jpg', '/images/projects/3d-printing-2.jpg'],
 'https://manufactura.demo.com', 'https://github.com/techlab/manufacturing',
 'Manuales de operación disponibles',
 NULL),

-- Proyecto 5: Sistemas Fotovoltaicos
('00000000-0000-0000-0000-000000000005'::uuid, 'Sistemas Fotovoltaicos Autónomos',
 'Investigación e implementación de sistemas fotovoltaicos autónomos para suministro de energía a diversos equipos e instalaciones del Tech Lab.',
 'Energías Renovables',
 ARRAY['Paneles Fotovoltaicos', 'Inversores', 'Baterías LiFePO4', 'Controladores MPPT', 'Arduino'],
 ARRAY['renewable-energy', 'iot'],
 'planning', 'medium', '2025-04-01', '2025-09-30', 'Dr. Roberto Energía',
 ARRAY['Ing. Patricia Solar', 'Est. Miguel Sustentable'],
 12000.00, 25,
 ARRAY[
   'Dimensionar sistemas fotovoltaicos',
   'Instalar paneles solares en estructura',
   'Configurar inversores y controladores',
   'Implementar monitoreo con IoT',
   'Documentar resultados de eficiencia'
 ],
 ARRAY[
   'Variabilidad de radiación solar',
   'Almacenamiento de energía adecuado',
   'Costos iniciales de inversión',
   'Integración con red existente'
 ],
 ARRAY['/images/projects/solar-panels.jpg'],
 NULL, 'https://github.com/techlab/solar-systems',
 'Especificaciones técnicas en repositorio',
 NULL),

-- Proyecto 6: Plataforma Tech Lab
('00000000-0000-0000-0000-000000000006'::uuid, 'Plataforma Tech Lab',
 'Plataforma web centralizada para la gestión, difusión y colaboración de todos los proyectos del Tech Lab con acceso a investigadores, estudiantes y público general.',
 'Desarrollo Web',
 ARRAY['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
 ARRAY['web-platform'],
 'active', 'critical', '2025-01-01', '2025-12-31', 'Ing. Eduardo Dev',
 ARRAY['Est. Alejandra Frontend', 'Bach. Luis Backend', 'Est. Natalia Design'],
 25000.00, 80,
 ARRAY[
   'Desarrollar interfaz moderna y responsiva',
   'Implementar sistema de autenticación seguro',
   'Crear APIs REST para gestión de datos',
   'Integrar base de datos Supabase',
   'Desplegar en producción con CI/CD'
 ],
 ARRAY[
   'Escalabilidad con múltiples usuarios',
   'Seguridad y protección de datos',
   'Performance y carga rápida',
   'Compatibilidad multi-navegador'
 ],
 ARRAY['/images/projects/platform-1.jpg', '/images/projects/platform-2.jpg'],
 'https://techlab.uni.edu.pe', 'https://github.com/techlab/platform',
 'README.md con instrucciones completas',
 NULL);

-- =============================================
-- 4. INSERTAR INVESTIGADORES
-- =============================================

INSERT INTO public.researchers (
    name, email, avatar_url, position, department, specializations,
    biography, academic_level, status, join_date,
    phone, linkedin_url, research_gate_url, orcid,
    university, degree, research_interests, publications, achievements,
    projects_completed, publications_count, years_experience
) VALUES

('Dr. Juan García', 'juan.garcia@uni.edu.pe', '/images/researchers/juan-garcia.jpg',
 'Director del Tech Lab', 'Ingeniería Electrónica',
 ARRAY['IoT', 'Sistemas Embebidos', 'Computer Vision'],
 'Doctor en Ingeniería con más de 15 años de experiencia en investigación y desarrollo de sistemas IoT y visión artificial. Ha liderado múltiples proyectos de innovación tecnológica.',
 'phd', 'active', '2020-01-15',
 '+51 999 123 456', 'https://linkedin.com/in/juangarcia', 'https://researchgate.net/profile/Juan-Garcia',
 '0000-0001-2345-6789', 'Universidad Nacional de Ingeniería', 'Doctor en Ingeniería Electrónica',
 ARRAY['Internet of Things', 'Inteligencia Artificial', 'Visión por Computadora', 'Sistemas Embebidos'],
 ARRAY['Smart IoT Systems for Urban Environments', 'Computer Vision Applications in Smart Cities'],
 ARRAY['Premio Nacional de Innovación Tecnológica 2023', 'Mejor Proyecto IoT UNI 2022'],
 12, 25, 15),

('Dra. María López', 'maria.lopez@uni.edu.pe', '/images/researchers/maria-lopez.jpg',
 'Investigadora Senior', 'Ingeniería de Sistemas',
 ARRAY['Machine Learning', 'Deep Learning', 'Computer Vision'],
 'Doctora especializada en inteligencia artificial y aprendizaje automático con énfasis en visión por computadora y reconocimiento de patrones.',
 'phd', 'active', '2021-03-10',
 '+51 999 234 567', 'https://linkedin.com/in/marialopez', 'https://researchgate.net/profile/Maria-Lopez',
 '0000-0002-3456-7890', 'Universidad Nacional de Ingeniería', 'Doctor en Ciencias de la Computación',
 ARRAY['Machine Learning', 'Deep Learning', 'Reconocimiento de Imágenes', 'Neural Networks'],
 ARRAY['Deep Learning for Image Classification', 'AI-based Pattern Recognition Systems'],
 ARRAY['Best Paper Award ICML 2024', 'Becaria Fulbright 2020'],
 8, 18, 10),

('Dr. Carlos Telecomunicaciones', 'carlos.telecom@uni.edu.pe', '/images/researchers/carlos-telecom.jpg',
 'Investigador Principal - Redes', 'Ingeniería de Telecomunicaciones',
 ARRAY['LoRa', 'LoRaWAN', 'Redes Inalámbricas', 'IoT'],
 'Especialista en tecnologías de comunicación LoRa y redes de largo alcance. Lidera el proyecto de despliegue de la red LoRa autónoma en toda la universidad.',
 'phd', 'active', '2019-08-20',
 '+51 999 345 678', 'https://linkedin.com/in/carlostelecom', 'https://researchgate.net/profile/Carlos-Telecom',
 '0000-0003-4567-8901', 'Pontificia Universidad Católica del Perú', 'Doctor en Telecomunicaciones',
 ARRAY['LoRa/LoRaWAN', 'Redes WSN', 'Protocolos de comunicación', 'IoT Networks'],
 ARRAY['LoRa Networks for Smart Campus', 'Long Range Communication Protocols'],
 ARRAY['Mejor Investigación en Telecomunicaciones UNI 2023'],
 10, 15, 12),

('Dra. Sofia Blockchain', 'sofia.blockchain@uni.edu.pe', '/images/researchers/sofia-blockchain.jpg',
 'Investigadora Blockchain & DLT', 'Ciencias de la Computación',
 ARRAY['Blockchain', 'Smart Contracts', 'Ethereum', 'Criptomonedas'],
 'Experta en tecnologías blockchain y contratos inteligentes. Investiga aplicaciones de blockchain en entornos académicos y desarrollo de DApps descentralizadas.',
 'phd', 'active', '2022-02-01',
 '+51 999 456 789', 'https://linkedin.com/in/sofiablockchain', 'https://researchgate.net/profile/Sofia-Blockchain',
 '0000-0004-5678-9012', 'Universidad Nacional de Ingeniería', 'Doctor en Ciencias de la Computación',
 ARRAY['Blockchain Technology', 'Smart Contracts', 'Decentralized Applications', 'Cryptography'],
 ARRAY['Private Blockchain Networks for Universities', 'Smart Contracts Security Analysis'],
 ARRAY['Blockchain Innovation Award 2024'],
 5, 12, 8),

('Ing. Miguel Manufactura', 'miguel.manufactura@uni.edu.pe', '/images/researchers/miguel-manufactura.jpg',
 'Especialista en Manufactura Digital', 'Ingeniería Mecánica',
 ARRAY['Impresión 3D', 'Manufactura Aditiva', 'CNC', 'CAD/CAM'],
 'Ingeniero especializado en manufactura digital, impresión 3D y diseño asistido por computadora. Coordina el centro de manufactura del Tech Lab.',
 'master', 'active', '2021-06-15',
 '+51 999 567 890', 'https://linkedin.com/in/miguelmanu', NULL,
 NULL, 'Universidad Nacional de Ingeniería', 'Maestría en Ingeniería Mecánica',
 ARRAY['Impresión 3D', 'Manufactura Aditiva', 'Diseño CAD', 'Fabricación Digital'],
 ARRAY['3D Printing Optimization Techniques', 'Additive Manufacturing Best Practices'],
 ARRAY['Mejor Proyecto de Manufactura UNI 2023'],
 15, 8, 9),

('Dr. Roberto Energía', 'roberto.energia@uni.edu.pe', '/images/researchers/roberto-energia.jpg',
 'Investigador en Energías Renovables', 'Ingeniería Eléctrica',
 ARRAY['Energía Solar', 'Fotovoltaica', 'Sistemas Autónomos', 'IoT'],
 'Doctor especializado en sistemas fotovoltaicos y energías renovables. Investiga soluciones de almacenamiento de energía y optimización de sistemas autónomos.',
 'phd', 'active', '2020-05-10',
 '+51 999 678 901', 'https://linkedin.com/in/robertoenergia', 'https://researchgate.net/profile/Roberto-Energia',
 '0000-0005-6789-0123', 'Universidad Nacional de Ingeniería', 'Doctor en Ingeniería Eléctrica',
 ARRAY['Energía Fotovoltaica', 'Sistemas Autónomos', 'Almacenamiento de Energía', 'Eficiencia Energética'],
 ARRAY['Autonomous Solar Systems Design', 'Energy Storage Optimization'],
 ARRAY['Premio Energía Sostenible 2024'],
 7, 14, 11),

('Ing. Eduardo Dev', 'eduardo.dev@uni.edu.pe', '/images/researchers/eduardo-dev.jpg',
 'Desarrollador Full Stack - Plataforma Tech Lab', 'Ingeniería de Software',
 ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Full Stack Development'],
 'Ingeniero de software especializado en desarrollo web moderno. Lidera el proyecto de la Plataforma Tech Lab utilizando tecnologías de vanguardia.',
 'bachelor', 'active', '2023-01-10',
 '+51 999 789 012', 'https://linkedin.com/in/eduardodev', NULL,
 NULL, 'Universidad Nacional de Ingeniería', 'Ingeniería de Software',
 ARRAY['Desarrollo Web', 'Next.js', 'React', 'TypeScript', 'Cloud Computing'],
 ARRAY['Modern Web Development with Next.js', 'Full Stack Development Best Practices'],
 ARRAY['Mejor Proyecto Web UNI 2024'],
 20, 6, 5),

('Bach. Carlos Mendez', 'carlos.mendez@uni.edu.pe', '/images/researchers/carlos-mendez.jpg',
 'Investigador Asistente IoT', 'Ingeniería Electrónica',
 ARRAY['IoT', 'Arduino', 'Raspberry Pi', 'Sensores'],
 'Bachiller en ingeniería electrónica enfocado en desarrollo de sistemas IoT y programación de microcontroladores para proyectos del Tech Lab.',
 'bachelor', 'active', '2023-08-15',
 '+51 999 890 123', 'https://linkedin.com/in/carlosmendez', NULL,
 NULL, 'Universidad Nacional de Ingeniería', 'Bachiller en Ingeniería Electrónica',
 ARRAY['Internet of Things', 'Microcontroladores', 'Sensores', 'Programación Embebida'],
 ARRAY['IoT Applications for Smart Buildings'],
 ARRAY[]::text[],
 3, 2, 2),

('Est. Sofia Torres', 'sofia.torres@uni.edu.pe', '/images/researchers/sofia-torres.jpg',
 'Estudiante Investigadora', 'Ingeniería Electrónica',
 ARRAY['IoT', 'Computer Vision', 'Python'],
 'Estudiante de últimos ciclos apasionada por IoT y visión artificial. Participa en el proyecto Smart Parking desarrollando algoritmos de detección.',
 'undergraduate', 'active', '2024-03-01',
 '+51 999 901 234', NULL, NULL,
 NULL, 'Universidad Nacional de Ingeniería', 'Estudiante de Ingeniería Electrónica',
 ARRAY['IoT', 'Computer Vision', 'Machine Learning', 'Python'],
 ARRAY[]::text[],
 ARRAY['Mención Honrosa en Concurso de Proyectos 2024'],
 1, 0, 1);

-- =============================================
-- 5. INSERTAR ARTÍCULOS DE INVENTARIO
-- =============================================

INSERT INTO public.inventory_items (
    name, description, category, quantity, available_quantity,
    condition, location, purchase_date, purchase_price, serial_number,
    brand, model, specifications, image_url, notes, is_loanable
) VALUES

-- Sensores y módulos IoT
('Sensor DHT22', 'Sensor de temperatura y humedad digital', 'Sensores', 5, 5,
 'excellent', 'Estante A-1', '2024-06-15', 8.50, 'DHT22-001', 'Adafruit', 'DHT22',
 '{"precision": "±2%", "range": "-40 to 80°C", "protocol": "1-Wire"}'::jsonb, 
 NULL, 'Sensor muy preciso para proyectos IoT', true),

('Módulo LoRa Ra-02', 'Módulo LoRa de comunicación de largo alcance', 'Comunicación', 8, 8,
 'excellent', 'Estante B-2', '2024-03-20', 45.00, 'LORA-RA02-003', 'Ai-Thinker', 'Ra-02',
 '{"frequency": "868/915MHz", "range": "15km", "power": "20dBm"}'::jsonb,
 NULL, 'Para red LoRa II', true),

('Arduino Uno Rev3', 'Microcontrolador Arduino Uno', 'Microcontroladores', 12, 12,
 'excellent', 'Estante C-1', '2024-01-10', 25.00, 'ARDUINO-001-012', 'Arduino', 'Uno Rev3',
 '{"processor": "ATmega328P", "clock": "16MHz", "memory": "32KB"}'::jsonb,
 NULL, 'Disponible para préstamo', true),

('Raspberry Pi 4 Model B', 'Computadora monoboard Raspberry Pi', 'Computadoras', 4, 3,
 'excellent', 'Estante D-1', '2024-02-05', 85.00, 'RPI4-MB-004', 'Raspberry Pi', '4 Model B 8GB',
 '{"cpu": "ARM Cortex-A72", "ram": "8GB", "gpio": "40 pins"}'::jsonb,
 '/images/inventory/raspberry-pi.jpg', 'Una en mantenimiento', true),

('STM32 Blue Pill', 'Placa de desarrollo STM32', 'Microcontroladores', 6, 6,
 'good', 'Estante C-2', '2024-04-12', 3.50, 'BLUEPILL-006', 'STMicroelectronics', 'STM32F103C8',
 '{"processor": "ARM Cortex-M3", "clock": "72MHz", "flash": "64KB"}'::jsonb,
 NULL, 'Para LoRa II', true),

('Sensor HC-SR04', 'Sensor ultrasónico de distancia', 'Sensores', 15, 15,
 'excellent', 'Estante A-3', '2024-05-01', 2.00, 'HC-SR04-015', 'Generic', 'HC-SR04',
 '{"range": "2cm to 400cm", "accuracy": "±3mm"}'::jsonb,
 NULL, 'Stock abundante', true),

('Módulo Bluetooth HC-05', 'Módulo Bluetooth para comunicación inalámbrica', 'Comunicación', 7, 7,
 'good', 'Estante B-1', '2024-03-15', 6.00, 'HC05-BT-007', 'DSD Tech', 'HC-05',
 '{"range": "10m", "frequency": "2.4GHz", "baud": "9600-115200"}'::jsonb,
 NULL, 'Funcionamiento comprobado', true),

-- Impresoras 3D y Accesorios
('Impresora 3D Creality Ender 3', 'Impresora 3D FDM de escritorio', 'Equipos de Manufactura', 1, 1,
 'good', 'Laboratorio 3D', '2024-01-20', 200.00, 'CREALITY-E3-001', 'Creality', 'Ender 3 V2',
 '{"platform": "220x220mm", "nozzle": "0.4mm", "max_temp": "250°C"}'::jsonb,
 '/images/inventory/ender3.jpg', 'En operación', false),

('Filamento PLA Blanco 1kg', 'Filamento PLA de alta calidad para impresión 3D', 'Materiales', 20, 18,
 'excellent', 'Almacén', '2024-08-10', 15.00, 'PLA-WHITE-001', 'Prusament', 'PLA',
 '{"diameter": "1.75mm", "color": "Blanco", "temp_nozzle": "200-210°C"}'::jsonb,
 NULL, 'Stock disponible', true),

('Filamento ABS Negro 1kg', 'Filamento ABS para piezas resistentes', 'Materiales', 10, 8,
 'excellent', 'Almacén', '2024-07-22', 18.00, 'ABS-BLK-001', 'Prusament', 'ABS',
 '{"diameter": "1.75mm", "color": "Negro", "temp_nozzle": "240-250°C"}'::jsonb,
 NULL, 'Bajo stock', true),

('Buildtak Surface 220x220', 'Superficie de impresión para Ender 3', 'Accesorios', 3, 2,
 'good', 'Almacén', '2024-06-01', 20.00, 'BUILDTAK-220', 'Buildtak', 'PEI Sheet',
 '{"size": "220x220mm", "thickness": "0.3mm"}'::jsonb,
 NULL, 'Una dañada', true),

-- Herramientas y Equipos
('Multímetro Digital DT830B', 'Multímetro digital portátil', 'Herramientas', 5, 5,
 'excellent', 'Estante E-1', '2024-02-14', 12.00, 'MULTI-DT830-005', 'Generic', 'DT830B',
 '{"ranges": "Voltaje/Corriente/Resistencia", "display": "LCD 3.5 dígitos"}'::jsonb,
 NULL, 'Calibrados recientemente', true),

('Soldador 40W', 'Soldador eléctrico para componentes', 'Herramientas', 3, 3,
 'good', 'Estante E-2', '2024-03-10', 25.00, 'SOLDER-40W-003', 'Weller', 'WSP80',
 '{"power": "40W", "temp": "200-450°C", "tip": "Intercambiable"}'::jsonb,
 NULL, 'Funcionamiento normal', true),

('Estaño para soldar 60/40', 'Estaño de alta calidad para soldadura', 'Materiales', 15, 14,
 'excellent', 'Almacén', '2024-07-01', 5.00, 'SOLDER-60-40', 'Multicore', '500g',
 '{"composition": "60% Sn / 40% Pb", "temp": "190°C"}'::jsonb,
 NULL, 'Stock suficiente', true),

('Cables Dupont Macho-Hembra', 'Set de cables de conexión 40 piezas', 'Materiales', 20, 20,
 'excellent', 'Estante A-4', '2024-08-05', 2.50, 'DUPONT-MF-020', 'Generic', '40pcs',
 '{"length": "10cm", "gauge": "22AWG", "color": "Variados"}'::jsonb,
 NULL, 'Stock abundante', true),

-- Paneles Solares y Energía
('Panel Solar 50W', 'Panel fotovoltaico monocristalino', 'Energías Renovables', 2, 2,
 'excellent', 'Techo Laboratorio', '2023-11-15', 120.00, 'PANEL-50W-001', 'JinkoSolar', '50W',
 '{"voltage": "12V", "amperage": "3.2A", "efficiency": "18%"}'::jsonb,
 NULL, 'Para sistemas fotovoltaicos', true),

('Batería LiFePO4 48V 100Ah', 'Batería de fosfato de litio para almacenamiento', 'Energías Renovables', 1, 1,
 'excellent', 'Almacén', '2024-01-05', 2000.00, 'LIFEPO4-100AH-001', 'CATL', '48V 100Ah',
 '{"chemistry": "LiFePO4", "cycles": "6000+", "warranty": "10 years"}'::jsonb,
 NULL, 'Proyecto sistemas fotovoltaicos', false),

('Controlador MPPT 60A', 'Controlador de carga solar MPPT', 'Energías Renovables', 1, 1,
 'excellent', 'Estante F-1', '2024-02-20', 350.00, 'MPPT-60A-001', 'Epever', 'LS6024B',
 '{"input_voltage": "12-48V", "max_current": "60A"}'::jsonb,
 NULL, 'Para sistema fotovoltaico', true);
