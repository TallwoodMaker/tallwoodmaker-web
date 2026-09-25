import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern purchases in the Shop, TallWoodMaker Premium, and Courses on tallwoodmaker.com.",
};

const LAST_UPDATED = "September 25, 2026";

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "1. Who We Are and Acceptance of These Terms",
    paragraphs: [
      "These Terms of Service (the 'Terms') govern your use of the website tallwoodmaker.com and all products and services offered on it, including the online shop, TallWoodMaker Premium membership, and any online courses (together, the 'Services'). The Services are operated by:",
      "TallWoodMaker s.r.o., with its registered seat at Karpatske namestie 10A, 831 06 Bratislava - mestska cast Raca, Slovak Republic, registered in the Commercial Register of the Municipal Court Bratislava III, Section: Sro, Insert No. 123218/B, Company ID (ICO): 51151201, Tax ID (DIC): 2120609293 ('TallWoodMaker', 'we', 'us', or 'our').",
      "TallWoodMaker s.r.o. is not currently registered as a VAT payer in the Slovak Republic.",
      "By creating an account, placing an order, or otherwise using the Services, you agree to be bound by these Terms. If you do not agree, please do not use the Services. If you are using the Services on behalf of a business, you confirm you have authority to bind that business to these Terms.",
      "These Terms apply to consumers and business users worldwide who purchase from or use tallwoodmaker.com. Where you are a consumer resident in the European Union, nothing in these Terms limits any protection granted to you by the mandatory consumer-protection laws of your country of residence.",
    ],
  },
  {
    heading: "2. Our Services",
    paragraphs: [
      "tallwoodmaker.com currently offers three kinds of Services, each also governed by its own section below:",
      "1. Shop — one-time purchases of digital products such as ebooks and dimensioned building plans, delivered electronically (Section 3).",
      "2. Premium — a recurring paid membership giving access to member-only content (Section 5).",
      "3. Courses — structured paid educational content, offered from time to time (Section 6).",
      "We may add, change, or discontinue individual products or features within the Services at any time. Section 11 explains how we handle changes to these Terms themselves.",
    ],
  },
  {
    heading: "3. Digital Products (Shop)",
    paragraphs: [
      "3.1 Ordering. When you buy a product in the Shop, you are making an offer to purchase, which we accept by processing payment through our payment provider (Stripe) and granting you access to download the product. A contract is formed once payment is confirmed.",
      "3.2 Delivery. Digital products are delivered electronically — typically by an immediate download link and/or by email — with no physical shipment. You are responsible for providing a valid email address and for keeping any downloaded files.",
      "3.3 License granted. On successful payment, we grant you a limited, personal, non-exclusive, non-transferable license to use the purchased ebook or plan for your own personal or business woodworking projects, including building and selling the physical items you make using a purchased plan. This license does not permit you to resell, share, publish, redistribute, or otherwise make the digital file itself (or substantial extracts of it) available to any third party, whether for payment or free of charge.",
      "3.4 No refunds after download, subject to Section 4. Because digital products are delivered instantly, see Section 4 for how your statutory right of withdrawal applies and how it can be waived.",
    ],
  },
  {
    heading: "4. Right of Withdrawal",
    paragraphs: [
      "4.1 Your statutory right. If you are a consumer contracting from the European Union, you generally have the right to withdraw from a distance contract within 14 days without giving any reason, under Slovak Act No. 102/2014 Coll. (implementing EU Directive 2011/83/EU).",
      "4.2 Digital content delivered immediately. Because Shop products are digital content not supplied on a tangible medium, this right of withdrawal does not apply once we have started delivering the product, provided that you gave your prior express consent to immediate delivery and acknowledged that you thereby lose your right of withdrawal. At checkout, you will be asked to confirm a statement to this effect (for example: 'I request immediate access to this digital content and I acknowledge that I lose my right of withdrawal once delivery begins') before your download is unlocked. If you do not give this consent, we cannot deliver the product to you immediately.",
      "4.3 If consent was not given. In the rare case a digital product is not delivered immediately, you may withdraw within 14 days of the order by emailing us at tom@tallwoodmaker.com, and we will refund you using the original payment method.",
      "4.4 Non-EU customers. If you are not contracting as a consumer from the European Union, statutory withdrawal rights may not apply, and purchases of digital products are final once delivered, except as required by the mandatory law of your own country.",
    ],
  },
  {
    heading: "5. TallWoodMaker Premium (Subscription)",
    paragraphs: [
      "5.1 What it is. TallWoodMaker Premium is a recurring paid membership that gives you access to member-only content on tallwoodmaker.com for as long as your subscription is active, at the price shown on the subscription page at the time you sign up.",
      "5.2 Billing. Premium is billed automatically in advance on a recurring basis (currently monthly) to the payment method you provide, through Stripe, until you cancel. We may offer promotional or discounted pricing for an initial period; the standard price applies after that period ends.",
      "5.3 Cancellation. You may cancel at any time from your account. Cancellation takes effect at the end of the billing period you have already paid for; you keep access until then, and you will not be charged again afterward. We do not provide partial refunds for the unused portion of a billing period you choose to cancel mid-cycle, except as set out in 5.4.",
      "5.4 Right of withdrawal for the subscription. As a consumer contracting from the EU, you may withdraw from your first Premium subscription within 14 days of signing up. If you ask us to give you immediate access and acknowledge that this may cost you money, and you then withdraw before the 14 days are up, you owe us a proportional amount for the days of access already provided, calculated from the full subscription price; the remainder, if any, will be refunded. If we do not have your consent to immediate access, access is delayed until the 14-day period ends.",
      "5.5 Changes and suspension. We may suspend or terminate your access if payment fails and is not resolved within a reasonable time, or if you materially breach these Terms (see Section 8). We will give reasonable notice of any price increase before it applies to you, and you may cancel before the new price takes effect.",
    ],
  },
  {
    heading: "6. Online Courses",
    paragraphs: [
      "We may from time to time offer paid online courses. Unless stated otherwise for a specific course, courses are treated as digital content or digital services under these Terms: Section 3 (license), Section 4 (right of withdrawal for one-time course purchases) and Section 5.4 (right of withdrawal for any course sold on a subscription basis) apply to courses in the same way they apply to Shop products and Premium, respectively. Specific pricing, format, and access duration for a course will be described on that course's own order page, and that description forms part of your contract with us for that course.",
    ],
  },
  {
    heading: "7. Prices, Payment and Taxes",
    paragraphs: [
      "7.1 Prices. All prices on tallwoodmaker.com are shown in euros (EUR). TallWoodMaker s.r.o. is not currently registered as a VAT payer, so the prices shown are final amounts and do not include a VAT breakdown. This may change if our turnover requires VAT or One Stop Shop (OSS) registration in the future, in which case prices and invoices will be updated accordingly and this section will be revised.",
      "7.2 Payment processing. All payments are processed securely by Stripe, an independent third-party payment processor. We do not store your full card details. Stripe's own terms and privacy practices apply to the payment process.",
      "7.3 Currency and fees. If your payment method charges in a different currency, your bank or card provider may apply conversion rates and fees that are outside our control.",
    ],
  },
  {
    heading: "8. Intellectual Property and Acceptable Use",
    paragraphs: [
      "8.1 Ownership. All content on tallwoodmaker.com — including videos, articles, plans, ebooks, photos, graphics, and the site design itself — is owned by TallWoodMaker s.r.o. or licensed to it, and is protected by copyright and other intellectual-property laws. Except for the limited license granted in Section 3.3 (Shop) and the access granted under Section 5 (Premium), no rights are transferred to you.",
      "8.2 Accounts. If you create an account (for example, to access Premium), you are responsible for keeping your login credentials confidential and for all activity under your account. A Premium account is for your own personal use and may not be shared with or transferred to anyone else.",
      "8.3 Acceptable use. When using the Services, you agree not to: (a) copy, scrape, mirror, or redistribute site content beyond the license granted to you; (b) circumvent any access or payment restriction; (c) upload or transmit unlawful, infringing, or harmful content in any comment or interactive feature; (d) attempt to disrupt or gain unauthorized access to the Services or our systems; or (e) use the Services for any unlawful purpose. We may suspend or terminate access for users who breach this section.",
    ],
  },
  {
    heading: "9. Disclaimers and Limitation of Liability",
    paragraphs: [
      "9.1 Educational content, use at your own risk. Videos, plans, ebooks, and courses are provided for general educational and informational purposes about woodworking. Woodworking involves the use of power tools and machinery and carries an inherent risk of injury or property damage. You are solely responsible for following applicable safety practices, manufacturer instructions for your own tools, and any local building, electrical, or safety codes. TallWoodMaker is not liable for any injury, loss, or damage arising from your use of, or reliance on, content or plans provided through the Services.",
      "9.2 No warranty. The Services and all content are provided 'as is' and 'as available', without warranties of any kind, express or implied, including as to accuracy, fitness for a particular purpose, or that a plan will be suitable for your specific materials, tools, or skill level, except where such a warranty cannot be excluded by mandatory law.",
      "9.3 Limitation of liability. To the maximum extent permitted by law, TallWoodMaker's total liability to you for any claim arising from these Terms or the Services is limited to the amount you paid us in the 12 months before the claim, and we are not liable for indirect, incidental, or consequential losses. Nothing in this Section 9 limits liability that cannot be limited or excluded under mandatory law, including liability for death or personal injury caused by our negligence, for fraud, or any statutory consumer-protection rights that cannot be waived.",
    ],
  },
  {
    heading: "10. Governing Law and Dispute Resolution",
    paragraphs: [
      "10.1 Governing law. These Terms, and any contract formed under them, are governed by the laws of the Slovak Republic, without regard to conflict-of-law rules. If you are a consumer habitually resident in another EU member state, this choice of law does not deprive you of the protection of any mandatory consumer-protection provisions of the law of your own country of residence.",
      "10.2 Complaints. If something is wrong with your order or your Premium access, please contact us first at tom@tallwoodmaker.com so we can try to resolve it directly.",
      "10.3 Out-of-court dispute resolution. If you are a consumer and we cannot resolve a complaint directly, you may contact the Slovak Trade Inspection (Slovenska obchodna inspekcia, SOI, www.soi.sk), the body responsible for out-of-court resolution of consumer disputes in the Slovak Republic. The European Commission's former 'ODR platform' for online disputes was discontinued on 20 July 2025; consumers in other EU countries can find their national alternative dispute resolution (ADR) body through the European Commission's Consumer Redress in the EU portal at consumer-redress.ec.europa.eu.",
      "10.4 Courts. Subject to 10.1 and 10.3, any dispute that is not resolved out of court may be brought before the competent courts of the Slovak Republic, without prejudice to any right you have as a consumer to bring proceedings in the courts of your own country of residence.",
    ],
  },
  {
    heading: "11. Changes to These Terms and Contact",
    paragraphs: [
      "11.1 Changes. We may update these Terms from time to time, for example to reflect changes in our Services or the law. We will post the updated Terms on this page with a new 'last updated' date. For material changes affecting an active Premium subscription (such as a price increase), we will also notify you in advance by email, and you may cancel before the change takes effect, as described in Section 5.5. Continuing to use the Services after a change takes effect means you accept the updated Terms.",
      "11.2 Contact us.",
      "TallWoodMaker s.r.o. Karpatske namestie 10A, 831 06 Bratislava - mestska cast Raca, Slovak Republic ICO: 51151201 - DIC: 2120609293 Registered in the Commercial Register of the Municipal Court Bratislava III, Section: Sro, Insert No. 123218/B Email: tom@tallwoodmaker.com",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Terms of Service
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
          Questions about these Terms? Email{" "}
          <a href="mailto:tom@tallwoodmaker.com" className="underline">
            tom@tallwoodmaker.com
          </a>
          . See also our{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
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
