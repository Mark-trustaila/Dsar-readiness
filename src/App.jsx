import { useState, useRef } from "react";

// ─── DESIGN TOKENS (Notion-clean) ───
const T = {
  bg: "#ffffff",
  bgSub: "#f9f9f9",
  bgHover: "#f5f5f5",
  border: "#e8e8e8",
  borderLight: "#f0f0f0",
  text: "#1a1a1a",
  textSec: "#6b6b6b",
  textTer: "#9c9c9c",
  accent: "#1a1a1a",
  accentText: "#ffffff",
  green: "#16a34a",
  greenBg: "#f0fdf4",
  amber: "#d97706",
  amberBg: "#fffbeb",
  red: "#dc2626",
  redBg: "#fef2f2",
  radius: "6px",
  radiusLg: "10px",
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
};

// ─── COMPLETE 34 CONTROLS ───
const CONTROLS = [
  // ═══ GOVERNANCE (C1-C7) ═══
  { id: "C1", area: "Governance", title: "Privacy Council", audit: "A1",
    question: "Do you have a senior management group (Privacy Council or equivalent) with documented responsibility for data protection oversight?",
    help: "This means a named group of senior people who meet regularly to review data protection matters. For sole practitioners, this could be you plus an external DPO or adviser.",
    controllerOnly: true },
  { id: "C2", area: "Governance", title: "Data Protection Officer", audit: "A2",
    question: "Have you appointed a Data Protection Officer (or lead) with documented responsibilities and adequate resources?",
    help: "A DPO is mandatory if you process large-scale special category data (health, criminal records). Even if not mandatory, a named DP lead is required by LOCS:23. Firms with 1–10 staff often combine this with the COLP role." },
  { id: "C3", area: "Governance", title: "Data Protection Policy", audit: "A3",
    question: "Do you have a documented data protection policy that is reviewed at least annually and signed off by senior management?",
    help: "The policy must be accessible to all staff, cover core processing activities, and be reviewed at least yearly." },
  { id: "C4", area: "Governance", title: "Data Protection Principles", audit: "A4",
    question: "Can you demonstrate how your firm applies the seven UK GDPR data protection principles in practice?",
    help: "The seven principles: lawfulness/fairness/transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity/confidentiality, accountability." },
  { id: "C5", area: "Governance", title: "Privacy by Design", audit: "A5",
    question: "Do you have a documented process for considering data protection when implementing new systems, processes, or services?",
    help: "This means a checklist or sign-off process before launching anything new that involves personal data." },
  { id: "C6", area: "Governance", title: "Data Protection Budget", audit: "A6",
    question: "Is there a documented budget allocation for data protection activities, including training, tools, and advisory services?",
    help: "The budget should be proportionate to the firm's size and processing activities." },
  { id: "C7", area: "Governance", title: "Research & Development Policy", audit: "A7",
    question: "If you use personal data for research, testing, or development purposes, do you have a documented policy governing this?",
    help: "If you never use client data for R&D, testing, or AI training, this control may not apply. Select 'Not applicable' if so.",
    controllerOnly: true },

  // ═══ DATA SUBJECT RIGHTS (C8-C16) ═══
  { id: "C8", area: "Data Subject Rights", title: "Transparency", audit: "A8",
    question: "Do you provide clear, accessible privacy information to all individuals whose data you process?",
    help: "Privacy notices must be concise, use plain language, and be provided at the point of data collection. This includes client-facing privacy notices and employee privacy notices." },
  { id: "C9", area: "Data Subject Rights", title: "Right of Access", audit: "A9",
    question: "Do you have a documented process for handling Subject Access Requests within the statutory one-month deadline?",
    help: "You must respond within one calendar month. Extensions of up to two months are permitted for complex requests, but you must inform the individual within the first month.",
    controllerOnly: true },
  { id: "C10", area: "Data Subject Rights", title: "Right to Rectification", audit: "A10",
    question: "Do you have a process for correcting inaccurate personal data when requested by data subjects?",
    help: "You must correct inaccurate data without undue delay and inform any third parties you've shared the data with.",
    controllerOnly: true },
  { id: "C11", area: "Data Subject Rights", title: "Right to Erasure", audit: "A11",
    question: "Do you have a process for deleting personal data when requested, subject to legal retention obligations?",
    help: "The right to erasure is not absolute — you can refuse where data is needed for legal claims, regulatory obligations, or professional indemnity insurance requirements.",
    controllerOnly: true },
  { id: "C12", area: "Data Subject Rights", title: "Right to Restrict Processing", audit: "A12",
    question: "Can you restrict processing of personal data when a data subject contests its accuracy or objects to processing?",
    help: "Restriction means you can store the data but not process it further until the dispute is resolved.",
    controllerOnly: true },
  { id: "C13", area: "Data Subject Rights", title: "Right to Data Portability", audit: "A13",
    question: "Can you provide personal data in a structured, commonly used, machine-readable format when requested?",
    help: "This right only applies to data provided by the individual and processed by automated means on the basis of consent or contract.",
    controllerOnly: true },
  { id: "C14", area: "Data Subject Rights", title: "Right to Object", audit: "A14",
    question: "Do you have a process for handling objections to processing, including direct marketing?",
    help: "You must stop processing for direct marketing immediately upon objection. For other processing based on legitimate interests, you must demonstrate compelling grounds.",
    controllerOnly: true },
  { id: "C15", area: "Data Subject Rights", title: "Automated Decision-Making", audit: "A15",
    question: "If you use automated decision-making (including profiling) that has legal or significant effects, do you provide safeguards including human review?",
    help: "If you don't use automated decision-making that produces legal effects, select 'Not applicable'.",
    controllerOnly: true },
  { id: "C16", area: "Data Subject Rights", title: "Children's Data", audit: "A16",
    question: "If you process children's data, do you have appropriate safeguards including parental consent mechanisms?",
    help: "Most law firms don't routinely process children's data. If you handle family law matters involving children, this control applies.",
    controllerOnly: true },

  // ═══ OPERATIONAL PRIVACY (C17-C25) ═══
  { id: "C17", area: "Operational Privacy", title: "Privacy by Default", audit: "A17",
    question: "Are your systems and processes configured to collect only the minimum personal data necessary, with the most privacy-protective settings as default?",
    help: "This means default settings favour privacy — for example, restricting access to case files to the assigned team rather than all staff." },
  { id: "C18", area: "Operational Privacy", title: "Data Protection Impact Assessment", audit: "A18",
    question: "Do you conduct Data Protection Impact Assessments (DPIAs) before high-risk processing activities?",
    help: "DPIAs are required before processing that is likely to result in a high risk to individuals — for example, large-scale processing of special category data, or systematic monitoring." },
  { id: "C19", area: "Operational Privacy", title: "Record of Processing Activities", audit: "A19",
    question: "Do you maintain a Record of Processing Activities (ROPA) documenting all personal data processing?",
    help: "The ROPA must include: purposes, data categories, recipients, retention periods, transfers, and security measures for each processing activity." },
  { id: "C20", area: "Operational Privacy", title: "Lawful Processing", audit: "A20",
    question: "Have you identified and documented the lawful basis for each processing activity in your ROPA?",
    help: "Each processing activity needs a lawful basis: consent, contract, legal obligation, vital interests, public task, or legitimate interests. Where you rely on legitimate interests, you must have conducted a Legitimate Interests Assessment.",
    controllerOnly: true },
  { id: "C21", area: "Operational Privacy", title: "Breach Management", audit: "A21",
    question: "Do you have a documented breach management process including a breach register recording all incidents, near misses, and root cause analysis?",
    help: "The process must include: 72-hour ICO notification for reportable breaches, individual notification for high-risk breaches, and a register recording date, nature, categories of data, consequences, and mitigation measures." },
  { id: "C22", area: "Operational Privacy", title: "Rights Request Management", audit: "A22",
    question: "Do you have an operational process for receiving, logging, verifying identity, and responding to data subject rights requests?",
    help: "This is the operational implementation of rights C9–C16 — the actual process, register, team training, and verification procedures." },
  { id: "C23", area: "Operational Privacy", title: "Technical Security", audit: "A23",
    question: "Do you have documented technical security measures including: systems map, patching, backups, encryption, network security, and vulnerability scanning?",
    help: "If you hold current ISO 27001 or Cyber Essentials certification, this can serve as evidence for several sub-requirements of this control.",
    hasCertShortcut: true },
  { id: "C24", area: "Operational Privacy", title: "Organisational Security", audit: "A24",
    question: "Do you have documented organisational security measures including: role-based access, asset register, equipment disposal, and physical security?",
    help: "This covers non-technical security: who can access what, how you dispose of hardware, clear desk policy, and paper document security.",
    hasCertShortcut: true },
  { id: "C25", area: "Operational Privacy", title: "Training", audit: "A25",
    question: "Do you have a documented data protection training programme with at least annual delivery, knowledge testing (80% pass mark), and completion records?",
    help: "Training must be completed before staff access client files, delivered annually thereafter, and include role-specific modules where relevant." },

  // ═══ THIRD PARTY & DATA SHARING (C26-C32) ═══
  { id: "C26", area: "Third Party & Data Sharing", title: "Supplier Register", audit: "A26",
    question: "Do you maintain a register of all third-party suppliers who process personal data on your behalf?",
    help: "Include: data hosting providers, external counsel, barristers, translation services, transcription, financial services, off-site storage." },
  { id: "C27", area: "Third Party & Data Sharing", title: "Supplier Status", audit: "A27",
    question: "Have you determined and documented whether each third-party supplier is a Data Controller, Joint Controller, or Data Processor?",
    help: "Examples: a barrister you instruct is typically an independent controller; your case management SaaS provider is a processor; two firms jointly servicing a matter may be joint controllers." },
  { id: "C28", area: "Third Party & Data Sharing", title: "Supplier Risk Assessment", audit: "A28",
    question: "Do you conduct documented due diligence on Data Processors to ensure they maintain equivalent data protection standards?",
    help: "Due diligence should cover: processing location, DPO details, breach process, security measures, contract terms, sub-processor management, and data deletion on termination." },
  { id: "C29", area: "Third Party & Data Sharing", title: "Processor Agreements", audit: "A29",
    question: "Do you have Data Processing Agreements (DPAs) in place with all Data Processors, containing the mandatory UK GDPR Article 28 clauses?",
    help: "DPAs must include clauses on: documented instructions, confidentiality, security measures, sub-processors, rights assistance, breach reporting within 24 hours, audit rights, and data deletion/return." },
  { id: "C30", area: "Third Party & Data Sharing", title: "Controller-Controller Sharing", audit: "A30",
    question: "Where you routinely share personal data with other Data Controllers, do you have documented Data Sharing Agreements in place?",
    help: "Agreements should cover: parties involved, purpose, data items, lawful basis, and procedures for rights compliance. One-off sharing should be assessed for risk and documented.",
    controllerOnly: true },
  { id: "C31", area: "Third Party & Data Sharing", title: "Cross-Border Transfers", audit: "A31",
    question: "Where you transfer personal data outside the UK, have you conducted Transfer Risk Assessments and implemented appropriate safeguards?",
    help: "Check whether the destination country has UK adequacy status. If not, you need a Transfer Risk Assessment and appropriate safeguards such as International Data Transfer Agreements or UK Standard Contractual Clauses." },
  { id: "C32", area: "Third Party & Data Sharing", title: "Non-UK Representatives", audit: "A32",
    question: "If you are not established in the UK but process UK personal data, have you designated a UK representative?",
    help: "Most UK law firms can select 'Not applicable'. This applies to non-UK organisations processing UK personal data." },

  // ═══ MONITORING & REVIEW (C33-C34) ═══
  { id: "C33", area: "Monitoring & Review", title: "Audit Process", audit: "A33",
    question: "Do you have a documented internal audit process with a control audit schedule covering all LOCS:23 controls?",
    help: "The schedule should set audit frequency, control owner, and sign-off for each control. The annual audit report must be reviewed by senior management." },
  { id: "C34", area: "Monitoring & Review", title: "Audit Review", audit: "A34",
    question: "Do you undertake an annual data protection audit, document findings and recommendations, and update measures accordingly?",
    help: "The audit should cover six themes: accountability, privacy by design, privacy notices, storage limitation, data sharing, and security." },
];

const AREAS = ["Governance", "Data Subject Rights", "Operational Privacy", "Third Party & Data Sharing", "Monitoring & Review"];
const AREA_NUMS = { "Governance": "8.1", "Data Subject Rights": "8.2", "Operational Privacy": "8.3", "Third Party & Data Sharing": "8.4", "Monitoring & Review": "8.5" };

const ANSWER_OPTIONS = [
  { value: "yes", label: "Yes", color: T.green },
  { value: "partial", label: "Partial", color: T.amber },
  { value: "no", label: "No", color: T.red },
  { value: "na", label: "Not applicable", color: T.textTer },
];

function getVisibleControls(firmType) {
  return CONTROLS.filter(c => !(firmType === "processor" && c.controllerOnly));
}
function getAreaStats(area, answers, visible) {
  const ac = visible.filter(c => c.area === area);
  let yes=0,partial=0,no=0,na=0,unanswered=0;
  ac.forEach(c => { const a=answers[c.id]; if(a==="yes")yes++; else if(a==="partial")partial++; else if(a==="no")no++; else if(a==="na")na++; else unanswered++; });
  return { total: ac.length, yes, partial, no, na, unanswered };
}
function getScore(answers, visible) {
  let e=0,p=0;
  visible.forEach(c => { const a=answers[c.id]; if(a==="na")return; p+=2; if(a==="yes")e+=2; else if(a==="partial")e+=1; });
  return p>0 ? Math.round((e/p)*100) : 0;
}
function getScoreLabel(s) {
  if(s>=80) return { label:"Strong foundation", color:T.green, bg:T.greenBg };
  if(s>=50) return { label:"Partial compliance", color:T.amber, bg:T.amberBg };
  return { label:"Significant gaps", color:T.red, bg:T.redBg };
}

// ─── COMPONENTS ───
function Header({ subtitle, right }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <span style={{ fontSize:"15px", fontWeight:700, color:T.text, letterSpacing:"-0.01em" }}>AiLA</span>
        {subtitle && <><span style={{ color:T.border }}>/</span><span style={{ fontSize:"14px", color:T.textSec }}>{subtitle}</span></>}
      </div>
      {right && <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>{right}</div>}
    </div>
  );
}

function AreaNav({ activeArea, onSelect, answers, visible }) {
  return (
    <div style={{ width:"240px", flexShrink:0, borderRight:`1px solid ${T.border}`, padding:"20px 0", overflowY:"auto", background:T.bg }}>
      {AREAS.filter(a => visible.some(c => c.area === a)).map(area => {
        const stats = getAreaStats(area, answers, visible);
        const isActive = activeArea === area;
        const answered = stats.yes + stats.partial + stats.no + stats.na;
        return (
          <button key={area} onClick={() => onSelect(area)} style={{
            display:"block", width:"100%", textAlign:"left", padding:"10px 20px",
            background: isActive ? T.bgSub : "transparent", border:"none", cursor:"pointer",
            borderLeft: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
            transition:"all 0.15s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"13px", fontWeight: isActive ? 600 : 400, color: isActive ? T.text : T.textSec }}>
                {AREA_NUMS[area]} {area}
              </span>
              <span style={{ fontSize:"11px", color:T.textTer, fontFamily:T.mono }}>{answered}/{stats.total}</span>
            </div>
            <div style={{ marginTop:"6px", height:"2px", background:T.borderLight, borderRadius:"1px" }}>
              <div style={{
                height:"100%", borderRadius:"1px",
                width:`${Math.round((answered/stats.total)*100)}%`,
                background: stats.unanswered===0 ? T.green : T.textTer,
                transition:"width 0.4s ease",
              }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function QuestionCard({ control, answer, onAnswer, expanded, onToggle }) {
  return (
    <div style={{ padding:"16px 0", borderBottom:`1px solid ${T.borderLight}` }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"8px" }}>
        <span style={{ fontSize:"11px", fontFamily:T.mono, color:T.textTer, background:T.bgSub, padding:"2px 6px", borderRadius:"3px", flexShrink:0, marginTop:"2px" }}>{control.id}</span>
        <div style={{ flex:1, fontSize:"14px", fontWeight:500, color:T.text, lineHeight:1.5 }}>{control.question}</div>
      </div>
      <div style={{ paddingLeft:"42px" }}>
        <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"12px", color:T.textTer, padding:"2px 0", display:"flex", alignItems:"center", gap:"4px" }}>
          <span style={{ fontSize:"10px" }}>{expanded ? "▾" : "▸"}</span>
          {expanded ? "Hide guidance" : "What does this mean?"}
        </button>
        {expanded && (
          <div style={{ fontSize:"13px", color:T.textSec, lineHeight:1.6, padding:"8px 12px", margin:"6px 0 10px", background:T.bgSub, borderRadius:T.radius, borderLeft:`2px solid ${T.border}` }}>
            {control.help}
            {control.hasCertShortcut && <div style={{ marginTop:"8px", fontStyle:"italic", color:T.textTer }}>ISO 27001 or Cyber Essentials certification can serve as evidence for parts of this control.</div>}
          </div>
        )}
        <div style={{ display:"flex", gap:"6px", marginTop:"8px" }}>
          {ANSWER_OPTIONS.map(opt => {
            const sel = answer === opt.value;
            return (
              <button key={opt.value} onClick={() => onAnswer(control.id, opt.value)} style={{
                padding:"5px 14px", fontSize:"12px", fontWeight: sel ? 600 : 400,
                background: sel ? (opt.color+"12") : "transparent",
                color: sel ? opt.color : T.textSec,
                border:`1px solid ${sel ? opt.color+"40" : T.border}`,
                borderRadius:"100px", cursor:"pointer", transition:"all 0.15s",
              }}>{opt.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SCREENS ───
function IntakeScreen({ onStart }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("controller");
  const [size, setSize] = useState("");
  const [hasCert, setHasCert] = useState(false);
  const ready = name.trim() && size;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.font }}>
      <Header subtitle="LOCS:23 Readiness Assessment" />
      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"48px 24px 120px" }}>
        <h1 style={{ fontSize:"24px", fontWeight:600, color:T.text, marginBottom:"8px", letterSpacing:"-0.02em", lineHeight:1.3 }}>
          How ready is your firm for LOCS:23?
        </h1>
        <p style={{ fontSize:"14px", color:T.textSec, lineHeight:1.6, marginBottom:"36px" }}>
          34 controls across five areas. Takes 15–20 minutes. You'll see which controls you meet, which have gaps, and where to focus. This covers the complete standard.
        </p>

        <div style={{ marginBottom:"24px" }}>
          <label style={{ display:"block", fontSize:"12px", fontWeight:500, color:T.textSec, marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.04em" }}>Firm name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Smith & Partners LLP"
            style={{ width:"100%", padding:"10px 12px", fontSize:"14px", border:`1px solid ${T.border}`, borderRadius:T.radius, background:T.bg, color:T.text, outline:"none", boxSizing:"border-box" }} />
        </div>

        <div style={{ marginBottom:"24px" }}>
          <label style={{ display:"block", fontSize:"12px", fontWeight:500, color:T.textSec, marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.04em" }}>Your firm's role</label>
          <p style={{ fontSize:"12px", color:T.textTer, marginBottom:"8px", marginTop:0 }}>Most law firms are Data Controllers.</p>
          <div style={{ display:"flex", gap:"8px" }}>
            {[{ v:"controller", l:"Data Controller", d:"You determine why and how data is processed" }, { v:"processor", l:"Data Processor", d:"You process data on behalf of a controller" }].map(o => (
              <button key={o.v} onClick={()=>setType(o.v)} style={{ flex:1, textAlign:"left", padding:"12px 14px", background: type===o.v ? T.bgSub : T.bg, border:`1px solid ${type===o.v ? T.accent : T.border}`, borderRadius:T.radius, cursor:"pointer" }}>
                <div style={{ fontSize:"13px", fontWeight: type===o.v ? 600 : 400, color:T.text }}>{o.l}</div>
                <div style={{ fontSize:"11px", color:T.textTer, marginTop:"2px" }}>{o.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"24px" }}>
          <label style={{ display:"block", fontSize:"12px", fontWeight:500, color:T.textSec, marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.04em" }}>Number of employees</label>
          <div style={{ display:"flex", gap:"6px" }}>
            {["1-10","11-50","51-250","250+"].map(s => (
              <button key={s} onClick={()=>setSize(s)} style={{ padding:"8px 16px", fontSize:"13px", fontWeight: size===s ? 600 : 400, background: size===s ? T.bgSub : T.bg, border:`1px solid ${size===s ? T.accent : T.border}`, borderRadius:T.radius, cursor:"pointer", color:T.text }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"32px" }}>
          <label style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", fontSize:"13px", color:T.textSec }}>
            <input type="checkbox" checked={hasCert} onChange={e=>setHasCert(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:T.accent }} />
            We hold current ISO 27001 or Cyber Essentials certification
          </label>
          {hasCert && <p style={{ fontSize:"12px", color:T.green, margin:"6px 0 0 24px" }}>Noted as supporting evidence for technical and organisational security controls.</p>}
        </div>

        {type === "processor" && (
          <div style={{ padding:"12px 14px", background:T.bgSub, borderRadius:T.radius, marginBottom:"24px", borderLeft:`2px solid ${T.textTer}` }}>
            <p style={{ fontSize:"12px", color:T.textSec, margin:0, lineHeight:1.5 }}>
              As a Data Processor, approximately 17 of the 34 controls fully apply, with 8 partially applying. You'll see a reduced question set.
            </p>
          </div>
        )}

        <button onClick={()=>ready && onStart({ name, type, size, hasCert })} disabled={!ready}
          style={{ padding:"10px 24px", fontSize:"14px", fontWeight:600, background: ready ? T.accent : T.border, color: ready ? T.accentText : T.textTer, border:"none", borderRadius:T.radius, cursor: ready ? "pointer" : "default", transition:"all 0.15s", width:"100%" }}>
          Start assessment →
        </button>

        <p style={{ fontSize:"11px", color:T.textTer, textAlign:"center", marginTop:"24px", lineHeight:1.5 }}>
          Based on LOCS:23 Certification Standard v12.3 (© 2twenty4 Consulting Ltd). This tool helps assess readiness — actual certification requires an ADISA audit.
        </p>
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 24px", borderTop:`1px solid ${T.borderLight}`, background:T.bg, display:"flex", justifyContent:"center", alignItems:"center", gap:"8px" }}>
        <span style={{ fontSize:"11px", color:T.textTer }}>Powered by</span>
        <a href="https://trustaila.com" target="_blank" rel="noopener" style={{ fontSize:"11px", fontWeight:600, color:T.textSec, textDecoration:"none" }}>AiLA</a>
        <span style={{ fontSize:"11px", color:T.textTer }}>— AI automation of routine legal and compliance tasks</span>
      </div>
    </div>
  );
}

function QuestionnaireScreen({ firm, onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [activeArea, setActiveArea] = useState(AREAS[0]);
  const [expandedControl, setExpandedControl] = useState(null);
  const mainRef = useRef(null);

  const visible = getVisibleControls(firm.type);
  const areaControls = visible.filter(c => c.area === activeArea);
  const totalAnswered = visible.filter(c => !!answers[c.id]).length;
  const areaIdx = AREAS.indexOf(activeArea);
  const visibleAreas = AREAS.filter(a => visible.some(c => c.area === a));
  const isLast = activeArea === visibleAreas[visibleAreas.length - 1];

  const handleAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: prev[id]===value ? undefined : value }));
  const navigate = (dir) => {
    const areas = visibleAreas;
    const idx = areas.indexOf(activeArea);
    const next = idx + dir;
    if (next >= 0 && next < areas.length) { setActiveArea(areas[next]); setExpandedControl(null); if(mainRef.current) mainRef.current.scrollTop=0; }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.font, display:"flex", flexDirection:"column" }}>
      <Header subtitle={`LOCS:23 · ${firm.name}`} right={
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ fontSize:"12px", color:T.textTer, fontFamily:T.mono }}>{totalAnswered}/{visible.length}</span>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", color:T.textSec, padding:"4px 8px" }}>← Restart</button>
        </div>
      } />

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <AreaNav activeArea={activeArea} onSelect={a=>{ setActiveArea(a); setExpandedControl(null); if(mainRef.current) mainRef.current.scrollTop=0; }} answers={answers} visible={visible} />

        <div ref={mainRef} style={{ flex:1, overflowY:"auto", padding:"24px 32px" }}>
          <div style={{ maxWidth:"640px" }}>
            <div style={{ marginBottom:"8px" }}>
              <h2 style={{ fontSize:"18px", fontWeight:600, color:T.text, margin:0, letterSpacing:"-0.01em" }}>{AREA_NUMS[activeArea]} {activeArea}</h2>
              <p style={{ fontSize:"13px", color:T.textTer, margin:"4px 0 0" }}>{areaControls.length} control{areaControls.length!==1?"s":""}</p>
            </div>

            {areaControls.map(c => (
              <QuestionCard key={c.id} control={c} answer={answers[c.id]} onAnswer={handleAnswer}
                expanded={expandedControl===c.id} onToggle={()=>setExpandedControl(expandedControl===c.id ? null : c.id)} />
            ))}

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 0", marginTop:"8px" }}>
              {visibleAreas.indexOf(activeArea) > 0 ? (
                <button onClick={()=>navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", color:T.textSec, padding:"6px 0" }}>
                  ← {visibleAreas[visibleAreas.indexOf(activeArea)-1]}
                </button>
              ) : <div />}

              {isLast ? (
                <button onClick={()=>onComplete(answers)} style={{
                  padding:"8px 20px", fontSize:"13px", fontWeight:600,
                  background: totalAnswered===visible.length ? T.accent : T.bgSub,
                  color: totalAnswered===visible.length ? T.accentText : T.textSec,
                  border: totalAnswered===visible.length ? "none" : `1px solid ${T.border}`,
                  borderRadius:T.radius, cursor:"pointer",
                }}>
                  {totalAnswered===visible.length ? "See results" : `See results (${visible.length-totalAnswered} unanswered)`}
                </button>
              ) : (
                <button onClick={()=>navigate(1)} style={{ padding:"8px 20px", fontSize:"13px", fontWeight:600, background:T.accent, color:T.accentText, border:"none", borderRadius:T.radius, cursor:"pointer" }}>
                  {visibleAreas[visibleAreas.indexOf(activeArea)+1]} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ firm, answers, onBack }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const visible = getVisibleControls(firm.type);
  const score = getScore(answers, visible);
  const scoreInfo = getScoreLabel(score);
  const noGaps = visible.filter(c => answers[c.id]==="no");
  const partialGaps = visible.filter(c => answers[c.id]==="partial");
  const gaps = [...noGaps, ...partialGaps];
  const gapsByArea = {};
  gaps.forEach(c => { if(!gapsByArea[c.area]) gapsByArea[c.area]=[]; gapsByArea[c.area].push(c); });

  const handleSubmit = async () => {
    const blocked = ["gmail.com","yahoo.com","hotmail.com","outlook.com","aol.com","icloud.com","protonmail.com","mail.com","live.com","msn.com"];
    const domain = email.split("@")[1]?.toLowerCase();
    if(blocked.includes(domain)) { setError("Please use your firm email address"); return; }
    setSubmitting(true); setError("");
    try {
      const resp = await fetch("https://formspree.io/f/mjgerjao", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, firmName:firm.name, firmType:firm.type, firmSize:firm.size, score, totalControls:visible.length,
          gapCount:noGaps.length, partialCount:partialGaps.length,
          gaps:noGaps.map(c=>`${c.id}: ${c.title}`).join(", "),
          partials:partialGaps.map(c=>`${c.id}: ${c.title}`).join(", "),
        }),
      });
      if(resp.ok) setSubmitted(true); else setError("Submission failed. Try again.");
    } catch { setError("Network error. Try again."); }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.font }}>
      <Header subtitle={`Results · ${firm.name}`} right={
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", color:T.textSec }}>← Back to questions</button>
      } />

      <div style={{ maxWidth:"640px", margin:"0 auto", padding:"36px 24px" }}>
        {/* Score */}
        <div style={{ padding:"20px 24px", borderRadius:T.radiusLg, background:scoreInfo.bg, border:`1px solid ${scoreInfo.color}20`, marginBottom:"32px" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:"12px", marginBottom:"4px" }}>
            <span style={{ fontSize:"36px", fontWeight:700, color:scoreInfo.color, letterSpacing:"-0.02em" }}>{score}%</span>
            <span style={{ fontSize:"15px", fontWeight:500, color:scoreInfo.color }}>{scoreInfo.label}</span>
          </div>
          <p style={{ fontSize:"13px", color:T.textSec, margin:0, lineHeight:1.5 }}>
            {visible.filter(c=>answers[c.id]==="yes").length} controls met · {partialGaps.length} partially met · {noGaps.length} gaps · {visible.filter(c=>answers[c.id]==="na").length} not applicable
            {visible.filter(c=>!answers[c.id]).length > 0 && ` · ${visible.filter(c=>!answers[c.id]).length} unanswered`}
          </p>
        </div>

        {/* Gaps */}
        {gaps.length > 0 && (
          <div style={{ marginBottom:"32px" }}>
            <h3 style={{ fontSize:"16px", fontWeight:600, color:T.text, marginBottom:"16px" }}>Gaps identified</h3>
            {Object.entries(gapsByArea).map(([area, controls]) => (
              <div key={area} style={{ marginBottom:"16px" }}>
                <div style={{ fontSize:"12px", fontWeight:500, color:T.textTer, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"8px" }}>{AREA_NUMS[area]} {area}</div>
                {controls.map(c => (
                  <div key={c.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 0", borderBottom:`1px solid ${T.borderLight}` }}>
                    <span style={{ fontSize:"10px", fontFamily:T.mono, color:T.textTer, background:T.bgSub, padding:"2px 5px", borderRadius:"3px" }}>{c.id}</span>
                    <span style={{ fontSize:"13px", color:T.text, flex:1 }}>{c.title}</span>
                    <span style={{ fontSize:"11px", fontWeight:500, color: answers[c.id]==="no" ? T.red : T.amber }}>{answers[c.id]==="no" ? "Gap" : "Partial"}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {gaps.length === 0 && (
          <div style={{ padding:"20px", background:T.greenBg, borderRadius:T.radiusLg, marginBottom:"32px", textAlign:"center" }}>
            <p style={{ fontSize:"14px", color:T.green, fontWeight:500, margin:0 }}>No gaps identified. Your firm appears well-positioned for LOCS:23 certification.</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ padding:"24px", background:T.bgSub, borderRadius:T.radiusLg, border:`1px solid ${T.border}`, marginBottom:"24px" }}>
          {!submitted ? (<>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:T.text, margin:"0 0 6px" }}>Get your detailed action plan</h3>
            <p style={{ fontSize:"13px", color:T.textSec, margin:"0 0 16px", lineHeight:1.5 }}>
              Receive a prioritised remediation plan with specific steps for each gap, estimated effort, and guidance on achieving LOCS:23 certification.
            </p>
            <div style={{ display:"flex", gap:"8px" }}>
              <input type="email" value={email} onChange={e=>{ setEmail(e.target.value); setError(""); }} placeholder="you@yourfirm.co.uk"
                style={{ flex:1, padding:"8px 12px", fontSize:"13px", border:`1px solid ${error ? T.red : T.border}`, borderRadius:T.radius, background:T.bg, color:T.text, outline:"none", boxSizing:"border-box" }} />
              <button onClick={handleSubmit} disabled={!email.includes("@")||submitting}
                style={{ padding:"8px 20px", fontSize:"13px", fontWeight:600, background: email.includes("@") ? T.accent : T.border, color: email.includes("@") ? T.accentText : T.textTer, border:"none", borderRadius:T.radius, cursor: email.includes("@") ? "pointer" : "default" }}>
                {submitting ? "Sending..." : "Request plan"}
              </button>
            </div>
            {error && <p style={{ fontSize:"12px", color:T.red, margin:"6px 0 0" }}>{error}</p>}
          </>) : (
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"14px", color:T.green, fontWeight:500, margin:"0 0 4px" }}>✓ Request received</p>
              <p style={{ fontSize:"13px", color:T.textSec, margin:0 }}>We'll send your detailed action plan within 48 hours.</p>
            </div>
          )}
        </div>

        {/* Area breakdown */}
        <div style={{ marginBottom:"32px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:600, color:T.text, marginBottom:"16px" }}>Breakdown by area</h3>
          {AREAS.filter(a=>visible.some(c=>c.area===a)).map(area => {
            const stats = getAreaStats(area, answers, visible);
            const scorable = stats.total - stats.na;
            const pct = scorable>0 ? Math.round(((stats.yes*2+stats.partial)/(scorable*2))*100) : 100;
            return (
              <div key={area} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 0", borderBottom:`1px solid ${T.borderLight}` }}>
                <span style={{ fontSize:"13px", color:T.text, flex:1 }}>{AREA_NUMS[area]} {area}</span>
                <div style={{ width:"120px", height:"4px", background:T.borderLight, borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:"2px", width:`${pct}%`, background: pct>=80?T.green:pct>=50?T.amber:T.red, transition:"width 0.4s ease" }} />
                </div>
                <span style={{ fontSize:"12px", fontFamily:T.mono, width:"36px", textAlign:"right", color: pct>=80?T.green:pct>=50?T.amber:T.red }}>{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* Attribution */}
        <div style={{ padding:"16px", background:T.bgSub, borderRadius:T.radius, marginBottom:"24px" }}>
          <p style={{ fontSize:"12px", color:T.textTer, margin:0, lineHeight:1.6 }}>
            Based on LOCS:23 Certification Standard v12.3 (© 2twenty4 Consulting Ltd). This tool assesses readiness — actual certification requires an ADISA audit.{" "}
            <a href="https://locs23.com" target="_blank" rel="noopener" style={{ color:T.textSec }}>locs23.com</a>
          </p>
        </div>

        <div style={{ padding:"16px", textAlign:"center", borderTop:`1px solid ${T.borderLight}` }}>
          <p style={{ fontSize:"11px", color:T.textTer, margin:0 }}>
            Powered by <a href="https://trustaila.com" target="_blank" rel="noopener" style={{ fontWeight:600, color:T.textSec, textDecoration:"none" }}>AiLA</a> — AI automation of routine legal and compliance tasks
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ───
export default function LOCS23Assessment() {
  const [screen, setScreen] = useState("intake");
  const [firm, setFirm] = useState(null);
  const [finalAnswers, setFinalAnswers] = useState(null);

  if (screen === "intake") return <IntakeScreen onStart={f => { setFirm(f); setScreen("questions"); }} />;
  if (screen === "questions") return <QuestionnaireScreen firm={firm} onComplete={a => { setFinalAnswers(a); setScreen("results"); }} onBack={() => setScreen("intake")} />;
  if (screen === "results") return <ResultsScreen firm={firm} answers={finalAnswers} onBack={() => setScreen("questions")} />;
}
