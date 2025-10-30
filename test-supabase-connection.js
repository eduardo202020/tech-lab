// Test de conexión a Supabase
import { supabase } from './src/lib/supabase';

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a Supabase...');
    
    // Test básico de conexión
    const { data, error } = await supabase
      .from('technologies')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
    } else {
      console.log('✅ Conexión exitosa a Supabase');
      console.log('📊 Respuesta:', data);
    }
  } catch (err) {
    console.error('💥 Error inesperado:', err);
  }
}

// Ejecutar test
testConnection();