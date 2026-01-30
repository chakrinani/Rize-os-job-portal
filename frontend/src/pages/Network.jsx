import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, UserPlus, MessageSquare, MapPin, Briefcase, Star, Users } from 'lucide-react';

const mockPeople = [
  { id: 1, name: 'Sarah Chen', title: 'Senior Blockchain Developer', company: 'DeFi Labs', location: 'San Francisco, CA', skills: ['Solidity', 'Rust', 'Ethereum'], matchScore: 92, mutual: 12 },
  { id: 2, name: 'Marcus Johnson', title: 'Web3 Product Manager', company: 'NFT Collective', location: 'New York, NY', skills: ['Product Strategy', 'DeFi', 'Tokenomics'], matchScore: 87, mutual: 8 },
  { id: 3, name: 'Elena Rodriguez', title: 'Full Stack Developer', company: 'Crypto Exchange', location: 'Remote', skills: ['React', 'Node.js', 'Web3.js'], matchScore: 84, mutual: 15 },
];

export default function Network() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Grow Your <span className="text-gradient">Network</span></h1>
            <p className="text-muted-foreground">Connect with professionals matched to your profile</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search by name, skill, or company..." className="pl-10 h-12 bg-card border-border" />
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPeople.map((person, index) => (
              <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-display font-bold text-xl">{person.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">{person.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/30">
                      <Star className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">{person.matchScore}%</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{person.company}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{person.location}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" />{person.mutual} mutual connections</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {person.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">{skill}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" className="flex-1 gap-2"><UserPlus className="w-4 h-4" /> Connect</Button>
                    <Button variant="outline" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
