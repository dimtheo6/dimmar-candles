function page() {
  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-6 leading-relaxed text-md [&>div]:text-neutral-600">
      <h1 className="text-2xl font-bold text-center">Privacy Policy</h1>
      <div>
        Dimmar respects your privacy and is committed to protecting your
        personal information. This Privacy Policy explains how we collect, use,
        and safeguard the information you provide when you use our website.
      </div>
      <h2 className="text-lg font-bold">1. Information We Collect</h2>
      <div>We may collect the following types of information:</div>
      <h3 className="text-lg font-bold">a. Personal Information:</h3>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>Name, email address, phone number, billing/shipping address</li>
        <li>
          Payment information (processed securely by third-party payment
          providers)
        </li>
      </ul>
      <h3 className="text-lg font-bold">b. Usage Information:</h3>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          IP address, browser type, device information, pages visited, and
          interactions with our Site
        </li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2 className="text-lg font-bold">2. How We Use Your Information</h2>
      <div>We use the information we collect to:</div>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>Process and fulfill orders</li>
        <li>Communicate with you regarding your orders or inquiries</li>
        <li>Improve our website, services, and marketing</li>
        <li>Comply with legal obligations</li>
      </ul>
      <div>
        We do not sell, rent, or trade your personal information to third
        parties.
      </div>

      <h2 className="text-lg font-bold">3. Sharing Your Information</h2>
      <div>We may share your information with:</div>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>
          <span className="font-bold">Service Providers:</span> Companies that
          help us operate the Site, process payments, deliver products, or
          provide marketing services
        </li>
        <li>
          <span className="font-bold">Legal Requirements:</span> If required by
          law or to protect our rights
        </li>
      </ul>
      <div>
        We ensure that third parties handle your information securely and only
        for the purposes we specify.
      </div>

      <h2 className="text-lg font-bold">4. Cookies and Tracking</h2>
      <div>Our Site uses cookies and similar technologies to:</div>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>Enhance your browsing experience</li>
        <li>Analyze site traffic and usage</li>
        <li>Personalize content and marketing</li>
      </ul>
      <div>
        You can manage your cookie preferences through your browser settings.
        Disabling cookies may affect certain Site features.
      </div>

      <h2 className="text-lg font-bold">5. Data Security</h2>
      <div>
        We implement a variety of security measures to maintain the safety of
        your personal information. However, no method of transmission over the
        Internet or method of electronic storage is 100% secure. Therefore, we
        cannot guarantee its absolute security.
      </div>

      <h2 className="text-lg font-bold">6. Your Rights</h2>
      <div>Depending on your location, you may have the right to:</div>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>Access, correct, or delete your personal information</li>
        <li>Opt-out of marketing communications</li>
        <li>Request restrictions on processing your data</li>
      </ul>
      <div>To exercise these rights, contact us at support@dimmar.com</div>

      <h2 className="text-lg font-bold">7. Children&apos;s Privacy</h2>
      <div>
        Our Site is not intended for children under 13. We do not knowingly
        collect personal information from children. If we learn that we have
        collected such information, we will delete it promptly.
      </div>
      <h2 className="text-lg font-bold">8. Changes to This Policy</h2>
      <div>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page. We encourage you to review this Privacy Policy
        periodically.
      </div>

      <h2 className="text-lg font-bold">Refunds</h2>
      <div>
        Your refund will be credited to your original payment method. Please
        note credit card refunds may take up to 10 days to process, depending on
        your financial institution.
      </div>
    </div>
  );
}

export default page;
