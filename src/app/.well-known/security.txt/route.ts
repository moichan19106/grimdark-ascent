import { isPlaceholder, siteConfig } from "@/config/site";

/**
 * RFC 9116 security.txt: the standard place researchers look for how to
 * report security issues. Served as text/plain from the required
 * /.well-known/ path. While the business email is still an unfilled
 * placeholder, the (real) YouTube channel URL is the contact point; once a
 * real email is configured it becomes a mailto: contact automatically.
 * The file is fully static, so it is emitted for prerendering.
 */
export const dynamic = "force-static";

export function GET() {
  const contact = isPlaceholder(siteConfig.businessEmail)
    ? `Contact: ${siteConfig.youtubeUrl}`
    : `Contact: mailto:${siteConfig.businessEmail}`;

  const lines = [
    contact,
    "Preferred-Languages: en",
    // RFC 9116 requires an absolute expiration date (RFC 3339).
    "Expires: 2027-01-01T00:00:00.000Z",
  ];

  if (!isPlaceholder(siteConfig.siteUrl)) {
    lines.push(
      `Canonical: ${siteConfig.siteUrl}/.well-known/security.txt`
    );
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
