import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  email: z.string().email("Ingresa un email válido"),
  consultationType: z.string().min(1, "Selecciona un tipo de consulta"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      consultationType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // URL de Formspree - reemplaza con tu endpoint real
      const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/demo";

      // Verificar si Formspree está configurado
      if (formspreeUrl === "https://formspree.io/f/demo") {
        // Modo de demostración - solo simular el envío
        console.log("Modo demostración - Datos del formulario:", data);
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
          title: "¡Formulario completado!",
          description: "Configura Formspree para recibir emails reales. Datos mostrados en consola.",
        });
      } else {
        // Enviar datos a Formspree
        const response = await fetch(formspreeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            consultationType: data.consultationType,
            message: data.message,
            _replyto: data.email,
            _subject: `Nueva consulta inmobiliaria de ${data.name}`,
          }),
        });

        if (!response.ok) {
          // Manejo específico de errores de Formspree
          let errorMessage = `Error HTTP: ${response.status}`;

          if (response.status === 422) {
            errorMessage = "El formulario necesita ser activado. Revisa tu email de Formspree.";
          } else if (response.status === 429) {
            errorMessage = "Demasiados envíos. Intenta nuevamente más tarde.";
          } else {
            // Solo intentar leer JSON si es necesario y es seguro
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch {
              // Si no se puede leer el JSON, usar el mensaje por defecto
            }
          }

          throw new Error(errorMessage);
        }

        // Solo leer la respuesta si fue exitosa
        await response.json();

        toast({
          title: "¡Mensaje enviado exitosamente!",
          description: "Nos pondremos en contacto contigo pronto.",
        });
      }

      form.reset();
    } catch (error) {
      console.error("Error al enviar formulario:", error);

      const errorMessage = error instanceof Error ? error.message : "Error desconocido";

      toast({
        title: "Error al enviar mensaje",
        description: `${errorMessage}. Por favor intenta nuevamente o contacta por teléfono.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-navy-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Estamos aquí para ayudarte a encontrar la propiedad perfecta o
              resolver cualquier duda sobre nuestros servicios inmobiliarios.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-gold-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-800 mb-2">
                  Nuestra Oficina
                </h3>
                <p className="text-gray-600 text-sm">
                  Av. Principal 123, Centro
                  <br />
                  Ciudad, País 12345
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-gold-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-800 mb-2">
                  Teléfonos
                </h3>
                <p className="text-gray-600 text-sm">
                  +1 (555) 123-4567
                  <br />
                  +1 (555) 123-4568
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-gold-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-800 mb-2">
                  Email
                </h3>
                <p className="text-gray-600 text-sm">
                  info@inmobiliaria.com
                  <br />
                  ventas@inmobiliaria.com
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-gold-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-800 mb-2">
                  Horarios
                </h3>
                <p className="text-gray-600 text-sm">
                  Lun - Vie: 9:00 - 18:00
                  <br />
                  Sáb: 10:00 - 14:00
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-navy-800 mb-6">
                Envíanos un Mensaje
              </h2>
              <Card className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu nombre completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu número de teléfono" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consultationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Consulta</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo de consulta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="compra">Quiero Comprar</SelectItem>
                              <SelectItem value="venta">Quiero Vender</SelectItem>
                              <SelectItem value="alquiler">
                                Busco en Alquiler
                              </SelectItem>
                              <SelectItem value="inversion">
                                Inversión Inmobiliaria
                              </SelectItem>
                              <SelectItem value="proyecto">
                                Proyectos en Desarrollo
                              </SelectItem>
                              <SelectItem value="otros">Otros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cuéntanos más sobre lo que necesitas..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gold-500 hover:bg-gold-600"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>

            {/* Services & Quick Actions */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-navy-800 mb-6">
                  ¿Cómo Podemos Ayudarte?
                </h2>
                <div className="grid gap-4">
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-gold-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-800">
                          Consulta General
                        </h3>
                        <p className="text-sm text-gray-600">
                          Preguntas sobre servicios y propiedades
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-gold-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-800">
                          Agendar Cita
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reunión presencial con nuestros asesores
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-gold-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-800">
                          Asesoría Especializada
                        </h3>
                        <p className="text-sm text-gray-600">
                          Consulta con expertos en inversión
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Map Placeholder */}
              <div>
                <h3 className="text-xl font-semibold text-navy-800 mb-4">
                  Nuestra Ubicación
                </h3>
                <Card className="h-64 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Mapa Interactivo</p>
                    <p className="text-sm">Av. Principal 123, Centro</p>
                  </div>
                </Card>
              </div>

              {/* Emergency Contact */}
              <Card className="p-6 bg-navy-50 border-navy-200">
                <h3 className="text-lg font-semibold text-navy-800 mb-3">
                  Atención de Emergencia
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Para asuntos urgentes fuera del horario de oficina,
                  contáctanos a través de:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gold-500" />
                    <span>WhatsApp: +1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gold-500" />
                    <span>emergencias@inmobiliaria.com</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-800 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra respuestas rápidas a las consultas más comunes sobre
              nuestros servicios inmobiliarios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg text-navy-800">
                  ¿Cuánto tiempo toma vender una propiedad?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 text-sm">
                  El tiempo promedio de venta varía entre 60-90 días,
                  dependiendo del tipo de propiedad, ubicación y condiciones del
                  mercado. Nuestro equipo trabaja para optimizar este proceso.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg text-navy-800">
                  ¿Ofrecen servicios de financiamiento?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 text-sm">
                  Sí, trabajamos con los principales bancos y instituciones
                  financieras para ofrecer las mejores opciones de crédito
                  hipotecario a nuestros clientes.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg text-navy-800">
                  ¿Qué incluye la asesoría en inversión?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 text-sm">
                  Incluye análisis de mercado, evaluación de rentabilidad,
                  asesoría legal, y seguimiento post-inversión para maximizar el
                  retorno de su capital.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg text-navy-800">
                  ¿Manejan propiedades comerciales?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 text-sm">
                  Sí, tenemos un departamento especializado en bienes raíces
                  comerciales incluyendo oficinas, locales, bodegas y terrenos
                  para desarrollo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
