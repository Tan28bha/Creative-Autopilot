import { motion } from "framer-motion";
import { 
  Image, 
  Smartphone, 
  Monitor, 
  ShoppingBag,
  Megaphone,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Image,
    title: "AI Background Generation",
    description: "Create stunning, contextual backgrounds with diffusion models.",
  },
  {
    icon: Smartphone,
    title: "Multi-Format Export",
    description: "Instagram, Facebook, e-commerce, in-store—all from one design.",
  },
  {
    icon: Monitor,
    title: "Drag & Drop Editor",
    description: "Fine-tune AI outputs with an intuitive visual editor.",
  },
  {
    icon: ShoppingBag,
    title: "Retailer Compliance",
    description: "Auto-check Amazon, Meta, and in-store POS guidelines.",
  },
  {
    icon: Megaphone,
    title: "Campaign Ready",
    description: "Generate dozens of variations for A/B testing instantly.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "AI-powered predictions for creative effectiveness.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient-primary">Create & Scale</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional creative tools powered by cutting-edge AI, designed for speed and compliance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
