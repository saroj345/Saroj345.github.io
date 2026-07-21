---
title: "Private Network Reconnaissance via SSRF in Weaviate Cloud"
date: 2026-07-21
tags: [ssrf, bug-bounty, vector-databases, weaviate, cloud-security]
description: "How a configurable module endpoint in Weaviate Cloud exposed internal Kubernetes infrastructure, and how it was fixed."
---

## Summary

In March 2026 I reported a Server-Side Request Forgery issue in Weaviate Cloud to their Vulnerability Disclosure Program. By pointing a module's configurable endpoint at a listener I controlled, I was able to make the managed service send internal requests outbound — revealing details about the private infrastructure it runs on.

Weaviate triaged the report within a week and shipped mitigations in [PR #10878](https://github.com/weaviate/weaviate/pull/10878), merged March 27, 2026. The finding is acknowledged in Weaviate's [security hall of fame](https://github.com/weaviate/security-hall-of-fame) under my hackerone username jorsec.

## Background: The BaseURL Feature

Weaviate's module system lets operators configure a `baseURL` for vectorizer and generative integrations. It exists for good reasons — customers point modules at private endpoints, self-hosted LLMs, or region-specific APIs for data residency. Weaviate's security team made this point directly during triage, and they're right: it's a feature the product needs, not an oversight.

But a configurable outbound endpoint is, structurally, an SSRF surface. The application makes a request to a location someone else specifies. In a managed multi-tenant cloud, that request originates inside the provider's own infrastructure.

## The Issue

Weaviate Cloud runs customer instances inside a managed Kubernetes environment. A user with write-level access to their own instance's configuration can modify the module `baseURL`.

By setting it to an external listener, embedding requests that would normally go to an inference provider were instead delivered to a host I controlled. The requests carried enough context to characterize the environment they came from:

- The cloud provider hosting the service
- The internal pod address and the private RFC 1918 range in use
- Kubernetes workload identifiers — namespace, workload name, StatefulSet pod naming
- The service mesh and sidecar proxy in the request path

None of this is customer data. It's infrastructure reconnaissance — the map you'd want before attempting lateral movement. In a managed service, a tenant learning the internal topology of the platform they're renting is a meaningful boundary erosion, even where no single item is individually severe.

> I'm withholding the specific values. The code fix doesn't change the underlying infrastructure, and there's no reader benefit to publishing the actual addresses and identifiers.

## Impact

Exploitation requires authenticated write access to instance configuration — this isn't unauthenticated. That lowers severity, and I noted it in the report.

It doesn't eliminate the concern. Anyone who can modify a module endpoint can reach outward from inside the platform's network. That includes legitimate customers, anyone who compromises a customer's API key, and any application with configuration write access. The step from "I have a Weaviate Cloud account" to "I can enumerate the provider's internal network" is shorter than it should be.

The general lesson: in managed services, tenant-configurable outbound endpoints are a tenant-to-platform boundary, and they need to be treated as one.

## Disclosure Timeline

| Date | Event |
|---|---|
| Mar 18, 2026 | Report submitted to Weaviate VDP |
| Mar 21, 2026 | Follow-up requesting status |
| Mar 24, 2026 | Triaged and confirmed |
| Mar 27, 2026 | PR #10878 merged |
| Apr 1, 2026 | Report resolved; PR linked as mitigation |

Weaviate was straightforward throughout. They acknowledged a slower first response and explained why — a small company with a smaller security team — and then moved quickly once engaged: triage to merged fix in three days. They also engaged with the tradeoff honestly rather than reflexively defending the feature. That's a good disclosure experience.

## The Fix

PR #10878 touched 97 files (+2,690 / −248). Per the PR description, it adds opt-in validation of module `baseURL` settings via the `MODULES_VALIDATE_BASE_URL` environment variable, and hardens outbound module HTTP clients — notably by disabling automatic redirect following — to reduce SSRF-style risk across module integrations.

Disabling redirects is the sharper half. Validating a URL at submission time accomplishes little if the fetch then follows a 302 to somewhere else entirely; that's one of the oldest SSRF bypasses there is.

The validation being opt-in is a deliberate tradeoff. Enforcing an allowlist by default would break the legitimate custom-endpoint deployments the feature exists to serve. Self-hosted operators should know it's a flag they need to set.

## A Second Pass

Weaviate later shipped a further fix — [PR #11683](https://github.com/weaviate/weaviate/pull/11683), described as validating `X-*-BaseURL` request headers to close an SSRF bypass, and released in v1.36.19.

Same sink, different entry point. The March work validated the `baseURL` *setting*; the later fix covered the case where request *headers* supply the value. This is the characteristic way SSRF remediation fails: validation gets applied at one input path while the dangerous operation stays reachable through another.

The generalizable advice is to validate at the sink rather than the source. If the outbound HTTP client makes the dangerous request, that's where the check belongs — because enumerating every route by which a URL can arrive is a moving target, and a config option added six months later quietly reopens the hole.

## Defensive Guidance

**Running Weaviate:**

- Upgrade to v1.36.19 or later for both fixes
- Set `MODULES_VALIDATE_BASE_URL` — opt-in protection you haven't enabled isn't protection
- Restrict egress at the security group or firewall level
- Enforce IMDSv2 so metadata access needs a token SSRF alone can't obtain

**Building anything that fetches user-supplied URLs:**

- Allowlist destinations rather than blocklisting; blocklists lose to encoding, redirects, and DNS rebinding
- Validate the resolved IP, not the hostname, and re-check every redirect hop — or disable redirects
- Cover every input path: settings, headers, query parameters, config
- Block private and link-local ranges at the network layer

**Running a managed service:**

- Treat tenant-configurable outbound endpoints as a tenant-to-platform trust boundary
- Assume anything reachable from a tenant workload will eventually be reached
- Strip or normalize internal identifiers before they can leave the perimeter

## Takeaways

**Follow the outbound requests.** Any feature that accepts a URL and fetches it deserves scrutiny — especially in AI infrastructure, where remote endpoint configuration is a headline feature rather than an edge case.

**Multi-tenancy changes the calculus.** The same SSRF that's low-severity in a self-hosted deployment becomes a tenant-isolation question in a managed cloud, because the request now originates inside someone else's network.

**AI infrastructure is under-reviewed relative to its footprint.** Vector databases sit at the center of a lot of production AI, holding proprietary embeddings and wired into internal services, and the security scrutiny hasn't caught up with the deployment curve.

---

*Reported through Weaviate's VDP and acknowledged in their [security hall of fame](https://github.com/weaviate/security-hall-of-fame). Thanks to the Weaviate security team for a professional and honest process.*
