-- Crear tabla equipment
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    serial_number TEXT,
    status TEXT NOT NULL DEFAULT 'available' 
        CHECK (status IN ('available', 'in_use', 'maintenance', 'damaged', 'retired')),
    location TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    image_url TEXT,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    warranty_expires DATE,
    last_maintenance DATE,
    next_maintenance DATE,
    usage_count INTEGER DEFAULT 0,
    notes TEXT,
    responsible_person TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_location ON equipment(location);
CREATE INDEX idx_equipment_created_at ON equipment(created_at);

-- Crear función de actualización automática de updated_at
CREATE OR REPLACE FUNCTION update_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualización automática
CREATE TRIGGER equipment_update_trigger
    BEFORE UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_equipment_updated_at();

-- Insertar datos de ejemplo
INSERT INTO equipment (name, category, brand, model, status, location, description, specifications) VALUES
('Microscopio Avanzado', 'Microscopía', 'Nikon', 'Eclipse Ni-U', 'available', 'Laboratorio 1', 'Microscopio de investigación con múltiples objetivos', '{"magnificacion": "40x-1000x", "tipo": "optico", "iluminacion": "LED"}'),
('Impresora 3D', 'Manufactura Digital', 'Prusa', 'i3 MK3S+', 'in_use', 'Taller de Prototipado', 'Impresora 3D para prototipado rápido', '{"volumen_construccion": "250x210x210mm", "material": "PLA/PETG", "precision": "0.1mm"}'),
('Osciloscopio', 'Electrónica', 'Tektronix', 'TBS2074', 'available', 'Laboratorio de Electrónica', 'Osciloscopio digital de 4 canales', '{"canales": 4, "ancho_banda": "70MHz", "muestreo": "1GS/s"}'),
('Multímetro Digital', 'Electrónica', 'Fluke', '87V', 'available', 'Laboratorio de Electrónica', 'Multímetro industrial de precisión', '{"precision_dc": "0.05%", "temperatura": "-200°C a 1090°C", "frecuencia": "200kHz"}'),
('Kit Arduino Mega', 'Microcontroladores', 'Arduino', 'Mega 2560', 'in_use', 'Aula de IoT', 'Kit completo de desarrollo con sensores', '{"microcontrolador": "ATmega2560", "pines_digitales": 54, "pines_analogicos": 16}'),
('Cámara Térmica', 'Análisis Térmico', 'FLIR', 'E8-XT', 'maintenance', 'Laboratorio 2', 'Cámara de imágenes térmicas profesional', '{"resolucion": "320x240", "rango_temperatura": "-20°C a 550°C", "precision": "±2°C"}'),
('Soldadora de Estaño', 'Electrónica', 'Weller', 'WE1010NA', 'available', 'Taller de Electrónica', 'Estación de soldadura digital', '{"potencia": "70W", "temperatura": "200-480°C", "display": "digital"}'),
('Proyector 4K', 'Audiovisual', 'Epson', 'EB-PU1007B', 'available', 'Aula Magna', 'Proyector láser 4K para presentaciones', '{"resolucion": "4K", "luminosidad": "7000_lumenes", "conectividad": "HDMI, USB, WiFi"}}');

-- Habilitar RLS (Row Level Security)
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Public equipment read access" ON equipment
    FOR SELECT USING (true);

-- Crear política para permitir inserción autenticada
CREATE POLICY "Authenticated equipment insert" ON equipment
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Crear política para permitir actualización autenticada
CREATE POLICY "Authenticated equipment update" ON equipment
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Crear política para permitir eliminación autenticada
CREATE POLICY "Authenticated equipment delete" ON equipment
    FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');