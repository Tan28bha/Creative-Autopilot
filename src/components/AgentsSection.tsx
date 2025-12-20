import { motion } from "framer-motion";
import { 
  Palette, 
  Layout, 
  ShieldCheck, 
  Layers, 
  Bot,
  Wand2 
} from "lucide-react";

const agents = [
  {
    icon: Palette,
    name: "Brand Stylist Agent",
    description: "Learns your brand identity—colors, fonts, tone, and visual style—from logos, packshots, and past creatives.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Wand2,
    name: "Designer Agent",
    description: "Generates creative layouts, backgrounds, and compositions using advanced generative models and visual design rules.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: ShieldCheck,
    name: "Compliance Agent",
    description: "Analyzes creatives using Vision AI + LLM reasoning to ensure retailer and brand guideline compliance.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: Layers,
    name: "Adaptive Layout Agent",
    description: "Converts one creative into multiple formats while maintaining visual balance and compliance across channels.",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const AgentsSection = () => {
  return (
    <section id="agents" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Bot className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Multi-Agent AI System</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Meet Your <span className="text-gradient-accent">AI Agents</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four specialized AI agents work together to create, validate, and optimize your retail creatives.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass rounded-2xl p-8 h-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl ${agent.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <agent.icon className={`w-7 h-7 ${agent.color}`} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {agent.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {agent.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
