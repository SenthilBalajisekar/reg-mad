'use client';

import { motion, AnimatePresence } from 'framer-motion';

/* ── Shared phone-screen wrapper ───────────────────────── */
function PhoneFrame({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 202,
        height: 410,
        background: 'linear-gradient(160deg, #090314 0%, #3b1464 45%, #18072e 85%, #080210 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 8,
      }}
    >
      {/* Status bar with Dynamic Island */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 14px 2px',
          fontSize: 9,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: 0.5,
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span style={{ fontWeight: 600 }}>9:41</span>
        
        {/* Dynamic Island Pill */}
        <div
          style={{
            width: 58,
            height: 14,
            borderRadius: 10,
            background: '#000',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#0f172a' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0284c7', boxShadow: '0 0 4px #0284c7' }} />
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 8 }}>
          <span>5G</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Accent top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: `radial-gradient(ellipse at 50% 0%, ${accent}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          height: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 52,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.3)',
          }}
        />
      </div>
    </div>
  );
}

/* ── Pill / tag ─────────────────────────────────────────── */
function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1,
        background: `${color}22`,
        border: `1px solid ${color}44`,
        color: color,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}

/* ── Card ───────────────────────────────────────────────── */
function Card({
  children,
  accent,
  style,
}: {
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: accent ? `${accent}10` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${accent ? accent + '30' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 8,
        padding: '8px 10px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREENS
══════════════════════════════════════════════════════════ */

function HeroScreen() {
  return (
    <PhoneFrame accent="#3b82f6">
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            margin: '0 auto 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 0 16px #3b82f688',
          }}>📱</div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#94a3b8', textTransform: 'uppercase' }}>
            Mobile App Club
          </div>
        </div>

        {/* Hero text */}
        <Card accent="#3b82f6" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: 1, lineHeight: 1.3 }}>
            HACK THE<br />FUTURE
          </div>
          <div style={{ fontSize: 8, color: '#3b82f6', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>
            Build The Unexpected
          </div>
        </Card>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Pill label="24 HRS" color="#3b82f6" />
          <Pill label="HACKATHON" color="#8b5cf6" />
          <Pill label="2026" color="#14b8a6" />
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['#3b82f6','#6366f1','#8b5cf6'].map((c, i) => (
            <motion.div
              key={c}
              style={{ width: 6, height: 6, borderRadius: '50%', background: c }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Live now</span>
        </div>

        {/* CTA button */}
        <div style={{
          textAlign: 'center',
          padding: '8px 0',
          borderRadius: 8,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          fontSize: 9, fontWeight: 800, letterSpacing: 2,
          textTransform: 'uppercase',
          boxShadow: '0 0 12px #3b82f655',
        }}>
          EXPLORE →
        </div>
      </div>
    </PhoneFrame>
  );
}

function StatsScreen() {
  const stats = [
    { label: 'Participants', value: '200+', color: '#6366f1' },
    { label: 'Prize Pool', value: '₹50K', color: '#8b5cf6' },
    { label: 'Hours', value: '24H', color: '#3b82f6' },
    { label: 'Tracks', value: '6', color: '#14b8a6' },
  ];
  return (
    <PhoneFrame accent="#6366f1">
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#6366f1', letterSpacing: 2, textTransform: 'uppercase' }}>
          📊 Dashboard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {stats.map((s) => (
            <Card key={s.label} accent={s.color}>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
            </Card>
          ))}
        </div>
        <Card>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Registration Progress</div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </div>
          <div style={{ fontSize: 8, color: '#6366f1', marginTop: 4 }}>72% spots filled</div>
        </Card>
        <div style={{ display: 'flex', gap: 6 }}>
          {['📱','🤖','🌐','🔐'].map((e) => (
            <div key={e} style={{ flex: 1, textAlign: 'center', fontSize: 14, padding: 6,
              background: 'rgba(255,255,255,0.04)', borderRadius: 6 }}>{e}</div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

function AboutScreen() {
  return (
    <PhoneFrame accent="#8b5cf6">
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>📱</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>Mobile App Club</div>
            <div style={{ fontSize: 7, color: '#8b5cf6', letterSpacing: 1 }}>WELCOME DEVELOPERS 👋</div>
          </div>
        </div>
        <Card accent="#8b5cf6">
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>Upcoming Events</div>
          {['🏆 Hackathon 2026','🔧 App Workshop','📲 App Challenge'].map((item, i) => (
            <div key={i} style={{ fontSize: 9, color: i === 0 ? '#8b5cf6' : 'rgba(255,255,255,0.7)',
              padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: i===0?700:400 }}>
              {item}
            </div>
          ))}
        </Card>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Innovate','Build','Deploy'].map((t, i) => (
            <div key={t} style={{ flex: 1, textAlign: 'center', fontSize: 8, fontWeight: 700,
              padding: '6px 0', borderRadius: 6, background: `rgba(139,92,246,${0.1+i*0.05})`,
              color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 1 }}>{t}</div>
          ))}
        </div>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Members</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#8b5cf6' }}>200+</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
            {['🟣','🔵','🟢','🟡','🔴'].map((d,i) => (
              <span key={i} style={{ fontSize: 10 }}>{d}</span>
            ))}
          </div>
        </Card>
      </div>
    </PhoneFrame>
  );
}

function TracksScreen() {
  const tracks = [
    { icon: '📱', name: 'Mobile Dev', color: '#14b8a6' },
    { icon: '🤖', name: 'AI / ML', color: '#8b5cf6' },
    { icon: '🌐', name: 'Web', color: '#3b82f6' },
    { icon: '🔐', name: 'Security', color: '#f59e0b' },
    { icon: '🌱', name: 'Social Impact', color: '#22c55e' },
    { icon: '🚀', name: 'Open Track', color: '#ec4899' },
  ];
  return (
    <PhoneFrame accent="#14b8a6">
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#14b8a6', letterSpacing: 2, textTransform: 'uppercase' }}>
          ⚡ Challenge Tracks
        </div>
        {tracks.map((track, i) => (
          <motion.div
            key={track.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 6,
              background: `${track.color}10`,
              border: `1px solid ${track.color}25`,
            }}
          >
            <span style={{ fontSize: 13 }}>{track.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{track.name}</div>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: track.color,
              boxShadow: `0 0 6px ${track.color}` }} />
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function TimelineScreen() {
  const steps = [
    { label: 'Registration', done: true },
    { label: 'Team Formation', done: true },
    { label: 'Idea Submission', active: true },
    { label: 'Build Phase', done: false },
    { label: 'Presentation', done: false },
    { label: 'Winners', done: false },
  ];
  return (
    <PhoneFrame accent="#6366f1">
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#6366f1', letterSpacing: 2, textTransform: 'uppercase' }}>
          📅 Event Timeline
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 20 }}>
          <div style={{ position: 'absolute', left: 7, top: 4, bottom: 4, width: 1, background: 'rgba(99,102,241,0.2)' }} />
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: -17,
                width: 10, height: 10, borderRadius: '50%',
                background: step.done ? '#6366f1' : step.active ? '#a5b4fc' : 'rgba(99,102,241,0.15)',
                border: `2px solid ${step.done || step.active ? '#6366f1' : 'rgba(99,102,241,0.2)'}`,
                boxShadow: step.active ? '0 0 8px #6366f1' : 'none',
              }} />
              <span style={{
                fontSize: 9,
                color: step.done ? '#6366f1' : step.active ? '#fff' : 'rgba(255,255,255,0.3)',
                fontWeight: step.active ? 700 : 400,
              }}>
                {step.done ? '✓ ' : step.active ? '● ' : '○ '}{step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

function MembersScreen() {
  const members = [
    { role: "President", name: "THIRUKUMARAN P S", dept: "IT DEPT", icon: "👑", color: "#f59e0b" },
    { role: "Vice-President", name: "DHANYA R", dept: "CSE DEPT", icon: "🎖️", color: "#8b5cf6" },
    { role: "Secretary", name: "RAHUL J C", dept: "ECE DEPT", icon: "📝", color: "#06b6d4" },
    { role: "PR Coordinator", name: "THIVAGARAN M", dept: "MECH DEPT", icon: "📢", color: "#f43f5e" },
    { role: "Treasurer", name: "SENTHIL BALAJI S", dept: "AI&ML DEPT", icon: "💰", color: "#10b981" },
  ];
  return (
    <PhoneFrame accent="#a855f7">
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#a855f7', letterSpacing: 2, textTransform: 'uppercase' }}>
          👥 Executive Committee
        </div>
        {members.map((m, i) => (
          <motion.div
            key={m.role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 6px', borderRadius: 6,
              background: `${m.color}15`,
              border: `1px solid ${m.color}30`,
            }}
          >
            <span style={{ fontSize: 10 }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 7, fontWeight: 800, color: m.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.role}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>{m.name}</div>
            </div>
            <span style={{ fontSize: 6, fontWeight: 700, color: '#a855f7', background: 'rgba(255,255,255,0.08)', padding: '2px 4px', borderRadius: 4 }}>{m.dept}</span>
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* ── Main export ─────────────────────────────────────────── */
const SCREEN_MAP: Record<string, React.ComponentType> = {
  hero: HeroScreen,
  stats: StatsScreen,
  about: AboutScreen,
  tracks: TracksScreen,
  timeline: TimelineScreen,
  members: MembersScreen,
  register: RegisterScreen,
};

export function ScreenContent({ section }: { section: string }) {
  const Screen = SCREEN_MAP[section] ?? HeroScreen;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
