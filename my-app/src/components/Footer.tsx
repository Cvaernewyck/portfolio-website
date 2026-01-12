import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground"></div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} FlutterDev. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
