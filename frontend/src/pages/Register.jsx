import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, ArrowRight, Loader2, Linkedin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', linkedin: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    if (formData.password.length < 6) return;
    setIsLoading(true);
    const result = await signup(formData);
    setIsLoading(false);
    if (result.success) navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.08)_0%,transparent_50%)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-[hsl(199,89%,48%)] to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">R</span>
          </div>
          <span className="font-display font-bold text-2xl text-foreground">RizeOS</span>
        </Link>
        <div className="p-8 rounded-2xl bg-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground text-sm">Join the future of work in Web3</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="pl-10 h-12 bg-secondary border-border" disabled={isLoading} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="pl-10 h-12 bg-secondary border-border" disabled={isLoading} required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="pl-10 h-12 bg-secondary border-border" disabled={isLoading} required minLength={6} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium text-foreground">LinkedIn URL (optional)</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedin} onChange={handleChange} className="pl-10 h-12 bg-secondary border-border" disabled={isLoading} />
              </div>
            </div>
            <Button variant="hero" type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
