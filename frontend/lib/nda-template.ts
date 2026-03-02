import { NdaFormData } from "./nda-types";

const BLANK_PLACEHOLDER = "___________";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateStr: string): string {
  if (!dateStr) return BLANK_PLACEHOLDER;
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function blank(value: string, placeholder: string = BLANK_PLACEHOLDER): string {
  return value.trim() ? escapeHtml(value) : placeholder;
}

export function renderCoverPage(data: NdaFormData): string {
  const mndaTerm =
    data.mndaTermType === "expires"
      ? `Expires ${blank(data.mndaTermDuration)} from Effective Date.`
      : "Continues until terminated in accordance with the terms of the MNDA.";

  const confidentialityTerm =
    data.confidentialityTermType === "fixed"
      ? `${blank(data.confidentialityTermDuration)} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : "In perpetuity.";

  return `
    <div class="cover-page">
      <h1>Mutual Non-Disclosure Agreement</h1>

      <p class="intro">
        This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page
        (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms
        Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at
        commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms should be made
        on the Cover Page, which will control over conflicts with the Standard Terms.
      </p>

      <div class="field-section">
        <h3>Purpose</h3>
        <p class="field-label">How Confidential Information may be used</p>
        <p>${blank(data.purpose)}</p>
      </div>

      <div class="field-section">
        <h3>Effective Date</h3>
        <p>${formatDate(data.effectiveDate)}</p>
      </div>

      <div class="field-section">
        <h3>MNDA Term</h3>
        <p class="field-label">The length of this MNDA</p>
        <p>${mndaTerm}</p>
      </div>

      <div class="field-section">
        <h3>Term of Confidentiality</h3>
        <p class="field-label">How long Confidential Information is protected</p>
        <p>${confidentialityTerm}</p>
      </div>

      <div class="field-section">
        <h3>Governing Law &amp; Jurisdiction</h3>
        <p><strong>Governing Law:</strong> ${blank(data.governingLaw, "[State]")}</p>
        <p><strong>Jurisdiction:</strong> ${blank(data.jurisdiction, "[City/County and State]")}</p>
      </div>

      ${
        data.modifications.trim()
          ? `<div class="field-section">
              <h3>MNDA Modifications</h3>
              <p>${escapeHtml(data.modifications)}</p>
            </div>`
          : ""
      }

      <p>By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.</p>

      <table class="signature-table">
        <thead>
          <tr>
            <th></th>
            <th>PARTY 1</th>
            <th>PARTY 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Signature</strong></td>
            <td class="signature-line"></td>
            <td class="signature-line"></td>
          </tr>
          <tr>
            <td><strong>Print Name</strong></td>
            <td>${blank(data.party1.name)}</td>
            <td>${blank(data.party2.name)}</td>
          </tr>
          <tr>
            <td><strong>Title</strong></td>
            <td>${blank(data.party1.title)}</td>
            <td>${blank(data.party2.title)}</td>
          </tr>
          <tr>
            <td><strong>Company</strong></td>
            <td>${blank(data.party1.company)}</td>
            <td>${blank(data.party2.company)}</td>
          </tr>
          <tr>
            <td><strong>Notice Address</strong></td>
            <td>${blank(data.party1.noticeAddress)}</td>
            <td>${blank(data.party2.noticeAddress)}</td>
          </tr>
          <tr>
            <td><strong>Date</strong></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <p class="footer-note">Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.</p>
    </div>
  `;
}

export function renderStandardTerms(data: NdaFormData): string {
  const governingLaw = blank(data.governingLaw, "[Governing Law]");
  const jurisdiction = blank(data.jurisdiction, "[Jurisdiction]");

  return `
    <div class="standard-terms">
      <h2>Standard Terms</h2>

      <p><strong>1. Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in connection with the Purpose which (1) the Disclosing Party identifies to the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure (&ldquo;<strong>Confidential Information</strong>&rdquo;). Each party&rsquo;s Confidential Information also includes the existence and status of the parties&rsquo; discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.</p>

      <p><strong>2. Use and Protection of Confidential Information.</strong> The Receiving Party shall: (a) use Confidential Information solely for the Purpose; (b) not disclose Confidential Information to third parties without the Disclosing Party&rsquo;s prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the Purpose, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.</p>

      <p><strong>3. Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.</p>

      <p><strong>4. Disclosures Required by Law.</strong> The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s efforts to obtain confidential treatment for the Confidential Information.</p>

      <p><strong>5. Term and Termination.</strong> This MNDA commences on the Effective Date and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party&rsquo;s obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.</p>

      <p><strong>6. Return or Destruction of Confidential Information.</strong> Upon expiration or termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party&rsquo;s written request, destroy all Confidential Information in the Receiving Party&rsquo;s possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.</p>

      <p><strong>7. Proprietary Rights.</strong> The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.</p>

      <p><strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</p>

      <p><strong>9. Governing Law and Jurisdiction.</strong> This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${governingLaw}, without regard to the conflict of laws provisions of such state. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such courts.</p>

      <p><strong>10. Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.</p>

      <p><strong>11. General.</strong> Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party&rsquo;s permitted successors and assigns. Waivers must be signed by the waiving party&rsquo;s authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.</p>

      <p class="footer-note">Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.</p>
    </div>
  `;
}
