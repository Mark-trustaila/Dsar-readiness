import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   DSAR Readiness Assessment — AiLA
   Notion-style: Source Serif 4 headings, system fonts body,
   #37352f primary, #e8e5e0 borders, 680px max-width
   ───────────────────────────────────────────── */

// ── Section metadata ──
const SECTIONS = [
  { id: "governance", label: "Governance & Preparation", icon: "§1" },
  { id: "recognition", label: "Request Recognition & Intake", icon: "§2" },
  { id: "discovery", label: "Data Discovery & Search", icon: "§3" },
  { id: "response", label: "Response Management", icon: "§4" },
  { id: "redaction", label: "Redaction & Exemptions", icon: "§5" },
  { id: "delivery", label: "Delivery & Compliance", icon: "§6" },
  { id: "volume", label: "Volume & Scalability", icon: "§7" },
];

// ── Answer options ──
const OPTIONS = [
  { value: "yes", label: "Yes, fully in place", score: 3, color: "#22c55e" },
  { value: "partial", label: "Partially in place", score: 2, color: "#f59e0b" },
  { value: "no", label: "No / not started", score: 1, color: "#ef4444" },
  { value: "na", label: "Not applicable", score: null, color: "#9b9a97" },
];

// ── Questions ──
const QUESTIONS = {
  governance: [
    {
      id: "gov-1",
      question: "Do you have a documented DSAR policy that sets out how your organisation handles subject access requests?",
      help: "The ICO expects organisations to have a clear, written policy covering how DSARs are received, logged, escalated and responded to. This should be accessible to all staff who might receive a request.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: 'How can we prepare for a SAR?'",
    },
    {
      id: "gov-2",
      question: "Have you appointed a specific person or central team responsible for handling DSARs?",
      help: "The ICO states that organisations should appoint a specific person or central team responsible for responding to requests, with contingency if someone is absent. Without clear ownership, requests fall through the cracks.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: Preparation",
    },
    {
      id: "gov-3",
      question: "Do all staff who interact with the public or handle personal data receive training on recognising and escalating DSARs?",
      help: "A DSAR does not need to mention 'subject access request', 'GDPR', or 'Article 15'. Staff must recognise informal requests like 'can you tell me what information you hold on me?' as valid DSARs. The ICO has reprimanded organisations where front-line staff failed to identify requests.",
      weight: 3,
      icoRef: "ICO SAR Q&A for Employers (May 2023)",
    },
    {
      id: "gov-4",
      question: "Do you maintain a log of all DSARs received, tracking status, deadlines, and outcomes?",
      help: "In December 2024 the ICO reprimanded an NHS Trust for failing to respond to 32% of DSARs on time, citing inadequate logging systems as a root cause. A SAR log should record: date received, deadline, current status, who is handling it, what was disclosed, and any exemptions applied.",
      weight: 3,
      icoRef: "ICO enforcement: NHS Trust reprimand (Dec 2024)",
    },
    {
      id: "gov-5",
      question: "Do you have documented retention and deletion policies for personal data across your systems?",
      help: "Retention policies directly affect DSAR responses — you cannot disclose data you should have deleted, and you cannot claim data doesn't exist if your retention schedule required you to keep it. The ICO expects documented retention policies as part of DSAR preparedness.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Preparation",
    },
    {
      id: "gov-6",
      question: "Does your senior leadership receive regular reporting on DSAR volumes, response times, and compliance rates?",
      help: "Organisations that were reprimanded by the ICO for DSAR backlogs typically had no management visibility of the problem until it became a crisis. Regular reporting to leadership on DSAR metrics is a governance essential.",
      weight: 2,
      icoRef: "ICO Lessons Learned from Reprimands (2024)",
    },
  ],
  recognition: [
    {
      id: "rec-1",
      question: "Can your organisation identify a DSAR regardless of how it arrives — email, letter, phone call, social media, or verbally in person?",
      help: "DSARs are valid regardless of the channel used. An individual does not need to use a specific form, mention legislation, or direct the request to a particular person. The ICO has confirmed that requests via social media, voicemail, and even casual conversations can constitute valid DSARs.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: 'How do we recognise a SAR?'",
    },
    {
      id: "rec-2",
      question: "Do you have a process for recording DSARs that are made verbally (in person or by telephone)?",
      help: "The ICO checklist specifically requires a policy for recording verbal requests. If someone asks 'what information do you hold on me?' during a phone call, that is a valid DSAR and the clock starts immediately.",
      weight: 2,
      icoRef: "ICO SAR checklist",
    },
    {
      id: "rec-3",
      question: "Can you handle DSARs made by third parties on behalf of the data subject (e.g. solicitors, relatives, union representatives)?",
      help: "Third-party DSARs are valid. You need a process to verify that the third party has authority to act on behalf of the data subject, without using this as a reason to delay the response. The ICO guidance is clear that you cannot refuse simply because a third party made the request.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Third-party requests",
    },
    {
      id: "rec-4",
      question: "Do you have a proportionate identity verification process that does not create unnecessary barriers to access?",
      help: "You may verify identity where you have reasonable doubts, but the ICO warns against using ID verification as a delaying tactic. You should not demand excessive documentation — particularly from existing customers or employees whose identity you already know.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Identity verification",
    },
    {
      id: "rec-5",
      question: "Do you make a DSAR submission form available while making clear that using it is optional?",
      help: "The ICO permits organisations to offer a standard form to help requesters specify what they want, but you cannot insist on its use. A request is valid regardless of format. Making a form available can help manage requests efficiently, but refusing requests that do not use the form is non-compliant.",
      weight: 1,
      icoRef: "ICO Right of Access guidance: Preparation",
    },
  ],
  discovery: [
    {
      id: "dis-1",
      question: "Do you maintain an information asset register or data map showing where personal data is stored across your organisation?",
      help: "The ICO expects organisations to maintain information asset registers showing where and how personal data is stored. Without this, you cannot conduct a reasonable search in response to a DSAR. This is the single biggest operational barrier to DSAR compliance.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: Preparation; ICO NHS Trust reprimand citing incomplete RoPA",
    },
    {
      id: "dis-2",
      question: "Can you search for personal data across your email systems (including archived mailboxes and shared inboxes)?",
      help: "Email is typically the largest source of personal data in a DSAR response. The ICO's guidance confirms that retrieving electronic data includes recovering archived information and back-up records. Organisations that cannot efficiently search across email systems consistently miss deadlines.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: 'How do we find and retrieve the relevant information?'",
    },
    {
      id: "dis-3",
      question: "Can you search for personal data in your HR systems, including employment records, appraisals, disciplinary files, and grievance records?",
      help: "Employment-related DSARs are the most common type the ICO sees. The employer SAR Q&A (2023) specifically addresses searching HR files, appraisal records, and disciplinary documentation. Many organisations fail because HR data is spread across multiple systems with no unified search.",
      weight: 3,
      icoRef: "ICO SAR Q&A for Employers (May 2023)",
    },
    {
      id: "dis-4",
      question: "Can you search for personal data in your CRM, case management, and customer service systems?",
      help: "Customer-facing organisations must be able to locate data across all systems where customer interactions are recorded. This includes CRM platforms, ticketing systems, complaint logs, and customer service records.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Search and retrieval",
    },
    {
      id: "dis-5",
      question: "Can you search for personal data held in file shares, cloud storage (SharePoint, OneDrive, Google Drive), and document management systems?",
      help: "Unstructured data in file shares is frequently missed in DSAR searches. The ICO expects you to search all locations where personal data is reasonably likely to be found, including shared drives and cloud storage platforms.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Search and retrieval",
    },
    {
      id: "dis-6",
      question: "Can you locate and retrieve personal data from databases, line-of-business applications, and back-office systems?",
      help: "Personal data in structured databases (finance systems, billing platforms, operational databases) must be searchable. The challenge is often that these systems were not designed with data subject access in mind, making extraction difficult.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Search and retrieval",
    },
    {
      id: "dis-7",
      question: "Can you search for CCTV footage and other surveillance data relating to a specific individual?",
      help: "The ICO employer Q&A confirms that workers who request footage containing their personal data have a right to receive it. Your CCTV system should allow you to locate, extract, and redact footage. If it does not have this functionality, you must still endeavour to comply.",
      weight: 2,
      icoRef: "ICO SAR Q&A for Employers: CCTV",
    },
    {
      id: "dis-8",
      question: "Do you understand the new 'reasonable and proportionate search' standard introduced by the Data (Use and Access) Act 2025?",
      help: "The DUA Act 2025 codified the principle that you only need to carry out a reasonable and proportionate search. Volume of data, complexity of systems, and cost of retrieval are now explicitly relevant factors. This does not reduce the obligation — it clarifies the standard. Organisations should document their search methodology to demonstrate reasonableness.",
      weight: 2,
      icoRef: "ICO Right of Access guidance (updated Dec 2025 for DUA Act)",
    },
  ],
  response: [
    {
      id: "res-1",
      question: "Do you have a system to track the one-month statutory deadline for each DSAR from the date of receipt?",
      help: "The one-month clock starts on the day of receipt, not when the request is logged or acknowledged. The ICO's enforcement actions consistently cite missed deadlines as a primary failure — Southampton NHS Trust responded to only 59% on time, Lewisham Council managed just 35%.",
      weight: 3,
      icoRef: "ICO enforcement actions 2022–2024",
    },
    {
      id: "res-2",
      question: "Do you have a process for seeking clarification from the requester, and do you understand when the clock can be paused?",
      help: "Under the DUA Act 2025 changes, the time limit for responding is now explicitly paused while you wait for the data subject to clarify their request. This is a significant change — previously the position was less clear. You should document when clarification was sought and when the response was received.",
      weight: 3,
      icoRef: "ICO Right of Access guidance (updated Dec 2025)",
    },
    {
      id: "res-3",
      question: "Do you have clear criteria for determining when a request is complex enough to justify extending the deadline by up to two further months?",
      help: "Extension is permitted for complex requests or where you receive multiple requests from the same individual. You must inform the requester within one month of receipt, explaining why the extension is necessary. The ICO expects this to be used genuinely, not as a default delay tactic.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Responding to requests",
    },
    {
      id: "res-4",
      question: "Do you send an acknowledgement to the requester confirming receipt of their DSAR?",
      help: "While not a strict legal requirement, acknowledging receipt is considered good practice by the ICO. It manages expectations, confirms the deadline, and provides an opportunity to seek clarification if needed. Failure to acknowledge is a common complaint to the ICO.",
      weight: 1,
      icoRef: "ICO Right of Access guidance: Good practice",
    },
    {
      id: "res-5",
      question: "Do you have templates or standard processes for DSAR responses that ensure all required supplementary information is included?",
      help: "A DSAR response must include not just the personal data but also supplementary information: purposes of processing, categories of data, recipients or categories of recipients, retention periods, the right to complain, the source of the data, and information about automated decision-making. Incomplete responses are a common ICO finding.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Article 15 requirements",
    },
  ],
  redaction: [
    {
      id: "red-1",
      question: "Do you have a process for identifying and redacting third-party personal data from DSAR responses?",
      help: "Most DSAR responses contain information about other people — colleagues mentioned in emails, other customers in shared records. You must balance the requester's right of access against the third party's rights and freedoms. The ICO expects a documented process for making these balancing decisions.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: 'Exemptions: information about other people'",
    },
    {
      id: "red-2",
      question: "Can you identify and correctly apply the exemptions in the Data Protection Act 2018 (legal privilege, management forecasts, negotiations, confidential references, etc.)?",
      help: "Schedule 2 of the DPA 2018 contains exemptions that may apply to specific categories of data within a DSAR response. Common ones include: legal professional privilege, management forecasts, records of intentions in negotiations, and confidential references given by your organisation. Applying these incorrectly — either over-redacting or under-redacting — creates risk.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: 'When can we refuse a SAR?'",
    },
    {
      id: "red-3",
      question: "Do you have clear criteria for determining whether a request is manifestly unfounded or manifestly excessive?",
      help: "This is a high bar. The ICO has clarified that 'manifestly unfounded' means clearly or obviously made for a purpose other than exercising the right of access — for example, to harass. 'Manifestly excessive' considers the volume and frequency of requests. You bear the burden of proving this, so document your reasoning carefully.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: 'Manifestly unfounded or excessive'",
    },
    {
      id: "red-4",
      question: "Do you have a process for handling DSARs that involve whistleblowing, grievance, or disciplinary information?",
      help: "Employment DSARs often involve sensitive internal processes. The ICO employer Q&A addresses whistleblower scenarios — you must balance access rights against protections under the Public Interest Disclosure Act 1998. Similarly, disciplinary and grievance records require careful handling of management opinions and third-party statements.",
      weight: 2,
      icoRef: "ICO SAR Q&A for Employers: Whistleblowing scenario",
    },
    {
      id: "red-5",
      question: "When redacting, do you use appropriate tools rather than methods that can be reversed (e.g. black highlighting in Word that can be removed)?",
      help: "Ineffective redaction is a data breach. Using Word formatting, PDF annotations that can be removed, or simple black highlighting risks disclosing the very information you intended to protect. Proper redaction tools permanently remove content from the document.",
      weight: 2,
      icoRef: "ICO data breach guidance",
    },
    {
      id: "red-6",
      question: "Do you provide recipients with specific named recipients of their data (not just 'categories of recipients') in your DSAR response?",
      help: "Recent case law (Harrison v Cameron, ACL) has clarified that controllers should name specific recipients where possible. The ICO updated guidance now states that providing only categories is permitted only where naming specific recipients would be impossible or the request is manifestly unfounded or excessive. This is a significant tightening.",
      weight: 2,
      icoRef: "ICO Right of Access guidance (updated Dec 2025); Harrison v Cameron",
    },
  ],
  delivery: [
    {
      id: "del-1",
      question: "Can you deliver DSAR responses securely, using encryption or a secure portal rather than unencrypted email?",
      help: "You are responsible for ensuring the security of the personal data you disclose. Sending a DSAR response containing sensitive personal data via unencrypted email is itself a potential data breach. The ICO expects appropriate security measures for disclosure.",
      weight: 3,
      icoRef: "ICO Right of Access guidance: 'How can we supply information to the requester?'",
    },
    {
      id: "del-2",
      question: "Do you provide DSAR responses in a commonly used electronic format when the request was made electronically?",
      help: "If the request is made electronically, the response should be provided in a commonly used electronic format unless the individual requests otherwise. You should consider whether the requester can actually access the format you provide — sending a .pst file to a consumer is not helpful.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Format of response",
    },
    {
      id: "del-3",
      question: "Do you include all required supplementary information in your DSAR response (purposes, recipients, retention periods, rights, source of data, automated decision-making)?",
      help: "Article 15(1) and (2) UK GDPR require you to provide comprehensive supplementary information alongside the personal data itself. Many organisations focus on gathering the data but forget to include the supplementary information, which is a compliance failure.",
      weight: 2,
      icoRef: "Article 15 UK GDPR",
    },
    {
      id: "del-4",
      question: "When refusing a DSAR (in whole or part), do you inform the requester of their right to complain to the ICO and to seek a judicial remedy?",
      help: "If you refuse any part of a DSAR or apply exemptions, you must tell the requester: the reasons for refusal, their right to complain to the ICO, and their right to seek a court order. Failure to provide this information is itself a breach, even if the refusal was justified.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Refusal requirements",
    },
    {
      id: "del-5",
      question: "Do you keep records of what was disclosed, what was withheld, and the reasons for any redactions or exemptions applied?",
      help: "If the ICO investigates a complaint about your DSAR response, you will need to demonstrate what you searched, what you found, what you disclosed, what you withheld and why. Without contemporaneous records, you cannot defend your decisions.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Preparation (SAR logs)",
    },
  ],
  volume: [
    {
      id: "vol-1",
      question: "Do you know how many DSARs your organisation received in the last 12 months?",
      help: "If you cannot answer this question, you almost certainly have a logging gap. Organisations reprimanded by the ICO commonly lacked basic visibility of their DSAR volumes. Knowing your numbers is the foundation for capacity planning.",
      weight: 3,
      icoRef: "ICO enforcement: systemic DSAR failures",
    },
    {
      id: "vol-2",
      question: "What percentage of your DSARs are responded to within the one-month statutory deadline?",
      help: "The ICO has reprimanded organisations with on-time rates of 35% (Lewisham Council), 59% (Southampton NHS Trust), and 68% (an NHS Trust in 2024). If your on-time rate is below 90%, you have a systemic problem that requires process and technology intervention.",
      weight: 3,
      icoRef: "ICO enforcement actions 2022–2024",
    },
    {
      id: "vol-3",
      question: "Do you have a current backlog of unanswered DSARs?",
      help: "A backlog is the strongest signal of systemic failure. The ICO's 2022 crackdown targeted organisations with backlogs of hundreds or thousands of unanswered DSARs, including the Ministry of Defence and Home Office. If you have a backlog, you need a clearance plan and process redesign.",
      weight: 3,
      icoRef: "ICO DSAR enforcement crackdown (2022)",
    },
    {
      id: "vol-4",
      question: "Do you use any technology to assist with DSAR processing (e.g. automated search, PII identification, redaction tools)?",
      help: "Manual DSAR processing does not scale. Organisations handling more than a handful of DSARs per month need technology support for data discovery, PII identification, and redaction. The cost of manual processing typically exceeds the cost of automation within the first year.",
      weight: 2,
      icoRef: "General best practice",
    },
    {
      id: "vol-5",
      question: "Can you estimate the average staff hours spent per DSAR response?",
      help: "Understanding your cost per DSAR is essential for making the business case for improvement. The ICO acknowledges that staff time is a legitimate cost consideration. Typical manual DSAR responses in complex organisations take 20-40 hours — technology-assisted responses can reduce this to 2-8 hours.",
      weight: 2,
      icoRef: "ICO Right of Access guidance: Cost considerations",
    },
    {
      id: "vol-6",
      question: "Do you have capacity planning in place for anticipated increases in DSAR volumes (e.g. following a data breach, restructuring, or public controversy)?",
      help: "DSAR volumes spike after breaches, media coverage, or organisational changes. The organisations that get reprimanded are typically those that had no plan for volume increases and allowed backlogs to accumulate. Proactive capacity planning is a governance essential.",
      weight: 2,
      icoRef: "ICO enforcement patterns",
    },
  ],
};

// ── Scoring and gap analysis logic ──
function computeSectionScore(sectionId, answers) {
  const qs = QUESTIONS[sectionId] || [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let answered = 0;
  let compliant = 0;
  let partial = 0;
  let gap = 0;
  let na = 0;

  qs.forEach((q) => {
    const a = answers[q.id];
    if (!a) return;
    answered++;
    if (a === "na") { na++; return; }
    const opt = OPTIONS.find((o) => o.value === a);
    totalWeightedScore += opt.score * q.weight;
    totalWeight += 3 * q.weight; // max is 3 per question
    if (a === "yes") compliant++;
    else if (a === "partial") partial++;
    else if (a === "no") gap++;
  });

  const pct = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;
  return { pct, answered, compliant, partial, gap, na, total: qs.length, unanswered: qs.length - answered };
}

function computeOverallScore(answers) {
  let totalWeighted = 0;
  let totalMax = 0;
  Object.keys(QUESTIONS).forEach((sectionId) => {
    QUESTIONS[sectionId].forEach((q) => {
      const a = answers[q.id];
      if (!a || a === "na") return;
      const opt = OPTIONS.find((o) => o.value === a);
      totalWeighted += opt.score * q.weight;
      totalMax += 3 * q.weight;
    });
  });
  return totalMax > 0 ? Math.round((totalWeighted / totalMax) * 100) : 0;
}

function getScoreLabel(pct) {
  if (pct >= 80) return { label: "Strong", color: "#22c55e", bg: "#f0fdf4" };
  if (pct >= 60) return { label: "Developing", color: "#f59e0b", bg: "#fffbeb" };
  if (pct >= 40) return { label: "Weak", color: "#f97316", bg: "#fff7ed" };
  return { label: "Critical gaps", color: "#ef4444", bg: "#fef2f2" };
}

function getGapRecommendations(answers) {
  const recs = [];
  Object.keys(QUESTIONS).forEach((sectionId) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    QUESTIONS[sectionId].forEach((q) => {
      const a = answers[q.id];
      if (a === "no" || a === "partial") {
        recs.push({
          sectionLabel: section.label,
          sectionId,
          question: q.question,
          answer: a,
          weight: q.weight,
          icoRef: q.icoRef,
          help: q.help,
        });
      }
    });
  });
  // Sort by weight desc, then "no" before "partial"
  recs.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    if (a.answer === "no" && b.answer === "partial") return -1;
    if (a.answer === "partial" && b.answer === "no") return 1;
    return 0;
  });
  return recs;
}

// ── Shared styles ──
const FONT_BODY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const FONT_HEADING = "'Source Serif 4', Georgia, serif";
const COLOR_TEXT = "#37352f";
const COLOR_MUTED = "#6b6b6b";
const COLOR_FAINT = "#9b9a97";
const COLOR_BORDER = "#e8e5e0";
const COLOR_BG = "#ffffff";
const COLOR_BG_HOVER = "#f7f6f3";
const COLOR_ACCENT = "#2563eb";

// ── Main component ──
export default function DSARReadiness() {
  const [screen, setScreen] = useState("intake");
  const [orgName, setOrgName] = useState("");
  const [orgSector, setOrgSector] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [dsarVolume, setDsarVolume] = useState("");
  const [activeSection, setActiveSection] = useState("governance");
  const [answers, setAnswers] = useState({});
  const [expandedHelp, setExpandedHelp] = useState({});
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const mainRef = useRef(null);

  const allSectors = [
    "Financial services",
    "Airlines / travel",
    "Healthcare / NHS",
    "Education",
    "Local government",
    "Central government",
    "Retail / e-commerce",
    "Technology",
    "Legal services",
    "Professional services",
    "Telecoms / media",
    "Energy / utilities",
    "Manufacturing",
    "Charity / non-profit",
    "Other",
  ];

  const canStart = orgName.trim().length > 0;

  const handleAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = Object.values(QUESTIONS).reduce((sum, qs) => sum + qs.length, 0);

  // ── Styles ──
  const pageStyle = {
    minHeight: "100vh",
    background: COLOR_BG,
    fontFamily: FONT_BODY,
    color: COLOR_TEXT,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "12px 24px",
    borderBottom: `1px solid ${COLOR_BORDER}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    background: COLOR_BG,
    zIndex: 100,
  };

  const contentStyle = {
    flex: 1,
    maxWidth: "680px",
    width: "100%",
    margin: "0 auto",
    padding: "60px 24px 80px",
  };

  // ── Render functions ──

  const renderHeader = () => (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT }}>AiLA</span>
        <span style={{ color: "#d3d1cb" }}>·</span>
        <span style={{ fontSize: "13px", color: COLOR_FAINT }}>DSAR Readiness Assessment</span>
      </div>
      {screen === "questionnaire" && (
        <span style={{ fontSize: "12px", color: COLOR_FAINT }}>
          {totalAnswered} / {totalQuestions} answered
        </span>
      )}
      {screen !== "questionnaire" && (
        <a href="https://trustaila.com" target="_blank" rel="noopener noreferrer" style={{
          fontSize: "12px", color: COLOR_FAINT, textDecoration: "none"
        }}>trustaila.com</a>
      )}
    </header>
  );

  const renderIntake = () => (
    <div style={contentStyle}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{
          fontFamily: FONT_HEADING,
          fontSize: "40px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 12px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>DSAR Readiness Assessment</h1>
        <p style={{ fontSize: "16px", color: COLOR_MUTED, margin: "0 0 8px", lineHeight: 1.6 }}>
          Assess your organisation's ability to handle data subject access requests in compliance with the UK GDPR, the Data Protection Act 2018, and ICO guidance updated for the Data (Use and Access) Act 2025.
        </p>
        <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: 0, lineHeight: 1.6 }}>
          {totalQuestions} questions across 7 areas · Takes 10–15 minutes · Generates a gap report with ICO references
        </p>
      </div>

      {/* Org name */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "8px" }}>
          Organisation name <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Enter your organisation name"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: "4px",
            fontSize: "15px",
            fontFamily: FONT_BODY,
            color: COLOR_TEXT,
            background: COLOR_BG,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Sector */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Sector
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          Helps us tailor guidance — sector-specific ICO enforcement patterns vary significantly
        </p>
        <select
          value={orgSector}
          onChange={(e) => setOrgSector(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: "4px",
            fontSize: "15px",
            fontFamily: FONT_BODY,
            color: orgSector ? COLOR_TEXT : COLOR_FAINT,
            background: COLOR_BG,
            outline: "none",
            boxSizing: "border-box",
          }}
        >
          <option value="">Select sector</option>
          {allSectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Org size */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Approximate number of employees
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          Affects the complexity and volume of DSARs you are likely to receive
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["1–49", "50–249", "250–999", "1,000–4,999", "5,000+"].map((size) => (
            <button
              key={size}
              onClick={() => setOrgSize(size)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${orgSize === size ? COLOR_ACCENT : COLOR_BORDER}`,
                borderRadius: "4px",
                background: orgSize === size ? `${COLOR_ACCENT}0a` : COLOR_BG,
                color: orgSize === size ? COLOR_ACCENT : COLOR_TEXT,
                fontSize: "14px",
                fontFamily: FONT_BODY,
                cursor: "pointer",
                fontWeight: orgSize === size ? 600 : 400,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* DSAR volume */}
      <div style={{ marginBottom: "48px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Approximate DSARs received in the last 12 months
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          If you don't know, that's itself a finding — select "Don't know"
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["0–10", "11–50", "51–200", "200+", "Don't know"].map((vol) => (
            <button
              key={vol}
              onClick={() => setDsarVolume(vol)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${dsarVolume === vol ? COLOR_ACCENT : COLOR_BORDER}`,
                borderRadius: "4px",
                background: dsarVolume === vol ? `${COLOR_ACCENT}0a` : COLOR_BG,
                color: dsarVolume === vol ? COLOR_ACCENT : COLOR_TEXT,
                fontSize: "14px",
                fontFamily: FONT_BODY,
                cursor: "pointer",
                fontWeight: dsarVolume === vol ? 600 : 400,
              }}
            >
              {vol}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => { setScreen("questionnaire"); }}
        disabled={!canStart}
        style={{
          padding: "12px 32px",
          background: canStart ? COLOR_TEXT : "#d3d1cb",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: FONT_BODY,
          cursor: canStart ? "pointer" : "not-allowed",
          transition: "background 0.15s",
        }}
      >
        Begin assessment
      </button>
    </div>
  );

  const renderSidebar = () => (
    <div style={{
      width: "240px",
      flexShrink: 0,
      borderRight: `1px solid ${COLOR_BORDER}`,
      padding: "16px 0",
      position: "sticky",
      top: "49px",
      height: "calc(100vh - 49px)",
      overflowY: "auto",
      background: COLOR_BG,
    }}>
      {SECTIONS.map((sec) => {
        const stats = computeSectionScore(sec.id, answers);
        const isActive = activeSection === sec.id;
        const allAnswered = stats.unanswered === 0;
        return (
          <button
            key={sec.id}
            onClick={() => { setActiveSection(sec.id); mainRef.current?.scrollTo(0, 0); }}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              border: "none",
              background: isActive ? COLOR_BG_HOVER : "transparent",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: isActive ? `2px solid ${COLOR_TEXT}` : "2px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
              <span style={{
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? COLOR_TEXT : COLOR_MUTED,
              }}>{sec.label}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {allAnswered && stats.total > 0 ? (
                <span style={{ fontSize: "12px", color: getScoreLabel(stats.pct).color, fontWeight: 600 }}>
                  {stats.pct}%
                </span>
              ) : stats.answered > 0 ? (
                <span style={{ fontSize: "12px", color: COLOR_FAINT }}>
                  {stats.answered}/{stats.total}
                </span>
              ) : (
                <span style={{ fontSize: "12px", color: COLOR_FAINT }}>—</span>
              )}
              {stats.gap > 0 && <span style={{ fontSize: "11px", color: "#ef4444" }}>● {stats.gap} gap{stats.gap > 1 ? "s" : ""}</span>}
            </div>
          </button>
        );
      })}

      {/* View results button */}
      <div style={{ padding: "16px", borderTop: `1px solid ${COLOR_BORDER}`, marginTop: "8px" }}>
        <button
          onClick={() => setScreen("results")}
          disabled={totalAnswered === 0}
          style={{
            width: "100%",
            padding: "10px 0",
            background: totalAnswered > 0 ? COLOR_TEXT : "#d3d1cb",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: FONT_BODY,
            cursor: totalAnswered > 0 ? "pointer" : "not-allowed",
          }}
        >
          View results
        </button>
        <p style={{ fontSize: "11px", color: COLOR_FAINT, margin: "6px 0 0", textAlign: "center" }}>
          {totalAnswered}/{totalQuestions} answered
        </p>
      </div>
    </div>
  );

  const renderQuestion = (q) => {
    const current = answers[q.id];
    const isHelpOpen = expandedHelp[q.id];
    return (
      <div
        key={q.id}
        style={{
          padding: "24px 0",
          borderBottom: `1px solid ${COLOR_BORDER}`,
        }}
      >
        <p style={{ fontSize: "15px", color: COLOR_TEXT, margin: "0 0 4px", lineHeight: 1.5, fontWeight: 500 }}>
          {q.question}
        </p>
        {q.weight === 3 && (
          <span style={{
            display: "inline-block",
            fontSize: "11px",
            color: COLOR_ACCENT,
            background: `${COLOR_ACCENT}0a`,
            border: `1px solid ${COLOR_ACCENT}22`,
            borderRadius: "3px",
            padding: "1px 6px",
            marginBottom: "8px",
            fontWeight: 600,
          }}>High priority</span>
        )}

        {/* Answer buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "12px 0" }}>
          {OPTIONS.map((opt) => {
            const selected = current === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleAnswer(q.id, opt.value)}
                style={{
                  padding: "7px 14px",
                  border: `1px solid ${selected ? opt.color : COLOR_BORDER}`,
                  borderRadius: "4px",
                  background: selected ? `${opt.color}0a` : COLOR_BG,
                  color: selected ? opt.color : COLOR_TEXT,
                  fontSize: "13px",
                  fontFamily: FONT_BODY,
                  cursor: "pointer",
                  fontWeight: selected ? 600 : 400,
                  transition: "all 0.12s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Help toggle */}
        <button
          onClick={() => setExpandedHelp((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: COLOR_FAINT,
            cursor: "pointer",
            fontFamily: FONT_BODY,
          }}
        >
          {isHelpOpen ? "Hide guidance ▴" : "Show guidance ▾"}
        </button>
        {isHelpOpen && (
          <div style={{
            marginTop: "8px",
            padding: "12px 16px",
            background: COLOR_BG_HOVER,
            borderRadius: "4px",
            borderLeft: `3px solid ${COLOR_BORDER}`,
          }}>
            <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: "0 0 8px", lineHeight: 1.6 }}>
              {q.help}
            </p>
            <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>
              Source: {q.icoRef}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionnaire = () => {
    const sectionMeta = SECTIONS.find((s) => s.id === activeSection);
    const sectionQuestions = QUESTIONS[activeSection] || [];
    const sectionIdx = SECTIONS.findIndex((s) => s.id === activeSection);

    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - 49px)" }}>
        {renderSidebar()}
        <div
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            height: "calc(100vh - 49px)",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 32px 80px" }}>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: COLOR_FAINT }}>{sectionMeta.icon}</span>
            </div>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "28px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>{sectionMeta.label}</h2>
            <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: "0 0 24px" }}>
              {sectionQuestions.length} questions
            </p>

            {sectionQuestions.map(renderQuestion)}

            {/* Section navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
              {sectionIdx > 0 ? (
                <button
                  onClick={() => { setActiveSection(SECTIONS[sectionIdx - 1].id); mainRef.current?.scrollTo(0, 0); }}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    background: COLOR_BG,
                    color: COLOR_TEXT,
                    fontSize: "13px",
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  ← {SECTIONS[sectionIdx - 1].label}
                </button>
              ) : <div />}
              {sectionIdx < SECTIONS.length - 1 ? (
                <button
                  onClick={() => { setActiveSection(SECTIONS[sectionIdx + 1].id); mainRef.current?.scrollTo(0, 0); }}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    background: COLOR_BG,
                    color: COLOR_TEXT,
                    fontSize: "13px",
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  {SECTIONS[sectionIdx + 1].label} →
                </button>
              ) : (
                <button
                  onClick={() => setScreen("results")}
                  style={{
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: "4px",
                    background: COLOR_TEXT,
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  View results →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const overall = computeOverallScore(answers);
    const scoreInfo = getScoreLabel(overall);
    const recs = getGapRecommendations(answers);
    const highPriorityGaps = recs.filter((r) => r.weight === 3 && r.answer === "no");

    return (
      <div style={contentStyle}>
        {/* Back to questionnaire */}
        <button
          onClick={() => setScreen("questionnaire")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: COLOR_FAINT,
            cursor: "pointer",
            fontFamily: FONT_BODY,
            marginBottom: "24px",
          }}
        >
          ← Back to questions
        </button>

        <h1 style={{
          fontFamily: FONT_HEADING,
          fontSize: "36px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 8px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>DSAR Readiness Report</h1>
        <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: "0 0 40px" }}>
          {orgName}{orgSector ? ` · ${orgSector}` : ""}{orgSize ? ` · ${orgSize} employees` : ""}
        </p>

        {/* Overall score */}
        <div style={{
          padding: "32px",
          background: scoreInfo.bg,
          borderRadius: "8px",
          border: `1px solid ${scoreInfo.color}22`,
          marginBottom: "40px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "64px", fontWeight: 700, color: scoreInfo.color, fontFamily: FONT_HEADING }}>
            {overall}%
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: scoreInfo.color, marginBottom: "8px" }}>
            {scoreInfo.label}
          </div>
          <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: 0 }}>
            Based on {totalAnswered} of {totalQuestions} questions answered
          </p>
        </div>

        {/* Section breakdown */}
        <h2 style={{
          fontFamily: FONT_HEADING,
          fontSize: "24px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 16px",
        }}>Section scores</h2>
        <div style={{ marginBottom: "40px" }}>
          {SECTIONS.map((sec) => {
            const stats = computeSectionScore(sec.id, answers);
            if (stats.answered === 0) return null;
            const si = getScoreLabel(stats.pct);
            return (
              <div key={sec.id} style={{ padding: "12px 0", borderBottom: `1px solid ${COLOR_BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: COLOR_TEXT }}>{sec.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: si.color }}>{stats.pct}%</span>
                </div>
                <div style={{ height: "6px", background: "#f0f0ec", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${stats.pct}%`,
                    background: si.color,
                    borderRadius: "3px",
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  {stats.compliant > 0 && <span style={{ fontSize: "12px", color: "#22c55e" }}>✓ {stats.compliant} compliant</span>}
                  {stats.partial > 0 && <span style={{ fontSize: "12px", color: "#f59e0b" }}>◐ {stats.partial} partial</span>}
                  {stats.gap > 0 && <span style={{ fontSize: "12px", color: "#ef4444" }}>✕ {stats.gap} gap{stats.gap > 1 ? "s" : ""}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Critical gaps */}
        {highPriorityGaps.length > 0 && (
          <>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "24px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
            }}>Critical gaps</h2>
            <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.5 }}>
              These are high-priority areas where your organisation has no current capability. The ICO is most likely to take enforcement action in these areas.
            </p>
            <div style={{ marginBottom: "40px" }}>
              {highPriorityGaps.map((r, i) => (
                <div key={i} style={{
                  padding: "16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: COLOR_TEXT, margin: "0 0 4px" }}>{r.question}</p>
                  <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: "0 0 4px", lineHeight: 1.5 }}>{r.help}</p>
                  <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>{r.icoRef}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* All recommendations */}
        {recs.length > 0 && (
          <>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "24px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
            }}>All findings</h2>
            <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.5 }}>
              Ordered by priority. Each finding references the relevant ICO guidance or enforcement action.
            </p>
            <div style={{ marginBottom: "40px" }}>
              {recs.map((r, i) => (
                <div key={i} style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${COLOR_BORDER}`,
                }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: r.answer === "no" ? "#ef4444" : "#f59e0b",
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: "13px", color: COLOR_FAINT }}>{r.sectionLabel}</span>
                    {r.weight === 3 && <span style={{ fontSize: "11px", color: COLOR_ACCENT, fontWeight: 600 }}>HIGH</span>}
                  </div>
                  <p style={{ fontSize: "14px", color: COLOR_TEXT, margin: "0 0 4px", lineHeight: 1.4 }}>{r.question}</p>
                  <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>{r.icoRef}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* AiLA CTA */}
        <div style={{
          padding: "32px",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: `1px solid ${COLOR_BORDER}`,
          marginBottom: "40px",
        }}>
          <h3 style={{
            fontFamily: FONT_HEADING,
            fontSize: "20px",
            fontWeight: 700,
            color: COLOR_TEXT,
            margin: "0 0 12px",
          }}>How AiLA addresses these gaps</h3>
          <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.6 }}>
            AiLA automates DSAR processing end-to-end: screening incoming requests, acknowledging receipt, searching across your enterprise systems (email, HR, CRM, file shares, databases), identifying and redacting PII, assessing exemptions, and preparing the response package for legal review.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {[
              ["Data Discovery", "Connects to Exchange, SharePoint, HR systems, CRM, and databases via deep integration — not just surface-level search"],
              ["PII Identification", "Automatically identifies personal data and applies synthetic replacement for safe LLM processing"],
              ["Redaction", "Identifies third-party data and applies redactions with full audit trail"],
              ["Exemption Assessment", "Built-in UK legal knowledge covering DPA 2018 exemptions and ICO guidance"],
              ["Deadline Tracking", "Automated logging, acknowledgement, and deadline management from receipt to response"],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: "8px 0" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT }}>{title}</span>
                <span style={{ fontSize: "14px", color: COLOR_MUTED }}> — {desc}</span>
              </div>
            ))}
          </div>

          {/* Email capture */}
          {!emailSubmitted ? (
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, margin: "0 0 8px" }}>
                Get your full report and learn how AiLA can help
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email address"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: FONT_BODY,
                    color: COLOR_TEXT,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => {
                    if (email.includes("@") && email.includes(".")) {
                      setEmailSubmitted(true);
                      // In production, POST to Formspree or similar
                    }
                  }}
                  style={{
                    padding: "10px 24px",
                    background: COLOR_TEXT,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  Send report
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              padding: "12px 16px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "4px",
            }}>
              <p style={{ fontSize: "14px", color: "#166534", margin: 0 }}>
                Thanks — we'll send your full report to {email}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${COLOR_BORDER}`, paddingTop: "24px" }}>
          <p style={{ fontSize: "13px", color: COLOR_FAINT, lineHeight: 1.5, margin: "0 0 8px" }}>
            This assessment is based on the ICO's Right of Access detailed guidance (updated December 2025), the ICO's SAR Q&A for Employers (May 2023), ICO enforcement actions 2022–2025, and the Data (Use and Access) Act 2025. It covers operational readiness, not legal advice.
          </p>
          <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: 0 }}>
            © {new Date().getFullYear()} AiLA AI Ltd · <a href="https://trustaila.com" target="_blank" rel="noopener noreferrer" style={{ color: COLOR_FAINT }}>trustaila.com</a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet" />
      {renderHeader()}
      {screen === "intake" && renderIntake()}
      {screen === "questionnaire" && renderQuestionnaire()}
      {screen === "results" && renderResults()}
    </div>
  );
}
