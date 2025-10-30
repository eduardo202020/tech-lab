-- Insertar datos de ejemplo en inventory_items para Tech Lab
-- Ejecutar este SQL en Supabase SQL Editor
-- CORREGIDO: Se removió el campo created_by que requería UUID válido

INSERT INTO inventory_items (
    name, 
    description, 
    category, 
    quantity, 
    available_quantity, 
    condition, 
    location, 
    purchase_date, 
    purchase_price, 
    serial_number, 
    brand, 
    model, 
    specifications, 
    image_url, 
    notes, 
    is_loanable
) VALUES

-- Equipos de Microscopía
('Microscopio Óptico Avanzado', 'Microscopio de investigación con objetivos de alta resolución para análisis detallado', 'Microscopía', 1, 1, 'excellent', 'Laboratorio de Biología - Mesa 3', '2024-03-15', 2800.00, 'NKN-2024-001', 'Nikon', 'Eclipse Ni-U', '{"magnificacion": "40x-1000x", "tipo": "optico", "iluminacion": "LED", "camara": "digital"}', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400', 'Incluye kit completo de objetivos y oculares', true),

('Microscopio Estereoscópico', 'Microscopio para observación de muestras grandes con iluminación dual', 'Microscopía', 2, 2, 'good', 'Laboratorio de Biología - Armario B', '2023-08-20', 850.00, 'OLY-2023-042', 'Olympus', 'SZ61', '{"magnificacion": "7x-45x", "iluminacion": "LED superior e inferior", "zoom": "6.7:1"}', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400', 'Perfecto para disección y montaje', true),

-- Equipos de Electrónica
('Osciloscopio Digital', 'Osciloscopio de 4 canales para análisis de señales electrónicas', 'Electrónica', 1, 0, 'excellent', 'Laboratorio de Electrónica - Banco 1', '2024-01-10', 1200.00, 'TEK-2024-015', 'Tektronix', 'TBS2074', '{"canales": 4, "ancho_banda": "70MHz", "muestreo": "1GS/s", "memoria": "2.5Mpts"}', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', 'Actualmente en uso para proyecto IoT', true),

('Multímetro Digital Profesional', 'Multímetro industrial de alta precisión con múltiples funciones', 'Electrónica', 3, 3, 'excellent', 'Laboratorio de Electrónica - Estante A', '2024-02-05', 320.00, 'FLK-2024-087', 'Fluke', '87V True RMS', '{"precision_dc": "0.05%", "temperatura": "-200°C a 1090°C", "frecuencia": "200kHz", "certificacion": "CAT IV"}', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400', 'Calibrado anualmente', true),

('Fuente de Alimentación Variable', 'Fuente regulada con doble canal independiente', 'Electrónica', 2, 1, 'good', 'Laboratorio de Electrónica - Banco 2', '2023-05-12', 180.00, 'RIG-2023-156', 'Rigol', 'DP832A', '{"canales": 3, "voltaje_max": "30V", "corriente_max": "3A", "precision": "0.01V"}', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Una unidad en reparación', true),

-- Equipos de Manufactura Digital
('Impresora 3D FDM', 'Impresora 3D de filamento para prototipado rápido', 'Manufactura Digital', 1, 0, 'good', 'Taller de Prototipado - Mesa Central', '2023-09-18', 750.00, 'PRS-2023-201', 'Prusa', 'i3 MK3S+', '{"volumen": "250x210x210mm", "precision": "0.1mm", "materiales": "PLA, PETG, ABS", "nivelacion": "automatica"}', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400', 'Actualmente imprimiendo prototipos para proyecto Smart Parking', true),

('Cortadora Láser', 'Cortadora láser CO2 para materiales diversos', 'Manufactura Digital', 1, 1, 'excellent', 'Taller de Prototipado - Área Láser', '2024-06-01', 3500.00, 'GLW-2024-301', 'Glowforge', 'Pro', '{"potencia": "45W", "area_corte": "297x515mm", "materiales": "madera, acrilico, cuero", "precision": "0.1mm"}', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400', 'Requiere ventilación especializada', true),

-- Equipos de Microcontroladores y IoT
('Kit Arduino Mega Completo', 'Kit de desarrollo con sensores y actuadores incluidos', 'Microcontroladores', 5, 4, 'excellent', 'Aula IoT - Armario de Componentes', '2024-04-08', 120.00, 'ARD-2024-401', 'Arduino', 'Mega 2560 Kit', '{"microcontrolador": "ATmega2560", "pines_digitales": 54, "pines_analogicos": 16, "memoria": "256KB"}', 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400', 'Incluye sensores de temperatura, humedad, ultrasonidos', true),

('ESP32 DevKit', 'Microcontrolador con WiFi y Bluetooth integrado', 'Microcontroladores', 10, 8, 'excellent', 'Aula IoT - Gaveta 2', '2024-03-22', 25.00, 'ESP-2024-502', 'Espressif', 'ESP32-WROOM-32', '{"procesador": "dual-core", "wifi": "802.11n", "bluetooth": "4.2", "pines_io": 30}', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', 'Ideal para proyectos IoT y conectividad', true),

-- Equipos de Análisis Térmico
('Cámara Termográfica', 'Cámara de imágenes térmicas para análisis no destructivo', 'Análisis Térmico', 1, 1, 'fair', 'Laboratorio de Materiales - Estante Especializado', '2022-11-30', 4200.00, 'FLR-2022-601', 'FLIR', 'E8-XT', '{"resolucion": "320x240", "rango": "-20°C a 550°C", "precision": "±2°C", "lente": "42° FOV"}', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400', 'Requiere calibración periódica', true),

-- Herramientas de Soldadura
('Estación de Soldadura Digital', 'Estación de soldadura con control digital de temperatura', 'Electrónica', 3, 2, 'excellent', 'Taller de Electrónica - Banco de Trabajo', '2024-07-15', 180.00, 'WLR-2024-701', 'Weller', 'WE1010NA', '{"potencia": "70W", "temperatura": "200-480°C", "display": "digital", "control": "PID"}', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400', 'Una unidad en mantenimiento', true),

-- Equipos Audiovisuales
('Proyector 4K Láser', 'Proyector profesional para presentaciones y demos', 'Audiovisual', 1, 1, 'excellent', 'Aula Magna - Soporte de Techo', '2024-05-20', 2100.00, 'EPS-2024-801', 'Epson', 'EB-PU1007B', '{"resolucion": "4K UHD", "luminosidad": "7000 lumenes", "conectividad": "HDMI, USB, WiFi", "lampara": "laser"}', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 'Instalación profesional requerida', false),

-- Sensores y Componentes
('Kit Sensores Ambientales', 'Conjunto de sensores para monitoreo ambiental', 'Sensores', 8, 6, 'good', 'Laboratorio IoT - Caja de Componentes', '2023-10-05', 45.00, 'SEN-2023-901', 'Bosch', 'BME280 Kit', '{"parametros": "temperatura, humedad, presion", "precision": "±0.5°C", "interfaz": "I2C/SPI"}', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', 'Compatible con Arduino y Raspberry Pi', true),

-- Equipos de Medición
('Báscula de Precisión', 'Báscula analítica para mediciones exactas', 'Medición', 1, 1, 'excellent', 'Laboratorio de Química - Mesa de Análisis', '2024-01-25', 890.00, 'SAR-2024-001', 'Sartorius', 'MSE225S', '{"capacidad": "220g", "precision": "0.01mg", "calibracion": "interna", "interfaz": "USB/RS232"}', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'Calibración mensual requerida', true);

-- Verificar la inserción
SELECT COUNT(*) as total_items FROM inventory_items;
SELECT category, COUNT(*) as items_per_category FROM inventory_items GROUP BY category ORDER BY items_per_category DESC;