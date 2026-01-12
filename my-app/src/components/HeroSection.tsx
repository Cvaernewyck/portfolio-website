import { motion } from "framer-motion";
import { ArrowDown, Smartphone, Cpu, Cloud } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 glow-bg animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 glow-bg animate-pulse-glow"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-32 left-[15%] text-primary/30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Smartphone size={48} />
      </motion.div>
      <motion.div
        className="absolute top-48 right-[20%] text-accent/30"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Cpu size={40} />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-[25%] text-primary/20"
        animate={{ y: [0, -25, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Cloud size={56} />
      </motion.div>

      {/* Main content */}
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full border border-primary/30 bg-primary/10 text-primary">
              Available for Projects
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Flutter Developer
            <br />
            <span className="gradient-text">& IoT Expert</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Building ambitious mobile solutions since 2019. From Android native
            to leading Flutter projects — specialized in IoT, Bluetooth,
            Firebase & GCP integrations.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a
              href="#projects"
              className="px-8 py-4 rounded-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 glow-effect"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-lg font-semibold border border-border hover:bg-secondary transition-all duration-300"
            >
              Get in Touch
            </a>
          </motion.div>

          <motion.div
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <a
              href="#about"
              className="inline-flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown size={20} />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
