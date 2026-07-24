import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Learn how Sundari Art Jewellery collects, uses, and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="border-b py-9 sm:py-14" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div className="container-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--gold-dim)]">Legal</p>
            <h1 className="display-font mt-3 text-4xl font-semibold italic text-[var(--gold)] sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(245,230,200,0.5)]">
              This Privacy Policy describes how Sundari Art Jewellery collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from our website.
            </p>
            <p className="mt-3 text-xs text-[rgba(245,230,200,0.35)]">Last updated: July 2026</p>
          </div>
        </div>
      </div>

      <div className="container-shell py-9 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-12">

          {/* Intro */}
          <section>
            <p className="text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              For purposes of this Privacy Policy, &ldquo;you&rdquo; and &ldquo;your&rdquo; means you as the user of our services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Please read this Privacy Policy carefully. By using and accessing any of our services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use or access any of our services.
            </p>
          </section>

          <Divider />

          {/* Changes */}
          <section>
            <SectionHeading title="Changes to This Privacy Policy" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the site, update the &ldquo;Last updated&rdquo; date and take any other steps required by applicable law.
            </p>
          </section>

          <Divider />

          {/* How We Collect */}
          <section>
            <SectionHeading title="How We Collect and Use Your Personal Information" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              To provide our services, we collect personal information about you from a variety of sources as set out below. The information that we collect and use varies depending on how you interact with us.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve our services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend our rights and the rights of our users or others.
            </p>
          </section>

          <Divider />

          {/* What We Collect */}
          <section>
            <SectionHeading title="What Personal Information We Collect" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              The types of personal information we obtain about you depends on how you interact with our site and use our services. When we use the term &ldquo;personal information&rdquo;, we are referring to information that identifies, relates to, describes or can be associated with you.
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[rgba(201,169,110,0.8)]">→ Information We Collect Directly from You</p>
                <p className="mb-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">Information that you directly submit to us through our services may include:</p>
                <ul className="space-y-3">
                  {[
                    "Contact details including your name, address, phone number, and email.",
                    "Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number.",
                    "Account information including your username, password, security questions and other information used for account security purposes.",
                    "Customer support information including the information you choose to include in communications with us.",
                  ].map((item) => (
                    <BulletItem key={item} text={item} />
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                  Some features of our services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.
                </p>
              </div>

              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[rgba(201,169,110,0.8)]">→ Information We Collect about Your Usage</p>
                <p className="text-sm leading-7 text-[rgba(245,230,200,0.65)]">
                  We may automatically collect certain information about your interaction with our services (&ldquo;Usage Data&rdquo;). To do this, we may use cookies, pixels and similar technologies. Usage Data may include information about how you access and use our site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with our services.
                </p>
              </div>

              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[rgba(201,169,110,0.8)]">→ Information We Obtain from Third Parties</p>
                <p className="mb-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">We may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:</p>
                <ul className="space-y-3">
                  {[
                    "Companies who support our site and services.",
                    "Our payment processors, who collect payment information (e.g., bank account, credit or debit card information, billing address) to process your payment in order to fulfil your orders.",
                    "When you visit our site, open or click on emails we send you, or interact with our services or advertisements, we or third parties we work with may automatically collect certain information using online tracking technologies such as pixels, web beacons, and cookies.",
                  ].map((item) => (
                    <BulletItem key={item} text={item} />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Divider />

          {/* How We Use */}
          <section>
            <SectionHeading title="How We Use Your Personal Information" />
            <div className="mt-6 space-y-6">
              {[
                {
                  title: "Providing Products and Services",
                  text: "We use your personal information to provide you with our services, including to process your payments, fulfil your orders, send notifications related to your account, purchases, returns and exchanges, create and manage your account, arrange for shipping, and facilitate returns and exchanges.",
                },
                {
                  title: "Marketing and Advertising",
                  text: "We may use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you advertisements for products or services. This may include using your personal information to better tailor our services and advertising.",
                },
                {
                  title: "Security and Fraud Prevention",
                  text: "We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity. If you register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password, or other access details with anyone else. If you believe your account has been compromised, please contact us immediately.",
                },
                {
                  title: "Communicating with You and Service Improvement",
                  text: "We use your personal information to provide you with customer support and improve our services. This is in our legitimate interests in order to be responsive to you, to provide effective services to you, and to maintain our business relationship with you.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-sm border p-5" style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.03)" }}>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">{item.title}</p>
                  <p className="text-sm leading-7 text-[rgba(245,230,200,0.65)]">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Cookies */}
          <section>
            <SectionHeading title="Cookies" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Like many websites, we use cookies on our site. We use cookies to power and improve our site and services (including to remember your actions and preferences), to run analytics and better understand user interaction with our services. We may also permit third-party service providers to use cookies on our site to better tailor the services, products and advertising on our site and other websites.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Most browsers automatically accept cookies by default, but you can choose to set your browser to remove or reject cookies through your browser controls. Please keep in mind that removing or blocking cookies can negatively impact your user experience and may cause some of our services, including certain features and general functionality, to work incorrectly or no longer be available.
            </p>
          </section>

          <Divider />

          {/* How We Disclose */}
          <section>
            <SectionHeading title="How We Disclose Personal Information" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              In certain circumstances, we may disclose your personal information to third parties for contract fulfilment purposes, legitimate purposes and other reasons subject to this Privacy Policy. Such circumstances may include:
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "With vendors or other third parties who perform services on our behalf (e.g., IT management, payment processing, data analytics, customer support, cloud storage, fulfilment and shipping).",
                "With business and marketing partners to provide services and advertise to you. Our business and marketing partners will use your information in accordance with their own privacy notices.",
                "When you direct, request or otherwise consent to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations.",
                "With our affiliates or otherwise within our corporate group, in our legitimate interests to run a successful business.",
                "In connection with a business transaction such as a merger or acquisition, to comply with any applicable legal obligations, to enforce any applicable terms of service, and to protect or defend our rights and the rights of our users or others.",
              ].map((item) => (
                <BulletItem key={item} text={item} />
              ))}
            </ul>
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              We do not use or disclose sensitive personal information without your consent or for the purposes of inferring characteristics about you.
            </p>
          </section>

          <Divider />

          {/* Third Party Links */}
          <section>
            <SectionHeading title="Third-Party Websites and Links" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Our site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators.
            </p>
          </section>

          <Divider />

          {/* Children */}
          <section>
            <SectionHeading title="Children's Data" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Our services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              We do not knowingly sell or share personal information of individuals under 16 years of age.
            </p>
          </section>

          <Divider />

          {/* Security */}
          <section>
            <SectionHeading title="Security and Retention of Your Information" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee absolute security. In addition, any information you send to us may not be secure while in transit. We recommend that you do not use insecure channels to communicate sensitive or confidential information to us.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide our services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.
            </p>
          </section>

          <Divider />

          {/* Your Rights */}
          <section>
            <SectionHeading title="Your Rights" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Right to Access / Know", text: "You may request access to personal information that we hold about you, including details relating to the ways in which we use and share your information." },
                { title: "Right to Delete", text: "You may request that we delete personal information we maintain about you." },
                { title: "Right to Correct", text: "You may request that we correct inaccurate personal information we maintain about you." },
                { title: "Right of Portability", text: "You may request a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances." },
                { title: "Restriction of Processing", text: "You may ask us to stop or restrict our processing of personal information." },
                { title: "Withdrawal of Consent", text: "Where we rely on consent to process your personal information, you may withdraw this consent at any time." },
                { title: "Right to Appeal", text: "You may have a right to appeal our decision if we decline to process your request by replying directly to our denial." },
                { title: "Communication Preferences", text: "You may opt out of promotional emails at any time using the unsubscribe option. We may still send non-promotional emails about your account or orders." },
              ].map((right) => (
                <div key={right.title} className="rounded-sm border p-4" style={{ borderColor: "rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.03)" }}>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">{right.title}</p>
                  <p className="text-xs leading-6 text-[rgba(245,230,200,0.6)]">{right.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              You may exercise any of these rights by contacting us using the contact details provided below. We will not discriminate against you for exercising any of these rights. We may need to collect information from you to verify your identity before providing a substantive response to the request.
            </p>
          </section>

          <Divider />

          {/* Complaints */}
          <section>
            <SectionHeading title="Complaints" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              If you have complaints about how we process your personal information, please contact us using the contact details provided below. If you are not satisfied with our response to your complaint, depending on where you live you may have the right to lodge your complaint with your local data protection authority.
            </p>
          </section>

          <Divider />

          {/* International */}
          <section>
            <SectionHeading title="International Users" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              Please note that we may transfer, store and process your personal information outside the country you live in. Your personal information is also processed by staff and third-party service providers and partners in these countries.
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              If we transfer your personal information out of Europe, we will rely on recognised transfer mechanisms like the European Commission&rsquo;s Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection.
            </p>
          </section>

          <Divider />

          {/* Contact */}
          <section>
            <SectionHeading title="Contact Us" />
            <p className="mt-5 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
              If you have any questions or concerns about this Privacy Policy or our data practices, or if you would like to exercise any of your rights, please contact us through our website&rsquo;s contact page. We are committed to addressing your concerns promptly and transparently.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-0.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
      <h2 className="display-font text-2xl font-semibold italic text-[var(--gold)]">{title}</h2>
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-sm leading-7 text-[rgba(245,230,200,0.65)]">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold-dim)]" />
      {text}
    </li>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
    />
  );
}
