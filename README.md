# Heavenly Hope Apostolic Church

An original, responsive static website for Heavenly Hope Apostolic Church
(Heavenly Hope Church Incorporated) in
Truganina, Victoria. Uses HTML, CSS, JavaScript and Vite. No database or paid
services are required.

## Local development

Requires Node.js 20.19+ or 22.12+.

```shell
npm install
npm run dev
```

Open the local address printed by Vite.

```shell
npm test
npm run build
npm run preview
```

The production website is generated in `dist`. Do not deploy `node_modules` or
the source project as your public website.

## Before publishing

- Sunday service at 11:30am and the public name were confirmed by the site owner.
- Confirm the venue, program descriptions and WDP sponsor status before launch.
- The supplied contact address, `heavenlyhopeincorporated@gmail.com`, opens the
  visitor's email client. There is intentionally no non-functional contact,
  donation, livestream or registration form.
- The hero and ministry-card photos are illustrative stock images. The photo
  carousel uses actual church photos from the church's Facebook page.
- The sticky header uses the Heavenly Hope logo as a compact circular mark;
  section links leave space for the header on desktop and mobile.
  Confirm final branding approval.
- Set the final domain's canonical and social sharing URLs after choosing it.
- Test the final production domain, HTTPS, directions and mobile navigation.

## WDP support content

The final section before the footer describes the church's WDP sponsorship,
as supplied by the site owner, with an email enquiry link and
[official Fines Victoria guidance](https://online.fines.vic.gov.au/support/work-and-Development-Permit).
Wording distinguishes reducing eligible fine debt through approved activities
from an automatic waiver. It does not promise eligibility, approval or particular
activities, and asks visitors not to send sensitive documents in an initial email.
Keep this content aligned with the church's approved sponsor activities and the
current Fines Victoria scheme requirements.

## GoDaddy domain and deployment

### Publish with GitHub Pages

Repository: <https://github.com/FED-JAG-1989/Church-Website>

1. Open the repository's **Settings > Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions > Deploy church website to GitHub Pages**.
4. Choose **Run workflow**, select `main`, and confirm **Run workflow**.
5. Wait for the build and deploy jobs to succeed. The public website should be
   available at <https://fed-jag-1989.github.io/Church-Website/>.

The workflow tests and builds the site on every push to `main`. If the first
deployment fails before Pages is enabled, enable it as above and rerun the
workflow. A repository URL shows source code; the `github.io` URL shows the site.
Free Pages hosting is available for public repositories; private-repository
availability depends on your GitHub plan.

Vite uses a relative asset base so the build works under `/Church-Website/`
as well as at the root of a future custom domain.

### Connect a GoDaddy domain later

When the Pages site is working, add the purchased domain under
**Settings > Pages > Custom domain** and follow GitHub's current
[custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
In GoDaddy DNS, a `www` CNAME for this account points to
`fed-jag-1989.github.io` (not to a repository path). For the root domain, use the
exact A/AAAA records documented by GitHub at setup time. Preserve existing
email MX/TXT records. Verify the domain, wait for DNS/certificate issuance, and
enable **Enforce HTTPS** in Pages settings. Domain registration remains with
GoDaddy; the site can remain hosted free on GitHub Pages.

### Other hosting options

A domain and hosting are separate. A GoDaddy domain can point to static hosting
such as Netlify, Cloudflare Pages or Vercel, or to compatible GoDaddy web hosting.
No domain records have been changed by this project.

For static hosting, use `npm run build` as the build command and `dist` as the
publish directory. Add your purchased domain in the hosting dashboard, then use
the exact DNS records supplied by that provider in GoDaddy. Do not remove
existing email (MX/TXT) records. Enable HTTPS using your hosting provider.

For GoDaddy cPanel hosting, build locally and upload the **contents** of `dist`
to the domain's document root (often `public_html`). Back up any existing site
first. GoDaddy Website Builder is a separate product and does not directly
accept this Vite project's source files.

## Images and fonts

### Church photo carousel

Eleven distinct photos from the
[church Facebook page](https://www.facebook.com/profile.php?id=61581878207037)
are stored locally in `public/images/church`. The site owner confirmed permission
to reuse the photos, including consent for children pictured. Reconfirm approvals
with the church before public deployment.

The carousel supports previous/next buttons, photo selectors, touch swipes,
and Left/Right/Home/End keys when the photo viewer has focus. It does not autoplay.
The photo count is announced to assistive technology and failed images show an
explicit message. It makes no Facebook requests until a visitor follows a link.

This is a curated gallery, not an automatically synchronised Facebook feed.
To update it, replace or add approved local photos and update their slide markup,
captions, meaningful alt text and position labels in `index.html`. The controls
derive their count from the slides. Run `npm test` and `npm run build` afterwards;
update the expected photo count in the gallery test when adding/removing slides.

Source Facebook photo IDs for `community-1.jpg` through `community-6.jpg`:
`122158520091062606`, `122158518861062606`, `122158518807062606`,
`122158518243062606`, `122158517883062606`, `122158520151062606`.

Five additional photos are stored as `community-7.jpg` through `community-11.jpg`.
Their source Facebook photo IDs are `122158515651062606`,
`122158515585062606`, `122158515795062606`, `122158515729062606`,
and `122158515699062606`, respectively.

### Illustrative stock images

The visit section reuses the original green landscape as a locally hosted
background at `public/images/backgrounds/green-landscape.jpg`, with a light
overlay for readable text and an opaque visit-details card.
Unsplash image identifier: `photo-1470071459604-3b5ec3a7fe05`.
Source: <https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05>.
Usage terms: <https://unsplash.com/license>.

The hero uses the stained-glass church interior image supplied by the site owner at
`public/images/hero/stained-glass-church.png`. It is illustrative, not a photograph
of Heavenly Hope's venue. The site owner confirmed permission to publish it.
The supplied image is portrait-oriented;
a higher-resolution landscape original is recommended for wide screens.

Stock imagery is served from Unsplash under the
[Unsplash licence](https://unsplash.com/license). Images are illustrative.

- Worship: image identifier `photo-1438232992991-995b7058bbb3`.
- Friends: image identifier `photo-1529156069898-49953e39b3ac`.
- Bible: image identifier `photo-1504052434569-70ad5836ab65`.

The image URLs are in `src/styles.css`; replace these with local approved images
under `public` for a fully self-hosted site. Fonts are DM Sans and Manrope from
Google Fonts, with system font fallbacks. Google Fonts and Unsplash receive
normal browser requests when visitors load these external assets.
The header uses the Heavenly Hope logo supplied by the site owner, stored in
`public/images/branding`. Blank margins were trimmed from a copy of the logo.
Unused trial banners and the second supplied Apostolic Church emblem were removed.
The original attachments were not modified. The browser favicon remains an
original placeholder SVG until a dedicated church favicon is supplied.
