# Configuración de EmailJS

## Pasos para configurar EmailJS:

### 1. Crear cuenta en EmailJS
- Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
- Crea una cuenta gratuita

### 2. Configurar servicio de email
- En el dashboard, ve a "Email Services"
- Conecta tu proveedor de email (Gmail, Outlook, etc.)
- Copia el **Service ID**

### 3. Crear template de email
- Ve a "Email Templates"
- Crea un nuevo template con estas variables:
  ```
  {{from_name}} - Nombre del contacto
  {{from_email}} - Email del contacto
  {{from_phone}} - Teléfono del contacto
  {{consultation_type}} - Tipo de consulta
  {{message}} - Mensaje del contacto
  {{to_name}} - Nombre del destinatario
  ```
- Copia el **Template ID**

### 4. Obtener Public Key
- Ve a "Account" > "General"
- Copia tu **Public Key**

### 5. Actualizar el código
Reemplaza en `src/pages/Contact.tsx` (líneas 70-72):
```typescript
const serviceId = "tu_service_id_aqui";
const templateId = "tu_template_id_aqui";
const publicKey = "tu_public_key_aqui";
```

**IMPORTANTE:** El código incluye validación automática. Si no configuras los IDs, funcionará en modo demostración mostrando los datos en consola.

### 6. Template de ejemplo
```html
Asunto: Nueva consulta inmobiliaria de {{from_name}}

Hola {{to_name}},

Has recibido una nueva consulta a través del formulario de contacto:

Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{from_phone}}
Tipo de consulta: {{consultation_type}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto del sitio web.
```

## Límites del plan gratuito:
- 200 emails por mes
- Para más volumen, considera el plan pago

## Alternativas:
- Formspree
- Netlify Forms
- Backend propio con Nodemailer
