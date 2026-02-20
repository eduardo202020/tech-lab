-- Tabla para guardar ubicaciones enviadas por apps externas
CREATE TABLE IF NOT EXISTS public.map_locations (
  id BIGSERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL CHECK (lat >= -90 AND lat <= 90),
  lng DOUBLE PRECISION NOT NULL CHECK (lng >= -180 AND lng <= 180),
  source TEXT NOT NULL DEFAULT 'external-app',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_map_locations_created_at_desc
  ON public.map_locations (created_at DESC);

-- Fila inicial de prueba: Centro de Lima (solo si la tabla está vacía)
INSERT INTO public.map_locations (lat, lng, source)
SELECT -12.0464, -77.0428, 'seed-centro-lima'
WHERE NOT EXISTS (SELECT 1 FROM public.map_locations);