import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileSearch, Wallet, Rocket } from 'lucide-react';

const steps = [
  { icon: UserPlus, step: '01', title: 'Create Profile', description: 'Sign up and build your professional profile with skills, experience, and portfolio.' },
  { icon: FileSearch, step: '02', title: 'AI Skill Analysis', description: 'Our AI extracts skills from your resume and suggests improvements.' },
  { icon: Wallet, step: '03', title: 'Connect Wallet', description: 'Link your MetaMask or Phantom wallet for seamless crypto payments.' },
  { icon: Rocket, step: '04', title: 'Get Matched', description: 'Receive AI-powered job matches and start earning in crypto.' },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">How It <span className="text-gradient">Works</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Get started in minutes and unlock a world of opportunities.</p>
        </motion.div>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }} className="relative">
                  {index < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />}
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-card border border-primary/30 mb-4 group-hover:scale-110 transition-transform relative">
                      <Icon className="w-7 h-7 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
