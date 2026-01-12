import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, TrendingUp, Users, Award } from "lucide-react";

const stats = [
  { icon: Calendar, value: "6+", label: "Years Experience" },
  { icon: TrendingUp, value: "50+", label: "Projects Delivered" },
  { icon: Users, value: "30+", label: "Happy Clients" },
  { icon: Award, value: "100%", label: "Customer Focused" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium mb-4 block">
              About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              From Android Native to
              <span className="gradient-text"> Flutter Leadership</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Started my mobile development journey in 2019 as an Android
                native developer. Over the years, I've transitioned into
                becoming a Flutter specialist, now leading complex
                cross-platform projects.
              </p>
              <p>
                My expertise spans beyond just mobile UI — I specialize in
                integrating IoT devices via Bluetooth, building real-time
                systems with Firebase, and architecting cloud-native solutions
                on Google Cloud Platform.
              </p>
              <p>
                What drives me? Creating ambitious, customer-centric solutions
                that push the boundaries of what's possible on mobile.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Flutter",
                "Dart",
                "Firebase",
                "GCP",
                "IoT",
                "Bluetooth",
                "Android",
                "iOS",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right stats grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-card rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 40px -15px hsl(199 89% 48% / 0.2)",
                }}
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-3xl md:text-4xl font-bold font-heading gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
