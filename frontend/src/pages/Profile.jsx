import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, Plus, X } from 'lucide-react';
import { getProfile, updateProfile } from '../api';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    linkedInUrl: '',
    skills: [],
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setSkills(data.skills || []);
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      await updateProfile({
        name: profile.name,
        bio: profile.bio,
        linkedInUrl: profile.linkedInUrl,
        skills,
      });

      await loadProfile();
      setSuccess('Profile updated successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div className="mb-8">
            <h1 className="font-display text-3xl font-bold">
              Your <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-muted-foreground">Showcase your skills</p>
          </motion.div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* BASIC INFO */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="font-display text-lg font-semibold mb-4">Basic Information</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-secondary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    value={profile.linkedInUrl || ''}
                    onChange={(e) => setProfile({ ...profile, linkedInUrl: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
              </div>

              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full min-h-[120px] rounded-md bg-secondary px-3 py-2"
              />
            </div>

            {/* SKILLS */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">Skills</h2>
                <Button variant="outline" size="sm" disabled>
                  <Sparkles className="w-4 h-4" /> AI Extract (Coming Soon)
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-primary/10">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X className="inline w-3 h-3 ml-1" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {success && <p className="text-primary">{success}</p>}
            {error && <p className="text-destructive">{error}</p>}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit" variant="hero" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
