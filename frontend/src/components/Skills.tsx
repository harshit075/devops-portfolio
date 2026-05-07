"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed } from "lucide-react";

const pipelineStages = [
  {
    id: "source",
    title: "Source & Build",
    status: "success",
    time: "12s",
    iconSlugs: ["c", "cplusplus", "typescript", "react"],
    skills: ["C/C++", "TypeScript", "React", "Next.js"],
  },
  {
    id: "containerize",
    title: "Containerize",
    status: "success",
    time: "45s",
    iconSlugs: ["docker", "linux", "gnubash"],
    skills: ["Docker", "Linux", "Bash Scripting"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure as Code",
    status: "success",
    time: "2m 14s",
    iconSlugs: ["terraform", "amazonwebservices"],
    skills: ["Terraform", "AWS (EC2, S3, RDS, VPC)", "EKS/ECS"],
  },
  {
    id: "deploy",
    title: "CI/CD & Delivery",
    status: "success",
    time: "1m 30s",
    iconSlugs: ["githubactions", "gitlab", "jenkins"],
    skills: ["GitHub Actions", "GitLab CI", "Jenkins"],
  },
  {
    id: "monitor",
    title: "Observe & Monitor",
    status: "running",
    time: "active",
    iconSlugs: ["prometheus", "grafana", "zabbix"],
    skills: ["Prometheus", "Grafana", "Zabbix", "CloudWatch"],
  },
];

const AWSIcon = () => (
  <svg viewBox="0 0 304 182" fill="currentColor" className="w-6 h-6 object-contain text-[#58a6ff]">
    <path d="M86.4,66.4c0,3.7,0.4,6.7,1.1,8.9c0.8,2.2,1.8,4.6,3.2,7.2c0.5,0.8,0.7,1.6,0.7,2.3c0,1-0.6,2-1.9,3l-6.3,4.2c-0.9,0.6-1.8,0.9-2.6,0.9c-1,0-2-0.5-3-1.4C76.2,90,75,88.4,74,86.8c-1-1.7-2-3.6-3.1-5.9c-7.8,9.2-17.6,13.8-29.4,13.8c-8.4,0-15.1-2.4-20-7.2c-4.9-4.8-7.4-11.2-7.4-19.2c0-8.5,3-15.4,9.1-20.6c6.1-5.2,14.2-7.8,24.5-7.8c3.4,0,6.9,0.3,10.6,0.8c3.7,0.5,7.5,1.3,11.5,2.2v-7.3c0-7.6-1.6-12.9-4.7-16c-3.2-3.1-8.6-4.6-16.3-4.6c-3.5,0-7.1,0.4-10.8,1.3c-3.7,0.9-7.3,2-10.8,3.4c-1.6,0.7-2.8,1.1-3.5,1.3c-0.7,0.2-1.2,0.3-1.6,0.3c-1.4,0-2.1-1-2.1-3.1v-4.9c0-1.6,0.2-2.8,0.7-3.5c0.5-0.7,1.4-1.4,2.8-2.1c3.5-1.8,7.7-3.3,12.6-4.5c4.9-1.3,10.1-1.9,15.6-1.9c11.9,0,20.6,2.7,26.2,8.1c5.5,5.4,8.3,13.6,8.3,24.6V66.4z M45.8,81.6c3.3,0,6.7-0.6,10.3-1.8c3.6-1.2,6.8-3.4,9.5-6.4c1.6-1.9,2.8-4,3.4-6.4c0.6-2.4,1-5.3,1-8.7v-4.2c-2.9-0.7-6-1.3-9.2-1.7c-3.2-0.4-6.3-0.6-9.4-0.6c-6.7,0-11.6,1.3-14.9,4c-3.3,2.7-4.9,6.5-4.9,11.5c0,4.7,1.2,8.2,3.7,10.6C37.7,80.4,41.2,81.6,45.8,81.6z" />
    <path d="M273.5,143.7c-32.9,24.3-80.7,37.2-121.8,37.2c-57.6,0-109.5-21.3-148.7-56.7c-3.1-2.8-0.3-6.6,3.4-4.4c42.4,24.6,94.7,39.5,148.8,39.5c36.5,0,76.6-7.6,113.5-23.2C274.2,133.6,278.9,139.7,273.5,143.7z" />
  </svg>
);

export function Skills() {
  return (
    <section id="skills" className="relative w-full py-32 overflow-hidden bg-[#0d1117] font-mono border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 z-10 relative">
        <div className="flex flex-col mb-16 items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#c9d1d9]">
            Workflow Pipeline
          </h2>
          <span className="text-sm md:text-base font-bold tracking-widest text-[#8b949e] uppercase mt-2">
            Technical Arsenal
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0 mt-20 relative">
          
          {/* Connecting Line Background (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-[#21262d] -translate-y-1/2 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#58a6ff] via-[#3fb950] to-[#d2a8ff]" 
            />
          </div>

          {/* Connecting Line Background (Mobile) */}
          <div className="block lg:hidden absolute left-1/2 top-0 h-full w-1 bg-[#21262d] -translate-x-1/2 z-0">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-gradient-to-b from-[#58a6ff] via-[#3fb950] to-[#d2a8ff]" 
            />
          </div>

          {pipelineStages.map((stage, index) => (
            <div key={stage.id} className="relative z-10 flex flex-col items-center flex-1 w-full lg:w-auto">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="w-full max-w-[280px] bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#58a6ff] transition-colors shadow-2xl relative group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#58a6ff]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between mb-4 border-b border-[#30363d] pb-3">
                  <div className="flex flex-col">
                    <span className="text-[#8b949e] text-[10px] uppercase tracking-widest font-bold mb-1">Stage {index + 1}</span>
                    <h3 className="text-[#c9d1d9] font-bold text-sm">{stage.title}</h3>
                  </div>
                  {stage.status === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#3fb950]" />
                  ) : (
                    <CircleDashed className="w-5 h-5 text-[#d2a8ff] animate-spin-slow" />
                  )}
                </div>

                {/* Icons */}
                <div className="flex gap-3 mb-4 min-h-[24px]">
                  {stage.iconSlugs.map((slug) => (
                    slug === "amazonwebservices" ? (
                      <AWSIcon key={slug} />
                    ) : (
                      <img
                        key={slug}
                        src={`https://cdn.simpleicons.org/${slug}/58a6ff`}
                        alt={`${slug} logo`}
                        className="w-6 h-6 object-contain"
                      />
                    )
                  ))}
                </div>

                {/* Skills List */}
                <div className="flex flex-col gap-1.5">
                  {stage.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#8b949e]" />
                      <span className="text-xs text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors">{skill}</span>
                    </div>
                  ))}
                </div>

                {/* Execution Time */}
                <div className="absolute bottom-3 right-4 text-[10px] text-[#8b949e] font-bold">
                  {stage.time}
                </div>
              </motion.div>

              {/* Node Connector Dot */}
              <div className="hidden lg:flex w-4 h-4 rounded-full bg-[#0d1117] border-2 border-[#58a6ff] absolute top-1/2 -translate-y-1/2 -z-10 shadow-[0_0_10px_rgba(88,166,255,0.5)]" />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
