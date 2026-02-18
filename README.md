# DSAR Readiness Assessment — AiLA

Self-assessment tool evaluating an organisation's ability to handle data subject access requests in compliance with the UK GDPR, the Data Protection Act 2018, and ICO guidance updated for the Data (Use and Access) Act 2025.

## What it covers

42 questions across 7 sections:

1. Governance & Preparation
2. Request Recognition & Intake
3. Data Discovery & Search
4. Response Management
5. Redaction & Exemptions
6. Delivery & Compliance
7. Volume & Scalability

## How scoring works

Each question is answered as: fully in place (3), partially in place (2), not started (1), or not applicable. Questions carry weights (1–3) reflecting ICO enforcement priorities. Scores are calculated per section and overall as a weighted percentage.

Every gap is assigned a severity (critical / high / medium / low) and effort estimate (quick win / moderate / significant). The action plan ranks gaps by a priority score combining severity, effort, and status — so critical gaps with quick fixes surface first.

## Report output

- Executive summary with overall score and narrative
- Section-by-section scores with progress bars
- Prioritised action plan with specific remediation steps per gap
- Summary table with owner and target date columns (blank for user to complete)

## Tech stack

- React 18
- Vite
- No backend — runs entirely in the browser
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

## Deployment

Push to GitHub, connect repo to Vercel. Auto-deploys on every commit.

## Sources

- ICO Right of Access detailed guidance (updated December 2025)
- ICO SAR Q&A for Employers (May 2023)
- ICO enforcement actions 2022–2025
- Data (Use and Access) Act 2025
- UK GDPR Article 15
- Data Protection Act 2018 Schedule 2 exemptions

## Related

- [ICO Accountability Assessment](https://ico-accountability.vercel.app/) — broader assessment against the ICO's full Accountability Framework
- [LOCS:23 Gap Analysis](https://locs23-tool.vercel.app/) — assessment against the Law Society's LOCS:23 certification standard

---

© AiLA AI Ltd · [trustaila.com](https://trustaila.com)# Dsar-readiness read me
