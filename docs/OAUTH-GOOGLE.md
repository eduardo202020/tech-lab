# Configuración Google OAuth para Tech Lab (Supabase)

Este documento describe, paso a paso, cómo configurar sólo el provider de Google en Supabase para permitir inicio de sesión vía Google.

IMPORTANTE: tu proyecto Supabase es: `https://kahyefpykyogirwvtvjj.supabase.co`.

---

## 1) Crear credenciales en Google Cloud Console

1. Ve a https://console.cloud.google.com/ y selecciona o crea un proyecto.
2. En el menú, ve a **APIs & Services > OAuth consent screen** y configura la pantalla de consentimiento (tipo External si vas a permitir cuentas fuera de tu organización). Completa el nombre de la aplicación, scopes mínimos (email, profile) y datos de contacto.
3. Ve a **APIs & Services > Credentials** y crea nuevas credenciales: **OAuth 2.0 Client IDs** → Application type: Web application.
4. En **Authorized redirect URIs** añade exactamente:

   - `https://kahyefpykyogirwvtvjj.supabase.co/auth/v1/callback`

   (Esta URI es la que Supabase utiliza internamente para recibir la respuesta de Google. No añadas aquí `http://localhost:3000/auth/callback` — la comunicación va Google -> Supabase -> tu app.)

5. Crea las credenciales y copia **Client ID** y **Client Secret**.

---

## 2) Configurar Google en Supabase

1. Abre el Dashboard de Supabase para tu proyecto.
2. Ve a **Settings > Auth > External OAuth Providers** (o Providers).
3. Localiza **Google** y pega el **Client ID** y **Client Secret** que obtuviste en Google Cloud.
4. Guarda los cambios.

Nota: Supabase gestionará el flujo OAuth (Google -> Supabase). En tu aplicación ya hemos usado `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })`.

---

## 3) Ejecutar script de soporte (opcional pero recomendado)

En el repositorio existe un script con triggers y políticas: `/supabase/configure-auth.sql`.

1. Abre el SQL Editor de Supabase (Dashboard > SQL).
2. Pega el contenido de `supabase/configure-auth.sql` y ejecútalo.
3. Esto creará un trigger que genera automáticamente filas en `user_profiles` cuando se crea un usuario en `auth.users`, y actualizará las políticas RLS sugeridas.

---

## 4) Probar localmente

1. Arranca la app:

```bash
npm run dev
```

2. Abre `http://localhost:3000/login`.
3. Pulsa "Continuar con Google". Se te redirigirá a Google y, después de autenticar, volverás al flujo de Supabase que te reenviará a la URL que pasamos en `redirectTo` (por defecto: `http://localhost:3000/auth/callback`).
4. Después del callback, el `AuthProvider` intentará sincronizar/crear `user_profiles` automáticamente.

---

## 5) Promover un usuario a `admin`

Una vez que el primer usuario se haya registrado (p. ej. con tu email de admin), puedes convertirlo en administrador ejecutando en SQL Editor:

```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'tu_email@dominio.com';
```

Cambia `tu_email@dominio.com` por la cuenta que quieres promover.

---

## 6) Notas y solución de problemas

- Si ves errores de redirect en Google: revisa que hayas usado exactamente la URI `https://kahyefpykyogirwvtvjj.supabase.co/auth/v1/callback` en Google Cloud.
- Si la app no recibe sesión después del login, revisa la consola y confirma que el `AuthProvider` llamó a `supabase.auth.getSession()` y que el trigger `on_auth_user_created` creó un perfil.
- En producción, recuerda verificar la pantalla de consentimiento en Google (verificación de scopes) si vas a usar cuentas externas y quieres eliminar el mensaje de "app is in testing".

---

Si quieres, puedo:

- Ejecutar `configure-auth.sql` por ti (no puedo desde aquí, pero te doy el SQL listo y te guío paso a paso).
- Generar un pequeño script para promover administradores automáticamente mediante CLI si prefieres.
