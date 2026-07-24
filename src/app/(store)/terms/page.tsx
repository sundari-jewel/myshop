import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: "Terms and conditions governing the use of Sundari Art Jewellery's website and services.",
  path: "/terms",
});

const SECTIONS = [
  {
    title: "Overview",
    content: `This website is operated by Sundari Art Jewellery. Throughout the site, the terms "we", "us" and "our" refer to Sundari Art Jewellery. We offer this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.

By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.

Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.

Any new features or tools which are added to the current store shall also be subject to these Terms of Service. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.`,
  },
  {
    title: "Section 1 — Online Store Terms",
    items: [
      "By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you have given consent to allow any of your minor dependents to use this site.",
      "You may not use our products for any illegal or unauthorised purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).",
      "You must not transmit any worms, viruses or any code of a destructive nature.",
      "A breach or violation of any of the Terms will result in an immediate termination of your Services.",
    ],
  },
  {
    title: "Section 2 — General Conditions",
    items: [
      "We reserve the right to refuse service to anyone for any reason at any time.",
      "You understand that your content (not including payment information) may be transferred unencrypted and involve transmissions over various networks. Payment information is always encrypted during transfer.",
      "You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.",
      "The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.",
    ],
  },
  {
    title: "Section 3 — Accuracy, Completeness and Timeliness of Information",
    content: `We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions without consulting more accurate or timely sources of information. Any reliance on the material on this site is at your own risk.

This site may contain certain historical information which is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.`,
  },
  {
    title: "Section 4 — Modifications to the Service and Prices",
    items: [
      "Prices for our products are subject to change without notice.",
      "We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice.",
      "We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.",
    ],
  },
  {
    title: "Section 5 — Products and Services",
    content: `Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Refund Policy.

We have made every effort to display as accurately as possible the colours and images of our products that appear on the site. We cannot guarantee that your device's display of any colour will be accurate.

We reserve the right to limit the sales of our products or services to any person, geographic region or jurisdiction. All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.

We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.`,
  },
  {
    title: "Section 6 — Accuracy of Billing and Account Information",
    content: `We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or phone number provided at the time the order was made.

You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address, so that we can complete your transactions and contact you as needed.`,
  },
  {
    title: "Section 7 — Optional Tools",
    content: `We may provide you with access to third-party tools over which we neither monitor nor have any control nor input. You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.

Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).`,
  },
  {
    title: "Section 8 — Third-Party Links",
    content: `Certain content, products and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.

We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.`,
  },
  {
    title: "Section 9 — User Comments and Submissions",
    content: `If, at our request or on your own initiative, you send creative ideas, suggestions, proposals, plans, or other materials (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are under no obligation to maintain any comments in confidence, pay compensation for any comments, or respond to any comments.

We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, defamatory, or otherwise objectionable.

You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, or other personal or proprietary rights. You are solely responsible for any comments you make and their accuracy.`,
  },
  {
    title: "Section 10 — Personal Information",
    content: `Your submission of personal information through the store is governed by our Privacy Policy. By using this website you consent to the collection and use of your information as described therein.`,
  },
  {
    title: "Section 11 — Errors, Inaccuracies and Omissions",
    content: `Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service is inaccurate at any time without prior notice (including after you have submitted your order).`,
  },
  {
    title: "Section 12 — Prohibited Uses",
    content: `In addition to other prohibitions set forth in these Terms of Service, you are prohibited from using the site or its content:`,
    items: [
      "For any unlawful purpose.",
      "To solicit others to perform or participate in any unlawful acts.",
      "To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances.",
      "To infringe upon or violate our intellectual property rights or the intellectual property rights of others.",
      "To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.",
      "To submit false or misleading information.",
      "To upload or transmit viruses or any other type of malicious code.",
      "To collect or track the personal information of others.",
      "To spam, phish, pharm, pretext, spider, crawl, or scrape.",
      "For any obscene or immoral purpose.",
      "To interfere with or circumvent the security features of the Service or any related website.",
    ],
  },
  {
    title: "Section 13 — Disclaimer of Warranties & Limitation of Liability",
    content: `We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely, secure or error-free. We do not warrant that the results that may be obtained from the use of the Service will be accurate or reliable.

You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service and all products and services delivered to you through the Service are provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied.

In no case shall Sundari Art Jewellery, our directors, officers, employees, affiliates, agents, contractors, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the Service or any products procured using the Service.`,
  },
  {
    title: "Section 14 — Indemnification",
    content: `You agree to indemnify, defend and hold harmless Sundari Art Jewellery and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or your violation of any law or the rights of a third-party.`,
  },
  {
    title: "Section 15 — Severability",
    content: `In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service. Such determination shall not affect the validity and enforceability of any other remaining provisions.`,
  },
  {
    title: "Section 16 — Termination",
    content: `The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.

These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.

If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination.`,
  },
  {
    title: "Section 17 — Entire Agreement",
    content: `These Terms of Service and any policies or operating rules posted by us on this site constitute the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us.

Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.`,
  },
  {
    title: "Section 18 — Governing Law",
    content: `These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.`,
  },
  {
    title: "Section 19 — Changes to Terms of Service",
    content: `You can review the most current version of the Terms of Service at any time on this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. Your continued use of or access to our website following the posting of any changes constitutes acceptance of those changes.`,
  },
  {
    title: "Section 20 — Contact Information",
    content: `Questions about the Terms of Service should be sent to us via our contact page or by reaching out to our customer support team. We are committed to resolving any concerns promptly and transparently.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="border-b py-9 sm:py-14" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Legal</p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              Please read these terms carefully before using our website or placing an order with Sundari Art Jewellery.
            </p>
            <p className="mt-3 text-xs text-[rgba(245,230,200,0.35)]">Last updated: July 2026</p>
          </div>
        </div>
      </div>

      <div className="container-shell py-9 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-10 sm:space-y-14">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <SectionHeading title={section.title} />
              {section.content && (
                <div className="mt-5 space-y-4">
                  {section.content.split("\n\n").map((para, j) => (
                    <p key={j} className="text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                      {para}
                    </p>
                  ))}
                </div>
              )}
              {section.items && (
                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold-dim)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {i < SECTIONS.length - 1 && <Divider />}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-1 flex items-center gap-3">
      <span className="h-5 w-0.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
      <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">{title}</h2>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mt-10 h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
    />
  );
}
