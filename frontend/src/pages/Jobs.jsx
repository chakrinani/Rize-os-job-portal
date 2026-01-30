import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, DollarSign, Filter, Building2 } from 'lucide-react';
import { getJobs, createJob } from '../api';
import { useAuth } from '../contexts/AuthContext';

const filters = ['All Jobs', 'Full-time', 'Contract', 'Remote', 'Crypto Pay'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Jobs');
  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postSalary, setPostSalary] = useState('');
  const [postSkills, setPostSkills] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let cancelled = false;
    getJobs()
      .then((data) => {
        if (!cancelled) setJobs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!postTitle) return;

    setError('');
    setPosting(true);

    try {
      const newJob = await createJob({
        title: postTitle,
        description: postDesc,
        salary: postSalary,
        skills: postSkills
          ? postSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });

      setJobs((prev) => [newJob, ...prev]);
      setPostTitle('');
      setPostDesc('');
      setPostSalary('');
      setPostSkills('');
      setShowPostForm(false);
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setPosting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    if (
      q &&
      !(job.title || '').toLowerCase().includes(q) &&
      !(job.description || '').toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Find Your Next <span className="text-gradient">Opportunity</span>
            </h1>
            <p className="text-muted-foreground">
              Browse jobs and post your own
            </p>
          </motion.div>

          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Button
                variant="default"
                className="mb-4"
                onClick={() => {
                  setError('');
                  setShowPostForm(!showPostForm);
                }}
              >
                {showPostForm ? 'Cancel' : 'Post a job'}
              </Button>

              {showPostForm && (
                <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                  
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <form
                    onSubmit={handlePostJob}
                    className="space-y-4 pt-4 border-t border-border"
                  >
                    <Input
                      placeholder="Job title"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      required
                      className="h-12 bg-secondary"
                    />
                    <textarea
                      placeholder="Description"
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Input
                      placeholder="Salary / Budget"
                      value={postSalary}
                      onChange={(e) => setPostSalary(e.target.value)}
                      className="h-12 bg-secondary"
                    />
                    <Input
                      placeholder="Skills (comma-separated)"
                      value={postSkills}
                      onChange={(e) => setPostSkills(e.target.value)}
                      className="h-12 bg-secondary"
                    />
                    <Button type="submit" variant="hero" disabled={posting}>
                      {posting ? 'Posting...' : 'Post job'}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card border-border"
                />
              </div>
              <Button variant="outline" className="h-12 gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-muted-foreground">
                No jobs yet. {isAuthenticated ? 'Post one above.' : 'Sign in to post jobs.'}
              </p>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id || job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover-lift cursor-pointer">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <Building2 className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {job.title}
                        </h3>
                        {job.description && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {job.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                          )}
                          {job.skills && job.skills.length > 0 && (
                            <span className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-md bg-secondary text-xs"
                                >
                                  {s}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button variant="default">Apply Now</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
