import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Paperclip } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const payload = new FormData();
      // Access Key from Web3Forms (User will put this in .env)
      payload.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE");
      
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("subject", formData.subject);
      payload.append("message", formData.message);
      
      if (attachment) {
        payload.append("attachment", attachment);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section className="relative w-full py-32 bg-background border-t border-border-color overflow-hidden">
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
          className="bg-bg-secondary p-8 border border-border-color min-h-[500px] flex items-center justify-center relative overflow-hidden"
        >
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-6 z-10 w-full"
            >
              <motion.div
                initial={{ y: 300, opacity: 0, scale: 0.5 }}
                animate={{ y: -600, opacity: [0, 1, 1, 0], scale: 1.5 }}
                transition={{ duration: 3, ease: "easeIn" }}
                className="absolute"
              >
                <Rocket className="w-32 h-32 text-cyan" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-background/80 backdrop-blur-sm p-8 border border-cyan shadow-[0_0_30px_rgba(0,255,255,0.2)]"
              >
                <h3 className="text-2xl font-black uppercase text-cyan mb-4">Message Launched</h3>
                <p className="text-foreground/80 font-mono tracking-wider text-left leading-relaxed">
                  &gt; CONNECTING WITH INTERNATIONAL SATELLITE CENTRE...<br/>
                  &gt; UPLINK ESTABLISHED.<br/>
                  &gt; TRANSMISSION COMPLETE.
                </p>
                <button 
                  onClick={() => {
                    setStatus("idle");
                    setFormData({ name: "", email: "", subject: "", message: "" });
                    setAttachment(null);
                  }}
                  className="mt-8 px-6 py-2 border border-cyan text-cyan hover:bg-cyan hover:text-black transition-colors uppercase tracking-widest font-bold text-sm w-full"
                >
                  Send Another
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="subject" className="text-sm font-bold uppercase tracking-widest">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="bg-background border border-border-color p-4 focus:outline-none focus:border-cyan transition-colors"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest">Attachment (Optional)</label>
                <label className="flex items-center gap-3 p-4 border border-dashed border-border-color bg-background cursor-pointer hover:border-cyan transition-colors group">
                  <Paperclip className="w-5 h-5 group-hover:text-cyan transition-colors" />
                  <span className="text-sm font-mono truncate">
                    {attachment ? attachment.name : "Click to select a file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachment(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background font-bold uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-50 mt-4"
              >
                <div className="absolute inset-0 bg-cyan transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
                <span className="relative z-10 group-hover:text-black transition-colors">
                  {status === "submitting" ? "Initiating Launch..." : "Transmit"}
                </span>
                <Rocket className="w-5 h-5 relative z-10 group-hover:text-black transition-colors" />
              </button>

              {status === "error" && (
                <p className="text-red-500 font-bold tracking-wider uppercase text-center mt-4">Transmission failed. Please try again.</p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
