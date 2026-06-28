import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, Linkedin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveMessage } from "@/components/AdminPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRtl = language === "ar";

  const formSchema = z.object({
    name: z.string().min(2, t("Name is required", "الاسم مطلوب")),
    email: z.string().email(t("Invalid email address", "بريد إلكتروني غير صالح")),
    phone: z.string().min(5, t("Phone is required", "رقم الهاتف مطلوب")),
    projectType: z.string().min(1, t("Please select a project type", "الرجاء اختيار نوع المشروع")),
    message: z.string().min(10, t("Message is too short", "الرسالة قصيرة جداً")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveMessage(values);
    toast({
      title: t("Message Sent!", "تم إرسال الرسالة بنجاح!"),
      description: t(
        "Thank you for contacting me. I will get back to you shortly.",
        "شكراً لتواصلك معي. سأقوم بالرد عليك في أقرب وقت."
      ),
    });
    form.reset();
  }

  const contactInfo = [
    {
      icon: Phone,
      label: "WhatsApp",
      value: "01018785717",
      href: "https://wa.me/201018785717",
    },
    {
      icon: Mail,
      label: "Email",
      value: "abdelrahmanmoohamed43@gmail.com",
      href: "mailto:abdelrahmanmoohamed43@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Abdelrahman Mohamed",
      href: "https://www.linkedin.com/in/abdelrahman-mohamed-662060273",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Contact Me", "تواصل معي")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">{t("Let's talk about your project", "لنتحدث عن مشروعك")}</h3>
              <p className="text-muted-foreground mb-8">
                {t(
                  "Have a project in mind or looking for a developer to join your team? Feel free to reach out.",
                  "هل لديك مشروع أو تبحث عن مطور للانضمام لفريقك؟ لا تتردد في التواصل معي."
                )}
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-colors group"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground font-medium">{info.label}</p>
                    <p className="font-semibold text-foreground truncate">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="border-border bg-card">
              <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Name", "الاسم")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("Your name", "اسمك")} {...field} />
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
                            <FormLabel>{t("Phone", "رقم الهاتف")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("Your phone number", "رقم هاتفك")} {...field} />
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
                          <FormLabel>{t("Email", "البريد الإلكتروني")}</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Project Type", "نوع المشروع")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("Select a project type", "اختر نوع المشروع")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="company">{t("Company Website", "موقع شركة")}</SelectItem>
                              <SelectItem value="ecommerce">{t("E-Commerce", "متجر إلكتروني")}</SelectItem>
                              <SelectItem value="landing">{t("Landing Page", "صفحة هبوط")}</SelectItem>
                              <SelectItem value="other">{t("Other", "أخرى")}</SelectItem>
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
                          <FormLabel>{t("Message", "الرسالة")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("Tell me about your project...", "أخبرني عن مشروعك...")}
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full">
                      <Send className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                      {t("Send Message", "إرسال الرسالة")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
