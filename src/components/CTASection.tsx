import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-12 md:p-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Start for free</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your{" "}
              <span className="text-gradient-primary">Creative Workflow?</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Join brands and agencies creating professional retail creatives in minutes, not days. 
              No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="group">
                  Launch Creative Studio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Schedule Demo
              </Button>
            </div>

            <p className="text-muted-foreground text-sm mt-8">
              Trusted by 500+ brands • 10,000+ creatives generated
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
