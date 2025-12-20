import { motion } from "framer-motion";
import { Upload, Sparkles, CheckCircle, Download, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Brand Assets",
    description: "Drop your logo, packshots, and any existing creatives. Our Brand Stylist Agent learns your visual identity instantly.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Generate Creatives",
    description: "Tell us what you need—our Designer Agent creates multiple professional variations tailored to your brand.",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Auto-Compliance Check",
    description: "The Compliance Agent validates against retailer guidelines, automatically fixing any violations.",
  },
  {
    icon: Download,
    number: "04",
    title: "Export Multi-Format",
    description: "Get optimized creatives for every channel—social, e-commerce, in-store—all under 500KB and ready to deploy.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From upload to export in four simple steps. No design experience needed.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-6 mb-8">
                {/* Number and Line */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <span className="text-primary font-display font-bold text-sm">{step.number}</span>
                  <h3 className="font-display text-2xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
