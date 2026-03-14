---
layout: post
title: "Are You Defending Your Code at the Right Stage?"
date: 2026-03-14
tags: [DevSecOps, Security, CI/CD, SDLC]
category: devsecops
excerpt: "Most teams defend their code at the wrong stage — too late, too noisy, too reactive. Here's how Shift Left and Shift Right together give you complete coverage across every stage of your pipeline."
---

Security used to be a gate at the end of the pipeline. Developers shipped code, and security did a final scan before deployment. That model is dead.

Modern software moves too fast. By the time you find a vulnerability at the end, it's already embedded in ten other services, three environments, and a production database. The solution is simple in theory but hard in practice — **move security everywhere**.

That's where Shift Left and Shift Right come in.

---

## What is Shift Left Security?

**Shift Left** means integrating security at the **earliest stages of development** — during planning, coding, and testing — rather than treating it as a final checkpoint.

The core idea: find vulnerabilities when they are cheapest to fix. A bug caught in the IDE costs almost nothing. The same bug caught in production can cost thousands of dollars, days of downtime, and your company's reputation.

> Prevention is cheaper than remediation. Always.

### What Shift Left Focuses On

- **Proactive identification** of bugs, vulnerabilities, and misconfigurations
- Security embedded in the **developer's workflow** — not bolted on later
- Automated gates that **block bad code** before it ever ships

### Shift Left Tools & Methods

| Method | What It Does | Example Tools |
|---|---|---|
| SAST | Scans source code for vulnerabilities | Semgrep, SonarQube, Bandit |
| SCA | Finds vulnerable dependencies | Snyk, OWASP Dependency Check |
| IaC Scanning | Checks infrastructure configs | Checkov, tfsec, KICS |
| Secret Scanning | Prevents credential leaks | Gitleaks, TruffleHog |
| Developer Training | Builds security mindset | OWASP Top 10, secure coding guides |

### Shift Left in Practice

```bash
# Step 1 — Install pre-commit framework
pip install pre-commit
```

```yaml
# Step 2 — Create .pre-commit-config.yaml in your repo root
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.30.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/semgrep/semgrep-pre-commit
    rev: v1.152.0
    hooks:
      - id: semgrep
```

```bash
# Step 3 — Activate hooks in your local .git/ directory
pre-commit install

# Step 4 — Test against all files (optional but recommended)
pre-commit run --all-files

# Keep hooks up to date automatically
pre-commit autoupdate

# Skip checks when needed (use sparingly)
SKIP=gitleaks,semgrep git commit -m "your message"
```

Add this to your `.github/workflows/security.yml`:

```yaml
# Option 1 — Container-based projects (scan Docker image)
- name: Trivy image scan
  uses: aquasecurity/trivy-action@0.69.3
  with:
    scan-type: 'image'
    image-ref: 'myapp:latest'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

```yaml
# Option 2 — Non-container projects (scan source code + dependencies)
- name: Trivy filesystem scan
  uses: aquasecurity/trivy-action@0.69.3
  with:
    scan-type: 'fs'
    scan-ref: '.'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

> **Not using containers?** Use `scan-type: 'fs'` — Trivy scans your source code and application dependencies (npm, pip, Maven, Go modules) directly. No Docker required.

### Benefits of Shift Left

- **Lower remediation costs** — fix at code, not in production
- **Faster development cycles** — security becomes part of the workflow, not a blocker
- **Higher quality code** — developers build security intuition over time
- **Compliance** — automated evidence collection for SOC 2, ISO 27001

---

## What is Shift Right Security?

**Shift Right** extends security into the **operational, post-deployment phase**. It acknowledges a hard truth: no matter how well you shift left, threats will still emerge in production.

Zero-day exploits don't care about your SAST scans. Behavioral anomalies don't show up in pre-commit hooks. Configuration drift happens silently. You need eyes on production — always.

> Assume breach. Detect fast. Respond faster.

### What Shift Right Focuses On

- **Protecting live applications** from zero-day exploits and behavioral anomalies
- **Real-time monitoring** of what's actually happening in your environment
- **Incident response** — detecting and containing threats before they escalate

### Shift Right Tools & Methods

| Method | What It Does | Example Tools |
|---|---|---|
| DAST | Tests running application for vulnerabilities | OWASP ZAP, Burp Suite |
| IAST | Agent inside app — lower false positives than DAST | Contrast Security, Seeker |
| WAF | Blocks malicious HTTP traffic | AWS WAF, Cloudflare, ModSecurity |
| SIEM | Correlates security events across systems | Wazuh, Splunk, ELK Stack |
| Runtime Security | Detects anomalous container behavior | Aqua Security, Sysdig, Falco |
| API Security | Monitors and protects API endpoints | Salt Security, 42Crunch |
| Observability | Full visibility into system behavior | Grafana, Prometheus, Datadog |

### Shift Right in Practice

To detect brute force and privilege escalation, add these custom correlation rules to `/var/ossec/etc/rules/local_rules.xml` on your Wazuh manager:

```xml
<!-- Place in /var/ossec/etc/rules/local_rules.xml -->

<!-- SSH Brute-Force: 6+ failed logins from same IP in 120 seconds -->
<group name="syslog,sshd,">
  <rule id="100001" level="10" frequency="6" timeframe="120">
    <if_matched_sid>5710</if_matched_sid>
    <same_source_ip />
    <description>Possible SSH brute-force: 6+ failed logins from same IP in 120s</description>
  </rule>
</group>

<!-- Windows Brute-Force: 5 failed logons (Event ID 4625) in 60 seconds -->
<group name="windows,authentication_failed,">
  <rule id="100002" level="10" frequency="5" timeframe="60">
    <if_matched_sid>60112</if_matched_sid>
    <same_source_ip />
    <description>Possible Windows brute-force: 5+ failed logons from same IP in 60s</description>
  </rule>
</group>

<!-- Linux Privilege Escalation — sudo/su monitoring -->
<!-- Rule 5710 = sudo usage, 5716 = su usage (built-in Wazuh) -->
<!-- Add custom correlation rule below -->
<group name="syslog,sudo,">
  <rule id="100003" level="12">
    <if_sid>5710</if_sid>
    <description>Privilege escalation via sudo detected (Linux)</description>
    <mitre>
      <id>T1548.003</id>
    </mitre>
  </rule>
</group>

<!-- Suspicious Python execution — possible priv esc via script -->
<group name="syscheck,">
  <rule id="100004" level="12">
    <if_sid>505</if_sid>
    <field name="file">/usr/bin/python3</field>
    <description>Suspicious Python script executed — possible privilege escalation</description>
    <mitre>
      <id>T1068</id>
    </mitre>
  </rule>
</group>

<!-- Windows privilege escalation via token manipulation -->
<!-- Rule 60107 = built-in Wazuh Windows Event log detection -->
```



```text
# /etc/audit/audit.rules — track privilege escalation attempts
# Logs any process where euid becomes 0 (root) but real uid differs
-a always,exit -F arch=b64 -S execve -C uid!=euid -F euid=0 -k priv_esc
```

> **Note:** Restart wazuh-manager after adding custom rules: `systemctl restart wazuh-manager`

### Benefits of Shift Right

- **Immediate threat detection** in real-world conditions
- **Real user data** — surfaces issues that simulated tests miss
- **Runtime resilience** — your system stays protected even after deployment
- **Continuous feedback loop** — production findings feed back into development

---

## Shift Left vs Shift Right — Key Differences

<div style="overflow-x:auto;margin:24px 0">
<svg viewBox="0 0 860 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:860px;font-family:'JetBrains Mono',monospace">
  <defs>
    <filter id="gl2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00ff41;stop-opacity:0.12"/>
      <stop offset="50%" style="stop-color:#ffe000;stop-opacity:0.04"/>
      <stop offset="100%" style="stop-color:#ff6b00;stop-opacity:0.12"/>
    </linearGradient>
  </defs>
  <rect width="860" height="320" fill="#050a05"/>
  <rect x="8" y="8" width="844" height="304" rx="8" fill="url(#lg2)" stroke="#1a3d2e" stroke-width="1"/>
  <text x="430" y="38" fill="#ccffcc" font-size="11" text-anchor="middle" letter-spacing="3" font-weight="bold">SHIFT LEFT vs SHIFT RIGHT — AT A GLANCE</text>
  <line x1="30" y1="48" x2="830" y2="48" stroke="#1a3d2e" stroke-width="1"/>
  <rect x="30" y="60" width="370" height="36" rx="4" fill="rgba(0,255,65,0.08)" stroke="#00ff41" stroke-width="1"/>
  <text x="215" y="84" fill="#00ff41" font-size="12" text-anchor="middle" font-weight="bold" letter-spacing="2" filter="url(#gl2)">⬅ SHIFT LEFT — PREVENTION</text>
  <rect x="460" y="60" width="370" height="36" rx="4" fill="rgba(255,107,0,0.08)" stroke="#ff6b00" stroke-width="1"/>
  <text x="645" y="84" fill="#ff6b00" font-size="12" text-anchor="middle" font-weight="bold" letter-spacing="2" filter="url(#gl2)">SHIFT RIGHT — DETECTION ➡</text>
  <text x="430" y="84" fill="#ffe000" font-size="11" text-anchor="middle" font-weight="bold">VS</text>
  <text x="430" y="116" fill="#2d6b2d" font-size="9" text-anchor="middle" letter-spacing="2">TIMING</text>
  <text x="430" y="152" fill="#2d6b2d" font-size="9" text-anchor="middle" letter-spacing="2">GOAL</text>
  <text x="430" y="188" fill="#2d6b2d" font-size="9" text-anchor="middle" letter-spacing="2">DATA</text>
  <text x="430" y="224" fill="#2d6b2d" font-size="9" text-anchor="middle" letter-spacing="2">PHASE</text>
  <text x="430" y="260" fill="#2d6b2d" font-size="9" text-anchor="middle" letter-spacing="2">COST</text>
  <text x="215" y="116" fill="#00ff41" font-size="10" text-anchor="middle">Pre-production</text>
  <text x="215" y="152" fill="#00ff41" font-size="10" text-anchor="middle">Prevent vulnerabilities</text>
  <text x="215" y="188" fill="#00ff41" font-size="10" text-anchor="middle">Simulated / static</text>
  <text x="215" y="224" fill="#00ff41" font-size="10" text-anchor="middle">Dev → Build → Test</text>
  <text x="215" y="260" fill="#00ff41" font-size="10" text-anchor="middle">Low — fix early</text>
  <text x="645" y="116" fill="#ff6b00" font-size="10" text-anchor="middle">Post-production</text>
  <text x="645" y="152" fill="#ff6b00" font-size="10" text-anchor="middle">Detect &amp; respond</text>
  <text x="645" y="188" fill="#ff6b00" font-size="10" text-anchor="middle">Real user / runtime data</text>
  <text x="645" y="224" fill="#ff6b00" font-size="10" text-anchor="middle">Deploy → Monitor → Respond</text>
  <text x="645" y="260" fill="#ff6b00" font-size="10" text-anchor="middle">High — fix in production</text>
  <line x1="30" y1="125" x2="830" y2="125" stroke="#1a3d2e" stroke-width="0.5"/>
  <line x1="30" y1="161" x2="830" y2="161" stroke="#1a3d2e" stroke-width="0.5"/>
  <line x1="30" y1="197" x2="830" y2="197" stroke="#1a3d2e" stroke-width="0.5"/>
  <line x1="30" y1="233" x2="830" y2="233" stroke="#1a3d2e" stroke-width="0.5"/>
  <!-- vertical divider removed — spacing is enough -->
  <rect x="30" y="278" width="800" height="26" rx="4" fill="rgba(255,224,0,0.04)" stroke="#1a3d2e" stroke-width="0.5"/>
  <text x="430" y="295" fill="#ffe000" font-size="9" text-anchor="middle" letter-spacing="1">⚡  TOGETHER = "SHIFT EVERYWHERE" — Proactive prevention + Reactive protection</text>
</svg>
</div>

---

## The SDLC Security Pipeline

<div style="overflow-x:auto;margin:24px 0">
<svg viewBox="0 0 980 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;min-width:700px;font-family:'JetBrains Mono',monospace">
  <defs>
    <filter id="gl3"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#2d6b2d"/>
    </marker>
  </defs>
  <rect width="980" height="320" fill="#050a05"/>

  <!-- Zone backgrounds — LEFT ends at 480, RIGHT starts at 500, clear gap -->
  <rect x="8" y="8" width="462" height="304" rx="6" fill="rgba(0,255,65,0.04)" stroke="#00ff41" stroke-width="0.5" stroke-opacity="0.4"/>
  <text x="24" y="26" fill="#00ff41" font-size="9" letter-spacing="3" opacity="0.7">⬅ SHIFT LEFT</text>
  <rect x="518" y="8" width="462" height="304" rx="6" fill="rgba(255,107,0,0.04)" stroke="#ff6b00" stroke-width="0.5" stroke-opacity="0.4"/>
  <text x="524" y="26" fill="#ff6b00" font-size="9" letter-spacing="3" opacity="0.7">SHIFT RIGHT ➡</text>

  <!-- Pipeline arrow -->
  <line x1="40" y1="165" x2="960" y2="165" stroke="#1a3d2e" stroke-width="1.5" marker-end="url(#arr)" stroke-dasharray="5,4"/>

  <!-- 7 stages: CODE(60) COMMIT(190) BUILD(320) TEST(450) | DEPLOY(570) MONITOR(700) RESPOND(830) -->
  <!-- CODE -->
  <rect x="18" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#00ff41" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="75" y="82" fill="#00ff41" font-size="20" text-anchor="middle">💻</text>
  <text x="75" y="102" fill="#00ff41" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">CODE</text>
  <text x="75" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">SAST · IDE plugins</text>
  <text x="75" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Threat modeling</text>
  <circle cx="75" cy="165" r="4" fill="#00ff41" filter="url(#gl3)"/>
  <line x1="75" y1="147" x2="75" y2="161" stroke="#00ff41" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- COMMIT -->
  <rect x="148" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#00d4ff" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="205" y="82" fill="#00d4ff" font-size="20" text-anchor="middle">📝</text>
  <text x="205" y="102" fill="#00d4ff" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">COMMIT</text>
  <text x="205" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">Secret scanning</text>
  <text x="205" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Pre-commit hooks</text>
  <circle cx="205" cy="165" r="4" fill="#00d4ff" filter="url(#gl3)"/>
  <line x1="205" y1="147" x2="205" y2="161" stroke="#00d4ff" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- BUILD -->
  <rect x="278" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#ffe000" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="335" y="82" fill="#ffe000" font-size="20" text-anchor="middle">🔨</text>
  <text x="335" y="102" fill="#ffe000" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">BUILD</text>
  <text x="335" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">SCA · SBOM</text>
  <text x="335" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Trivy · OWASP</text>
  <circle cx="335" cy="165" r="4" fill="#ffe000" filter="url(#gl3)"/>
  <line x1="335" y1="147" x2="335" y2="161" stroke="#ffe000" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- TEST — fully inside left zone (ends at x=478, zone ends at 488) -->
  <rect x="363" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#00ff88" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="420" y="82" fill="#00ff88" font-size="20" text-anchor="middle">🧪</text>
  <text x="420" y="102" fill="#00ff88" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">TEST</text>
  <text x="420" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">DAST · IAST</text>
  <text x="420" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Burp · ZAP</text>
  <circle cx="420" cy="165" r="4" fill="#00ff88" filter="url(#gl3)"/>
  <line x1="420" y1="147" x2="420" y2="161" stroke="#00ff88" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- DEPLOY — fully inside right zone -->
  <rect x="508" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#ff6b00" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="565" y="82" fill="#ff6b00" font-size="20" text-anchor="middle">🚀</text>
  <text x="565" y="102" fill="#ff6b00" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">DEPLOY</text>
  <text x="565" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">IaC · Checkov</text>
  <text x="565" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Signed artifacts</text>
  <circle cx="565" cy="165" r="4" fill="#ff6b00" filter="url(#gl3)"/>
  <line x1="565" y1="147" x2="565" y2="161" stroke="#ff6b00" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- MONITOR -->
  <rect x="643" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#ff3366" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="700" y="82" fill="#ff3366" font-size="20" text-anchor="middle">📡</text>
  <text x="700" y="102" fill="#ff3366" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">MONITOR</text>
  <text x="700" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">SIEM · WAF</text>
  <text x="700" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Wazuh · Splunk</text>
  <circle cx="700" cy="165" r="4" fill="#ff3366" filter="url(#gl3)"/>
  <line x1="700" y1="147" x2="700" y2="161" stroke="#ff3366" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- RESPOND -->
  <rect x="778" y="55" width="115" height="92" rx="5" fill="#0a1a0a" stroke="#cc00ff" stroke-width="1.2" filter="url(#gl3)"/>
  <text x="835" y="82" fill="#cc00ff" font-size="20" text-anchor="middle">⚡</text>
  <text x="835" y="102" fill="#cc00ff" font-size="9" text-anchor="middle" font-weight="bold" letter-spacing="1">RESPOND</text>
  <text x="835" y="117" fill="#2d6b2d" font-size="8" text-anchor="middle">Incident response</text>
  <text x="835" y="130" fill="#2d6b2d" font-size="8" text-anchor="middle">Auto-remediation</text>
  <circle cx="835" cy="165" r="4" fill="#cc00ff" filter="url(#gl3)"/>
  <line x1="835" y1="147" x2="835" y2="161" stroke="#cc00ff" stroke-width="0.8" stroke-opacity="0.5" stroke-dasharray="2,2"/>

  <!-- Cost labels -->
  <text x="75"  y="192" fill="#00ff41" font-size="9" text-anchor="middle" opacity="0.8">$1</text>
  <text x="205" y="192" fill="#00d4ff" font-size="9" text-anchor="middle" opacity="0.8">$5</text>
  <text x="335" y="192" fill="#ffe000" font-size="9" text-anchor="middle" opacity="0.8">$15</text>
  <text x="420" y="192" fill="#00ff88" font-size="9" text-anchor="middle" opacity="0.8">$50</text>
  <text x="565" y="192" fill="#ff6b00" font-size="9" text-anchor="middle" opacity="0.8">$150</text>
  <text x="700" y="192" fill="#ff3366" font-size="9" text-anchor="middle" opacity="0.8">$500</text>
  <text x="835" y="192" fill="#cc00ff" font-size="9" text-anchor="middle" opacity="0.8">$1000+</text>
  <text x="490" y="212" fill="#1a3d2e" font-size="8" text-anchor="middle" letter-spacing="1">COST TO FIX A VULNERABILITY AT EACH STAGE</text>

  <!-- Key insight box -->
  <rect x="18" y="224" width="960" height="40" rx="5" fill="rgba(255,224,0,0.03)" stroke="#1a3d2e" stroke-width="0.5"/>
  <text x="490" y="241" fill="#ffe000" font-size="9" text-anchor="middle" letter-spacing="1" font-weight="bold">KEY INSIGHT</text>
  <text x="490" y="257" fill="#2d6b2d" font-size="8" text-anchor="middle">Fix at CODE = $1 · Fix in PRODUCTION = $1000+ · Shift left saves money, shift right saves reputation</text>
</svg>
</div>

---

## The "Shift Everywhere" Strategy

Neither approach alone is enough. Here is how I think about combining them:

### My Recommended Minimum Pipeline

```
Pre-commit   →  Gitleaks + Semgrep  (stop secrets and bad code at source)
CI/CD        →  Trivy + OWASP DC    (block on critical CVEs before build)
IaC          →  Checkov             (catch misconfigs before they reach cloud)
Test/Stage   →  Burp Suite / ZAP    (DAST — run manually or scheduled, not on every commit)
Runtime      →  Wazuh               (detect threats that slip through)
```

> **Why Trivy AND OWASP Dependency Check?** They are not redundant — they complement each other. Trivy scans **container images and OS packages** (Alpine, Ubuntu, etc.), while OWASP DC scans **application-level dependencies** (npm, Maven, pip, NuGet). Running both gives you full coverage across the entire dependency tree.

### What About IAST?

IAST (Interactive Application Security Testing) sits between SAST and DAST — an agent runs **inside** your application during functional testing. Because it has internal visibility it produces far fewer false positives than DAST and catches runtime issues that SAST misses. The tradeoff: it requires an agent installed in your app and works best with automated functional test suites. If you have the setup, IAST gives you the best of both worlds.

> **Note on DAST:** Avoid running DAST on every commit — it is slow, resource-heavy, and produces false positives that cause alert fatigue. Instead run it on a **schedule** (nightly or weekly) against staging, or manually before major releases. Tune your rules before trusting the results.
>
> **When DAST isn't enough — consider Penetration Testing.** DAST automates known attack patterns but misses business logic flaws, chained vulnerabilities, and creative attack paths. A skilled penetration tester thinks like a real attacker — testing what automated tools never will. Run a manual pentest at least once a year, or before any major release. DAST finds the obvious; pentesters find the unexpected.

### Priority Order — Where to Start

**Week 1** — Add pre-commit hooks. Stop secrets leaking. This single step prevents 40% of common breaches.

**Month 1** — Add Trivy to CI/CD. Block deployments on CRITICAL CVEs. Automated, zero manual effort after setup.

**Quarter 1** — Deploy Wazuh SIEM. Correlate logs across your stack. Build detection rules around OWASP Top 10.

**Year 1** — Full shift everywhere coverage. Chaos engineering. Incident runbooks. Security as team culture.

### Common Mistakes to Avoid

- **Scanning but not blocking** — if a critical CVE doesn't fail your build, the scan is just decoration
- **Alert fatigue** — one well-tuned SIEM beats five noisy ones. Tune ruthlessly
- **Skipping IaC scanning** — most cloud breaches start from misconfigured infrastructure, not app code
- **No runbooks** — detection without a response plan is useless. Write runbooks before you need them
- **Treating shift left as "only for developers"** — security engineers need to own the pipeline gates too

---

## Final Thought

> **Shift left to prevent. Shift right to survive. Do both to win.**

Security is not a checkbox. It is a culture that lives in every commit, every pipeline gate, and every production alert. The goal is not to find the perfect tool — it is to build a system where vulnerabilities have nowhere to hide.

Start small. Automate ruthlessly. Tune continuously.
