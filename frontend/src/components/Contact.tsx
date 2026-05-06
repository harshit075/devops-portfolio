import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section className="relative w-full py-32 bg-background border-t border-border-color">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Get In Touch
          </h2>
          <span className="text-lg font-bold tracking-widest text-cyan uppercase opacity-80 mt-2">
            連絡 / Contact
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-bg-secondary p-8 border border-border-color"
        >
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest">Name</label>
              <input
                id="name"
                type="text"
                required
                className="bg-background border border-border-color p-4 focus:outline-none focus:border-cyan transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest">Email</label>
              <input
                id="email"
                type="email"
                required
                className="bg-background border border-border-color p-4 focus:outline-none focus:border-cyan transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                className="bg-background border border-border-color p-4 focus:outline-none focus:border-cyan transition-colors resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background font-bold uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-cyan transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
              <span className="relative z-10 group-hover:text-black transition-colors">
                {status === "submitting" ? "Sending..." : "Send Message"}
              </span>
              <Send className="w-5 h-5 relative z-10 group-hover:text-black transition-colors" />
            </button>

            {status === "success" && (
              <p className="text-green-500 font-bold tracking-wider uppercase text-center">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-500 font-bold tracking-wider uppercase text-center">Failed to send message. Please try again.</p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
