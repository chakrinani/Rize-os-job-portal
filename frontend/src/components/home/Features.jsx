import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Wallet, Shield, Zap, Users, Target } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Matching', description: 'Our ML algorithms analyze your skills and experience to match you with the perfect opportunities.', gradient: 'from-primary to-[hsl(199,89%,48%)]' },
  { icon: Wallet, title: 'Web3 Payments', description: 'Seamlessly connect MetaMask or Phantom to pay and receive in SOL, ETH, or MATIC.', gradient: 'from-[hsl(280,100%,70%)] to-primary' },
  { icon: Shield, title: 'Blockchain Verified', description: 'All transactions are logged on-chain for complete transparency and trust.', gradient: 'from-accent to-[hsl(280,100%,70%)]' },
  { icon: Zap, title: 'Skill Extraction', description: 'Upload your resume and let AI automatically extract and validate your skills.', gradient: 'from-[hsl(199,89%,48%)] to-accent' },
  { icon: Users, title: 'Professional Network', description: 'Build meaningful connections with industry professionals and thought leaders.', gradient: 'from-primary to-accent' },
  { icon: Target, title: 'Smart Recommendations', description: 'Get personalized job and connection suggestions based on your profile.', gradient: 'from-accent to-primary' },
];

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(222,47%,8%)_0%,hsl(222,47%,6%)_100%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Why Choose <span className="text-gradient">RizeOS</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A next-generation job portal that combines the best of AI, Web3, and professional networking.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group">
                <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover-lift">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
