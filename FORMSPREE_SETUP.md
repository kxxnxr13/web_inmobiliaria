# Configuración de Formspree 

## ¿Por qué Formspree?
- ✅ **Más estable** que EmailJS
- ✅ **Sin errores de streams**
- ✅ **Configuración súper simple**
- ✅ **Plan gratuito: 50 envíos/mes**

## Configuración paso a paso:

### 1. Crear cuenta en Formspree
- Ve a [https://formspree.io/](https://formspree.io/)
- Crea una cuenta gratuita

### 2. Crear nuevo formulario
- En el dashboard, click "New Form"
- Nombre: "Contacto Inmobiliaria"
- Email de destino: **tu_email@gmail.com** (donde quieres recibir los mensajes)

### 3. Obtener URL del endpoint
- Copia la URL que aparece, ejemplo: `https://formspree.io/f/abcd1234`

### 4. Configurar variable de entorno
Crea o actualiza el archivo `.env.local`:
```bash
VITE_FORMSPREE_URL=https://formspree.io/f/tu_endpoint_aqui
```

### 5. Personalizar (opcional)
En el dashboard de Formspree puedes:
- Configurar mensajes de confirmación
- Añadir redirecciones
- Configurar anti-spam
- Ver estadísticas de envíos

## Ventajas sobre EmailJS:
- ✅ No requiere configuración compleja
- ✅ Sin problemas de CORS
- ✅ Manejo automático de spam
- ✅ Dashboard con estadísticas
- ✅ Más confiable

## Ejemplo de configuración completa:
```bash
# .env.local
VITE_FORMSPREE_URL=https://formspree.io/f/abcd1234
```

Una vez configurado, los emails llegarán directamente a tu bandeja de entrada sin errores.
