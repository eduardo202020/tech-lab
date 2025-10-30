-- Primero verificar los usuarios disponibles y la estructura de inventory_items
SELECT id, email, raw_user_meta_data FROM auth.users LIMIT 5;

-- Verificar la estructura de la tabla inventory_items
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inventory_items' 
ORDER BY ordinal_position;

-- Verificar si created_by puede ser NULL o tiene un valor por defecto
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'inventory_items' AND column_name = 'created_by';