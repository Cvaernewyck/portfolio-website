import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Smartphone,
  Wifi,
  Database,
  Cloud,
  Bluetooth,
  Zap,
} from "lucide-react";

const skills = [
  {
    icon: Smartphone,
    title: "Flutter Development",
    description:
      "Cross-platform excellence with beautiful, performant apps for iOS and Android from a single codebase.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Wifi,
    title: "IoT Integration",
    description:
      "Connecting physical devices to mobile apps. Smart home, wearables, industrial sensors — you name it.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Bluetooth,
    title: "Bluetooth Solutions",
    description:
      "BLE and classic Bluetooth implementations. Device pairing, data streaming, and protocol handling.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Database,
    title: "Firebase Backend",
    description:
      "Real-time databases, authentication, cloud functions, and analytics. Full Firebase ecosystem expertise.",
    gradient: "from-accent/80 to-primary/80",
  },
  {
    icon: Cloud,
    title: "Google Cloud Platform",
    description:
      "Scalable cloud architecture. Cloud Run, Pub/Sub, BigQuery, and more for enterprise-grade solutions.",
    gradient: "from-primary/80 to-accent",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Fast, smooth, and efficient. Memory management, lazy loading, and UI optimization techniques.",
    gradient: "from-accent to-primary",
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 md:py-32 relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 glow-bg opacity-30" />

      <div className="container px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary font-medium mb-4 block">What I Do</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Expertise &<span className="gradient-text"> Specializations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive skill set focused on delivering end-to-end mobile
            solutions with modern technologies and best practices.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              className="group card-gradient rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${skill.gradient} mb-6`}
              >
                <skill.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-3 group-hover:text-primary transition-colors">
                {skill.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
