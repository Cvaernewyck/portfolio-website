import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Smartphone, Wifi, Cloud } from "lucide-react";

const projects = [
  {
    title: "Smart Home Controller",
    description:
      "A comprehensive IoT app connecting 50+ smart devices via Bluetooth and WiFi. Real-time control, automation rules, and energy monitoring.",
    tags: ["Flutter", "IoT", "Bluetooth", "Firebase"],
    icon: Wifi,
    gradient: "from-primary/20 to-accent/20",
    borderGradient: "from-primary to-accent",
  },
  {
    title: "Health Wearable Companion",
    description:
      "Mobile app syncing with BLE health devices. Heart rate monitoring, sleep tracking, and cloud-synced health analytics.",
    tags: ["Flutter", "BLE", "GCP", "Health Kit"],
    icon: Smartphone,
    gradient: "from-accent/20 to-primary/20",
    borderGradient: "from-accent to-primary",
  },
  {
    title: "Enterprise Fleet Manager",
    description:
      "Real-time vehicle tracking system with Firebase backend. GPS integration, driver analytics, and route optimization.",
    tags: ["Flutter", "Firebase", "Maps", "Real-time"],
    icon: Cloud,
    gradient: "from-primary/20 to-accent/20",
    borderGradient: "from-primary to-accent",
  },
  {
    title: "Industrial Sensor Dashboard",
    description:
      "Manufacturing floor monitoring app. BLE sensor integration, predictive maintenance alerts, and data visualization.",
    tags: ["Flutter", "IoT", "GCP", "Analytics"],
    icon: Wifi,
    gradient: "from-accent/20 to-primary/20",
    borderGradient: "from-accent to-primary",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary font-medium mb-4 block">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Featured<span className="gradient-text"> Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of projects showcasing expertise in Flutter, IoT, and
            cloud integrations. Each built with customer success as the primary
            goal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Gradient border effect */}
              <div
                className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${project.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}
              />

              <div
                className={`relative bg-gradient-to-br ${project.gradient} rounded-2xl p-8 border border-border group-hover:border-transparent transition-all duration-500 h-full`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-xl bg-background/50">
                    <project.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors">
                      <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    </button>
                    <button className="p-2 rounded-lg bg-background/50 hover:bg-background transition-colors">
                      <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-heading mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-background/50 text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
