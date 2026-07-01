Stock Purchase Flow
An interaction study built around a single idea: buying a stock should end in a moment that feels like something, not just a confirmation screen.
Instead of a plain success state, completing a purchase generates a stock certificate, and downloading it triggers a genie-style collapse where the certificate deforms and shrinks into the download button, the way a window minimizes on macOS.
What it does

Browse stocks in a hover-aware carousel that slows as you move over it
Buy flow with animated numbers and a fill-in amount
Success state that builds a personalized certificate with an editable name, serial number, and wax-style seal stamp
Parallax tilt on the certificate that catches light as you move your cursor
Genie collapse: on download, the certificate deforms with a gentle concave pinch and dissolves into the button

Built with

Next.js and React for the app and component structure
Framer Motion for spring-based animation, tilt, and staggered transitions
Three.js and html2canvas for the certificate mesh deformation on collapse
Tailwind CSS for styling
Number Flow for animated figures on the buy screen


## Structure

```
src/
├── app/              # Next.js App Router
├── components/       # UI components
│   └── ui/           # shadcn/ui primitives
├── hooks/            # Custom React hooks
└── lib/              # Utilities and constants
docs/                 # Project documentation
public/               # Static assets
```

## Development

```bash
npm install
npm run dev
```
