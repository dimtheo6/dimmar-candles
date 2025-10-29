import Link from "next/link";

function page() {
  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-6 leading-relaxed text-md [&>div]:text-neutral-600">
      <h1 className="text-2xl font-bold text-center">Terms of Service</h1>
      <div>
        Welcome to Dimmar. By accessing or using our website, you agree to
        comply with and be bound by these Terms of Use. If you do not agree, you
        must not use the Site.
      </div>
      <h2 className="text-lg font-bold">1. Use of the Site</h2>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          You may use the Site only for lawful purposes and in accordance with
          these Terms.
        </li>
        <li>
          You must not use the Site in any way that could damage, disable,
          overburden, or impair the Site, or interfere with other users&apos;
          access.
        </li>
        <li>
          You may not attempt to gain unauthorized access to any part of the
          Site, other accounts, computer systems, or networks.
        </li>
      </ul>

      <h2 className="text-lg font-bold">2. Products and Services</h2>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          We aim to accurately display product information, including pricing,
          availability, and descriptions. However, errors may occur.
        </li>
        <li>Prices and availability are subject to change without notice.</li>
        <li>
          All orders are subject to our acceptance. We may refuse or cancel
          orders for any reason, including errors in pricing or product
          descriptions.
        </li>
      </ul>

      <h2 className="text-lg font-bold">3. Intellectual Property</h2>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          All content on the Site, including text, graphics, logos, images,
          videos, and software, is the property of dimmar or its licensors and
          is protected by copyright and other intellectual property laws.
        </li>
        <li>
          You may not copy, modify, distribute, display, or create derivative
          works from any content on the Site without our prior written consent.
        </li>
      </ul>

      <h2 className="text-lg font-bold">4. Disclaimers</h2>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          The Site and its content are provided “as is” and “as available.”
        </li>
        <li>
          We make no warranties, express or implied, about the accuracy,
          reliability, or availability of the Site or the products and services
          offered.
        </li>
        <li>Your use of the Site is at your own risk.</li>
      </ul>

      <h2 className="text-lg font-bold">5. Limitation of Liability</h2>

      <div>
        To the maximum extent permitted by law, [Your Company Name] shall not be
        liable for any direct, indirect, incidental, consequential, or special
        damages arising from or in connection with your use of the Site or
        products purchased.
      </div>

      <h2 className="text-lg font-bold">6. Privacy</h2>
      <div>
        Our{" "}
        <Link href="/privacy-policy" className="underline font-bold">
          Privacy Policy
        </Link>{" "}
        explains how we collect, use, and protect your personal information. By
        using the Site, you consent to our Privacy Policy.
      </div>

      <h2 className="text-lg font-bold">7. Third-Party Links</h2>
      <div>
        The Site may contain links to third-party websites. We are not
        responsible for the content, products, or services provided by these
        websites. Access them at your own risk.
      </div>
      <h2 className="text-lg font-bold">8. Governing Law</h2>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          These Terms are governed by and construed in accordance with the laws
          of Australia.
        </li>
        <li>
          You agree to submit to the exclusive jurisdiction of the courts in
          your state or territory for any disputes arising from these Terms.
        </li>
      </ul>
      <h2 className="text-lg font-bold">9. Changes to Terms</h2>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          We may update these Terms from time to time. Changes will be posted on
          this page.
        </li>
        <li>
          Your continued use of the Site after any changes constitutes your
          acceptance of the updated Terms.
        </li>
      </ul>
    </div>
  );
}

export default page;
