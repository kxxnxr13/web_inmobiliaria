import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración del transportador de email
const createTransporter = () => {
  // Para desarrollo, puedes usar un servicio como Gmail o Outlook
  // En producción, usa un servicio profesional como SendGrid, Mailgun, etc.
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Usa una contraseña de aplicación
      }
    });
  }
  
  // Configuración por defecto para desarrollo (Ethereal Email - para testing)
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'ethereal.password'
    }
  });
};

// Endpoint para envío de emails
app.post('/api/contact', async (req, res) => {
  console.log('Nueva request de contacto recibida');
  try {
    const { nombre, telefono, email, tipoConsulta, mensaje } = req.body;
    console.log('Datos recibidos:', { nombre, email, tipoConsulta });

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y mensaje son campos obligatorios'
      });
    }

    // Crear transportador
    const transporter = createTransporter();

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'contacto@inmobiliaria.com',
      to: process.env.EMAIL_TO || 'info@inmobiliaria.com', // Email destinatario
      subject: `Nueva consulta: ${tipoConsulta || 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            Nueva Consulta desde el Sitio Web
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Información del Cliente:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
            <p><strong>Tipo de Consulta:</strong> ${tipoConsulta || 'No especificado'}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1e40af; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6;">${mensaje}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
            <p style="margin: 0;">Este email fue enviado desde el formulario de contacto del sitio web</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
              Fecha: ${new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      `,
      text: `
        Nueva Consulta desde el Sitio Web
        
        Información del Cliente:
        Nombre: ${nombre}
        Email: ${email}
        Teléfono: ${telefono || 'No proporcionado'}
        Tipo de Consulta: ${tipoConsulta || 'No especificado'}
        
        Mensaje:
        ${mensaje}
        
        Fecha: ${new Date().toLocaleDateString('es-ES')}
      `
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email enviado exitosamente:', info.messageId);

    res.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al enviar el mensaje',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Endpoint de contacto disponible en: http://localhost:${PORT}/api/contact`);
});

export default app;
