import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-card via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(174,72%,56%,0.1)_0%,transparent_60%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(199,89%,48%)] to-accent opacity-20" />
            <div className="absolute inset-[1px] rounded-3xl bg-card" />
            <div className="relative p-8 sm:p-12 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Join the Future of Work</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Ready to <span className="text-gradient">Rise Up?</span></h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">Join thousands of professionals already leveraging AI and Web3 to accelerate their careers.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button variant="hero" size="xl">Create Free Account <ArrowRight className="w-5 h-5" /></Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" size="lg">Explore Jobs</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
