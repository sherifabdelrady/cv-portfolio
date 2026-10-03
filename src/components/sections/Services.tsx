import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Zap, Layers, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

type Tier = {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  problem: string;
  deliverables: string[];
  timeline: string;
  technologies: string[];
  includes: string[];
  excludes: string[];
  cta: string;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Proof of Concept',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/25',
    problem: 'You want to know if AI can actually solve your problem before committing to a full build.',
    deliverables: [
      'Working proof-of-concept model or pipeline',
      'Trained model with evaluation metrics',
      'Jupyter notebook with reproducible results',
      'Short technical report: approach, results, limitations',
      'Code repository with setup instructions',
    ],
    timeline: '1–2 weeks',
    technologies: ['PyTorch', 'Python', 'OpenCV', 'scikit-learn'],
    includes: [
      'Problem scoping call',
      'Dataset review and recommendations',
      '1 model architecture',
      'Basic evaluation (accuracy, F1, confusion matrix)',
      '1 round of revisions',
    ],
    excludes: [
      'Production API or deployment',
      'Frontend interface',
      'Custom dataset collection',
      'Ongoing maintenance',
    ],
    cta: 'Start a conversation',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Custom AI System',
    icon: Layers,
    color: 'text-primary',
    bg: 'bg-primary/8',
    border: 'border-primary/30',
    problem: 'You need a complete, working AI system — not just a notebook. Something you can actually use.',
    deliverables: [
      'Production-ready AI model (trained, evaluated, optimized)',
      'REST API with FastAPI (JSON I/O, error handling, logging)',
      'Docker container for easy deployment',
      'Full evaluation: metrics, failure cases, ablations',
      'Architecture documentation',
      'Setup and usage instructions',
      '.env.example with no secrets in code',
    ],
    timeline: '3–6 weeks',
    technologies: ['PyTorch', 'OpenCV', 'FastAPI', 'Docker', 'ONNX', 'Python'],
    includes: [
      'Full requirements discovery',
      'Dataset strategy (preprocessing, augmentation, splits)',
      'Custom architecture or fine-tuning with ablations',
      'ONNX export + inference optimization',
      'FastAPI endpoint with validation',
      'Docker Compose for local deployment',
      '2 rounds of revisions',
      '2-week post-delivery support',
    ],
    excludes: [
      'Custom frontend UI',
      'Cloud infrastructure setup',
      'Ongoing model retraining',
    ],
    cta: 'Discuss your project',
    popular: true,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    tagline: 'Production AI Platform',
    icon: Cpu,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/25',
    problem: 'You need a complete end-to-end AI application — model, backend, frontend, monitoring, and deployment.',
    deliverables: [
      'End-to-end AI application (frontend + backend + model layer)',
      'Production inference pipeline with batching and caching',
      'ONNX / TorchScript optimized model',
      'Monitoring dashboard (Prometheus + Grafana)',
      'PostgreSQL or vector database integration',
      'Full test suite (unit + integration)',
      'Deployment-ready Docker Compose / k8s configs',
      'Technical documentation',
    ],
    timeline: '6–12 weeks',
    technologies: ['PyTorch', 'FastAPI', 'React', 'Docker', 'PostgreSQL', 'Prometheus', 'Triton'],
    includes: [
      'Full discovery and architecture design',
      'Custom model training with hyperparameter search',
      'Production API with authentication',
      'Web interface for demo / internal use',
      'Model monitoring and drift detection',
      'CI/CD pipeline setup guidance',
      'Security review (secrets, CORS, injection)',
      '3 rounds of revisions',
      '4-week post-delivery support window',
    ],
    excludes: [
      'Ongoing retainer / maintenance (separate agreement)',
      'Accuracy guarantees before evaluating your specific data',
    ],
    cta: 'Plan the build',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    body: 'We discuss your problem, data situation, constraints, and success criteria. I ask the uncomfortable questions early so there are no surprises later.',
    duration: '1–2 calls',
  },
  {
    step: '02',
    title: 'Proposal',
    body: 'I send a written scope document: what I\'ll build, how I\'ll evaluate it, what I need from you, timeline, and what\'s not included.',
    duration: 'Within 48 hours',
  },
  {
    step: '03',
    title: 'Build',
    body: 'I work asynchronously with weekly updates. All experiments are tracked. You can see progress in the shared repository at any point.',
    duration: 'Agreed timeline',
  },
  {
    step: '04',
    title: 'Evaluation',
    body: 'I present the full evaluation: metrics, failure cases, what the model gets wrong, and my honest assessment of production readiness.',
    duration: 'Included',
  },
  {
    step: '05',
    title: 'Handoff',
    body: 'Clean code, documentation, .env.example, Docker setup, and a walkthrough call. You own everything — models, weights, code.',
    duration: 'Included',
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = tier.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      className={`relative glass-card rounded-2xl border ${tier.border} flex flex-col ${tier.popular ? 'ring-2 ring-primary/40 shadow-[0_0_32px_rgba(59,130,246,0.1)]' : ''}`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-mono text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-widest">
          Most Popular
        </div>
      )}

      <div className={`p-6 pb-4 ${tier.bg} rounded-t-2xl border-b border-border`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`w-10 h-10 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${tier.color}`} />
            </div>
            <h3 className={`font-mono font-bold text-xl ${tier.color}`}>{tier.name}</h3>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{tier.tagline}</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-full whitespace-nowrap self-start">
            {tier.timeline}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-4 italic">
          "{tier.problem}"
        </p>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-5">
        {/* Deliverables */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest mb-3">What you receive</p>
          <ul className="space-y-2">
            {tier.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle className={`w-3.5 h-3.5 ${tier.color} flex-shrink-0 mt-[3px]`} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {tier.technologies.map((t) => (
            <span key={t} className="font-mono text-[10px] bg-secondary border border-border px-2 py-0.5 rounded text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        {/* Expandable includes/excludes */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <span className="uppercase tracking-wider text-[10px]">Includes &amp; Exclusions</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-4 border-t border-border space-y-4"
              >
                <div className="pt-3">
                  <p className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-2">Included</p>
                  <ul className="space-y-1">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-[5px]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-2">Not included</p>
                  <ul className="space-y-1">
                    {tier.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-border flex-shrink-0 mt-[5px]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`mt-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-mono font-semibold text-sm transition-all group ${
            tier.popular
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_rgba(59,130,246,0.25)]'
              : `bg-secondary text-foreground border border-border hover:border-primary/50 hover:text-primary`
          }`}
        >
          {tier.cta}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">06. Services</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground font-mono text-sm mb-4 max-w-2xl"
        >
          Each engagement is scoped honestly. I don't guarantee accuracy before seeing your data. I don't promise impossible timelines.
          What I do guarantee: clear communication, documented decisions, and code you can actually run.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-mono text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/8 border border-amber-500/20 rounded-lg px-4 py-2.5 mb-14 flex items-start gap-2 max-w-2xl"
        >
          <span className="flex-shrink-0">⚠</span>
          <span>
            Pricing varies by scope, data complexity, and timeline. Contact me to discuss your specific situation — I'll give you an honest estimate within 48 hours.
          </span>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10 flex items-end gap-4"
        >
          <h3 className="text-3xl md:text-4xl font-bold">How It Works</h3>
          <div className="h-px bg-border flex-1 mb-2" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors"
            >
              <div className="font-mono text-3xl font-bold text-primary/20 leading-none">{step.step}</div>
              <div>
                <h4 className="font-mono font-bold text-sm text-foreground">{step.title}</h4>
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest">{step.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Honest policy note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 glass-card rounded-2xl p-8 border border-border"
        >
          <h4 className="font-mono font-bold text-foreground mb-4">What I don't promise</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-muted-foreground">
            <div className="space-y-1.5">
              <p className="text-foreground font-semibold text-sm">Accuracy guarantees</p>
              <p>Model performance depends on your data. I'll show you honest metrics and failure cases — not a number chosen to win the proposal.</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-foreground font-semibold text-sm">Impossible timelines</p>
              <p>Training, evaluation, and debugging take real time. I'll give you a realistic estimate and flag risks early if they change.</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-foreground font-semibold text-sm">One-size-fits-all pricing</p>
              <p>Every project is different. The tiers above are starting frameworks. We'll scope your project properly before agreeing on anything.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
