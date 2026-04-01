import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@dzakcloud.com",
      details: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+62 123 4567 8900",
      details: "Available 24/7",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Jakarta, Indonesia",
      details: "Headquarters",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Fri: 8 AM - 6 PM",
      details: "Jakarta Time (WIB)",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      <Navigation />

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-full h-full opacity-20"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5b5fff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5b5fff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M 100 200 Q 300 100 500 200 T 900 200" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 50 300 Q 250 200 450 300 T 850 300" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 150 400 Q 350 300 550 400 T 950 400" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have a question or want to work together? We'd love to hear from you.
              Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">
                          {info.title}
                        </h3>
                        <p className="text-blue-300 font-medium">{info.content}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {info.details}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Social Links */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {["twitter", "facebook", "linkedin", "instagram"].map((social) => (
                    <button
                      key={social}
                      className="w-10 h-10 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg flex items-center justify-center text-blue-300 transition-all capitalize text-xs font-medium"
                    >
                      {social[0].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/5 border border-blue-500/30 rounded-xl p-8">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Common Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: "What is your average response time?",
                  answer:
                    "We typically respond to all inquiries within 24 hours during business days.",
                },
                {
                  question: "Can I schedule a call with your team?",
                  answer:
                    "Yes! Please mention in your message that you'd like to schedule a call and we'll coordinate a time that works for you.",
                },
                {
                  question: "Do you offer technical support?",
                  answer:
                    "Absolutely! Our technical support team is available 24/7 for all customers.",
                },
                {
                  question: "What are your service level agreements?",
                  answer:
                    "All our plans include a 99.9% uptime SLA. Check our pricing page for more details.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors group cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-semibold text-white">
                    {faq.question}
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-gray-400 mt-4">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
