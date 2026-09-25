import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TallWoodMaker collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "September 25, 2026";

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "1. Who We Are",
    paragraphs: [
      "TallWoodMaker s.r.o., with its registered seat at Karpatske namestie 10A, 831 06 Bratislava - mestska cast Raca, Slovak Republic, registered in the Commercial Register of the Municipal Court Bratislava III, Section: Sro, Insert No. 123218/B, Company ID (ICO): 51151201, Tax ID (DIC): 2120609293 ('TallWoodMaker', 'we', 'us', or 'our'), is the data controller responsible for the personal data described in this Privacy Policy, collected through tallwoodmaker.com and the Shop, Premium, and Courses services described in our Terms of Service.",
      "Contact for privacy matters: tom@tallwoodmaker.com.",
    ],
  },
  {
    heading: "2. What Personal Data We Collect",
    paragraphs: [
      "Account and sign-in data: your email address, used to send you a magic sign-in link and to identify your Premium membership.",
      "Order and billing data: when you buy a product or subscribe to Premium, our payment processor Stripe collects your name, email address, billing address, and payment card details on our behalf; we ourselves only see your email address, order details, and subscription status — never your full card number.",
      "Content you send us: if you use the contact form or email us, we collect the name, email address, and message you provide, to respond to you.",
      "Technical and usage data: standard web-server logs (such as IP address and browser type), and, only if you have opted in via the cookie banner, analytics data about how you use the site (Section 5).",
    ],
  },
  {
    heading: "3. How We Use Your Data and Legal Bases",
    paragraphs: [
      "We use your personal data to: create and manage your account and Premium access; process orders and payments and deliver digital products; send you transactional emails (such as your sign-in link, order confirmation, or a reply to your message); keep our systems secure and prevent fraud; and, only with your consent, measure site usage and show relevant marketing.",
      "Our legal bases under the GDPR are: performance of a contract (Article 6(1)(b)) for account, order, and subscription data; legal obligation (Article 6(1)(c)) for data we must keep for accounting and tax purposes; legitimate interest (Article 6(1)(f)) for basic security logs and fraud prevention; and consent (Article 6(1)(a)) for analytics and marketing cookies, which you can withdraw at any time (Section 4).",
    ],
  },
  {
    heading: "4. Cookies and Tracking",
    paragraphs: [
      "We use a first-party cookie to remember your cookie choice, plus, only if you opt in through the cookie banner, Google Analytics (to understand site usage) and Meta Pixel (to measure and personalize ads). Necessary cookies from Supabase and Stripe keep you signed in and protect checkout from fraud. For the full, current list of every cookie we use, its purpose, and how long it lasts, see our separate Cookie Policy page. You can change your choice at any time using the cookie settings link in the site footer.",
    ],
  },
  {
    heading: "5. Who We Share Data With",
    paragraphs: [
      "We share personal data only with service providers who need it to help us run tallwoodmaker.com, and never sell your personal data:",
      "Stripe, Inc. — processes your payment and billing details to complete purchases and subscriptions.",
      "Supabase — hosts our user accounts/authentication and application database.",
      "Google Analytics (Google LLC) — only if you opt in, processes usage data to help us understand how the site is used.",
      "Meta Pixel (Meta Platforms, Inc.) — only if you opt in, processes usage data for ad measurement and personalization.",
      "We may also disclose personal data where required by law, for example to tax or law-enforcement authorities.",
    ],
  },
  {
    heading: "6. International Data Transfers",
    paragraphs: [
      "Some of our service providers (including Stripe and Google) are based in, or transfer data to, the United States. Where personal data is transferred outside the European Economic Area, we rely on the safeguards those providers offer to their customers, such as the EU Standard Contractual Clauses or an equivalent adequacy mechanism recognized under the GDPR.",
    ],
  },
  {
    heading: "7. Data Retention",
    paragraphs: [
      "We keep account data for as long as your account is active, and for a reasonable period afterward in case you return. Order, invoice, and payment records are kept for as long as required by Slovak accounting and tax law (generally up to 10 years). Contact-form messages and email correspondence are kept only as long as needed to handle your inquiry, unless a longer period is required by law. Analytics and marketing cookie data is kept for the periods shown on our Cookie Policy page, and is deleted or anonymized after that.",
    ],
  },
  {
    heading: "8. Your Rights Under GDPR",
    paragraphs: [
      "If you are located in the European Economic Area, you have the right to: request access to the personal data we hold about you; ask us to correct inaccurate data; ask us to delete your data (subject to what we must legally keep, such as invoices); ask us to restrict or object to certain processing; receive your data in a portable format; and withdraw consent at any time for analytics or marketing cookies, without affecting the lawfulness of processing before you withdrew it.",
      "To exercise any of these rights, email us at tom@tallwoodmaker.com. If you are not satisfied with our response, you have the right to lodge a complaint with the Slovak Data Protection Authority (Urad na ochranu osobnych udajov Slovenskej republiky, www.dataprotection.gov.sk) or with the supervisory authority in your own EU country of residence.",
    ],
  },
  {
    heading: "9. Children",
    paragraphs: [
      "Our Services are directed at a general, adult audience and are not intended for children. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us at tom@tallwoodmaker.com and we will delete it.",
    ],
  },
  {
    heading: "10. Changes to This Policy and Contact",
    paragraphs: [
      "We may update this Privacy Policy from time to time, for example to reflect a new feature or a change in the law. We will post the updated policy on this page with a new 'last updated' date; if a change is material, we will also make reasonable efforts to notify you (for example, by email to registered users).",
      "Controller contact:",
      "TallWoodMaker s.r.o. Karpatske namestie 10A, 831 06 Bratislava - mestska cast Raca, Slovak Republic ICO: 51151201 - DIC: 2120609293 Registered in the Commercial Register of the Municipal Court Bratislava III, Section: Sro, Insert No. 123218/B Email: tom@tallwoodmaker.com",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Privacy Policy
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Last updated: {LAST_UPDATED}
        </p>
      </section>

      <section className="container-page section-px grid gap-10 border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        {SECTIONS.map((section) => (
          <div key={section.heading} className="max-w-[720px]">
            <h2 className="mb-3 text-xl font-bold">{section.heading}</h2>
            <div className="grid gap-3">
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[15px] leading-[1.6] text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        <p className="max-w-[720px] text-[14px] leading-[1.6] text-ink-muted">
          Questions about this policy, or want to exercise your rights? Email{" "}
          <a href="mailto:tom@tallwoodmaker.com" className="underline">
            tom@tallwoodmaker.com
          </a>
          . See also our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/cookies" className="underline">
            Cookie Policy
          </Link>
          .
        </p>
      </section>
    </>
  );
}
