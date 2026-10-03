import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type FormData = { name: string; email: string; company: string; projectType: string; budget: string; timeline: string; message: string };
type FieldErrors = Partial<Record<keyof FormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PROJECT_TYPES = [
  'Computer Vision System',
  'Object Detection / Tracking',
  'Image Classification / Segmentation',
  'OCR / Document Intelligence',
  'AI Agent / Automation',
  'Production AI Application',
  'Deep Learning Model',
  'AI API / Integration',
  'Other',
];

const BUDGETS = [
  'Under $1,000',
  '$1,000–$3,000',
  '$3,000–$7,500',
  '$7,500–$15,000',
  '$15,000+',
  'Not sure yet — let’s discuss',
];

const TIMELINES = [
  'ASAP / within 2 weeks',
  '1 month',
  '2–3 months',
  '3+ months / ongoing',
  'Not sure yet',
];

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = 'Name is required.';
  if (!EMAIL_RE.test(data.email.trim())) errors.email = 'Enter a valid email address.';
  if (data.message.trim().length < 20) errors.message = 'Message must be at least 20 characters.';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', company: '', projectType: '', budget: '', timeline: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({})) as { error?: string; emailConfigured?: boolean };
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? 'Server error. Please try again.');
      }
      setEmailConfigured(data.emailConfigured ?? null);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setForm({ name: '', email: '', company: '', projectType: '', budget: '', timeline: '', message: '' });
    setErrors({});
    setServerError('');
    setEmailConfigured(null);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="font-mono text-primary text-sm mb-4 uppercase tracking-widest">09. Work With Me</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">Work With Me</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you have a computer vision problem to solve, an AI project to build,
            or a full-time remote role — I’d like to hear about it. I respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 glass-card p-8 md:p-12 rounded-2xl">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl text-foreground mb-2 font-semibold">Sherif Abd El-Rady</h3>
              <p className="text-sm text-muted-foreground font-mono">AI Engineer · Computer Vision &amp; Deep Learning</p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:sherifabdelrady@gmail.com"
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg border border-border group-hover:border-primary flex items-center justify-center bg-secondary group-hover:bg-primary/8 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">sherifabdelrady@gmail.com</span>
              </a>
              <a
                href="https://github.com/sherifabdelrady"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg border border-border group-hover:border-foreground flex items-center justify-center bg-secondary group-hover:bg-foreground/5 transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">github.com/sherifabdelrady</span>
              </a>
              <a
                href="https://linkedin.com/in/sherif-abd-el-rady"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-muted-foreground hover:text-[#0A66C2] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg border border-border group-hover:border-[#0A66C2] flex items-center justify-center bg-secondary group-hover:bg-[#0A66C2]/8 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">linkedin.com/in/sherif-abd-el-rady</span>
              </a>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs font-mono text-muted-foreground">
                Open to freelance projects, remote full-time roles, and research collaborations. Remote only from home.
              </p>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-muted-foreground">
                {['Computer Vision', 'Deep Learning', 'AI Systems'].map((svc) => (
                  <div key={svc} className="bg-secondary/60 border border-border rounded-lg px-2 py-1.5 text-center">{svc}</div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form / success / error */}
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-4"
              >
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {emailConfigured === false ? 'Message saved' : 'Message received'}
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                  {emailConfigured === false ? (
                    <>
                      Your message was saved, but inbox notifications are not configured yet.
                      For anything time-sensitive, email me directly at{' '}
                      <a href="mailto:sherifabdelrady@gmail.com" className="text-primary font-mono break-all underline underline-offset-2">
                        sherifabdelrady@gmail.com
                      </a>.
                    </>
                  ) : (
                    <>
                      Thanks for reaching out. I'll follow up at{' '}
                      <span className="text-primary font-mono break-all">{form.email}</span>{' '}
                      within a few days.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors mt-2 underline underline-offset-4"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                viewport={{ once: true }}
                className="space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="space-y-1">
                  <label htmlFor="contact-name" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={handleChange('name')}
                    className={`bg-background border-border font-mono focus-visible:ring-primary ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="Your Name"
                    autoComplete="name"
                    disabled={status === 'loading'}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-mono">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-email" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={`bg-background border-border font-mono focus-visible:ring-primary ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={status === 'loading'}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-mono">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-company" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Company / Organization <span className="normal-case opacity-60">(optional)</span></label>
                  <Input
                    id="contact-company"
                    value={form.company}
                    onChange={handleChange('company')}
                    className="bg-background border-border font-mono focus-visible:ring-primary"
                    placeholder="Acme Corp or personal project"
                    autoComplete="organization"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="contact-project-type" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Project Type</label>
                    <select
                      id="contact-project-type"
                      value={form.projectType}
                      onChange={(e) => setForm(prev => ({ ...prev, projectType: e.target.value }))}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      disabled={status === 'loading'}
                    >
                      <option value="">Select type...</option>
                      {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="contact-budget" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Budget Range</label>
                    <select
                      id="contact-budget"
                      value={form.budget}
                      onChange={(e) => setForm(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      disabled={status === 'loading'}
                    >
                      <option value="">Select range...</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-timeline" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Timeline</label>
                  <select
                    id="contact-timeline"
                    value={form.timeline}
                    onChange={(e) => setForm(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    disabled={status === 'loading'}
                  >
                    <option value="">Select timeline...</option>
                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-message" className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Message</label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={handleChange('message')}
                    className={`bg-background border-border font-mono min-h-[120px] focus-visible:ring-primary ${errors.message ? 'border-red-400' : ''}`}
                    placeholder="Tell me about the opportunity or project..."
                    disabled={status === 'loading'}
                  />
                  {errors.message && <p className="text-xs text-red-500 font-mono">{errors.message}</p>}
                </div>

                {/* Server-level error */}
                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400 font-mono">{serverError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold rounded-lg shadow-[0_4px_16px_rgba(59,130,246,0.2)] py-3 px-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
