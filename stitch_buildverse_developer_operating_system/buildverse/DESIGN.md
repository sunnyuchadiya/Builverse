---
name: BuildVerse
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 24px
  section-gap: 32px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is anchored in a Scandinavian-inspired minimalism, blending the precision of high-end developer tools with the editorial elegance of luxury lifestyle brands. It targets a sophisticated technical audience that values clarity, performance, and aesthetic restraint.

The visual style is characterized by extreme whitespace, high-fidelity typography, and a "quiet" interface that recedes to prioritize user content. It employs a refined mix of **Minimalism** and **Modern Corporate** aesthetics, utilizing subtle tonal shifts rather than heavy ornamentation to define structure. The emotional response is one of calm authority, reliability, and premium craftsmanship.

## Colors

The color strategy utilizes a "Paper and Ink" philosophy. The primary background is a warm, off-white (#FAFAF8) that reduces eye strain compared to pure white, while interactive components and text use a deep charcoal (#111111) for maximum legibility and contrast.

- **Primary:** Reserved for high-impact actions, text, and structural anchors.
- **Accent (Amber):** Used sparingly for highlighting active states, notifications, or specific CTAs to provide a warm, human touch to the technical interface.
- **Neutral/Surface:** A tiered system of whites and light greys creates depth without the use of heavy shadows.
- **Functional:** Success and Danger colors are calibrated to be visible but not vibrating, maintaining the soft editorial tone.

## Typography

This design system relies on **Inter** to deliver a systematic, utilitarian feel that remains legible at all sizes. The typographic hierarchy is heavily weighted toward large, tight-tracked displays for headlines to evoke an editorial feel.

- **Tracking:** Use negative letter-spacing for large headlines (-0.02em to -0.04em) to create a premium, compact look.
- **Weight Pairing:** Pair `600` (Semi-Bold) headlines with `400` (Regular) body text. Use `300` (Light) for large sub-headers in marketing contexts.
- **Scalability:** On mobile, display sizes should compress significantly while maintaining their bold weights to preserve the brand's visual impact.

## Layout & Spacing

The layout follows a fluid-to-fixed transition model. On desktop, content is centered within a 1280px max-width container. 

- **Grid:** A 12-column grid is used for dashboards, while a simplified 1-column or 2-column layout is preferred for editorial-style content.
- **Rhythm:** A 4px/8px base unit drives all internal spacing. The "Standard Gap" is 24px, aligning with the outer container padding to create a consistent visual frame.
- **Mobile:** Margins remain at 24px to provide a generous "breathing room" that feels more premium than standard tight mobile margins.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and extremely soft, large-radius shadows. 

- **Level 0 (Background):** #FAFAF8. The base canvas.
- **Level 1 (Cards/Surface):** #FFFFFF. Used for the primary content containers. These should feature a 1px solid border in #ECECEC.
- **Shadows:** Avoid harsh, dark shadows. Use a "Natural Ambient" shadow: `0 8px 30px rgba(0, 0, 0, 0.04)`. This creates a lifted effect that feels light and airy.
- **Interactions:** On hover, cards may increase their shadow spread slightly or shift background color to #F5F5F5 to indicate interactivity.

## Shapes

The shape language is a mix of architectural rigidity and organic softness. 

- **Containers:** Large cards and main sections use a consistent **24px (rounded-xl)** radius, creating a friendly, modern frame.
- **Interactive Elements:** Buttons and tags utilize a **Pill (full)** radius to contrast against the more structured rectangular layout of the grid.
- **Form Inputs:** Use a standard **8px (rounded-md)** radius to maintain a professional, systematic feel for data entry.

## Components

### Buttons
- **Primary:** Black background (#111111), white text, pill-shaped. High contrast, no border.
- **Secondary:** White background, black text, pill-shaped, 1px border (#ECECEC).
- **Size:** Large padding (12px 24px) to ensure a premium, tactile feel.

### Cards
- **Editorial Card:** White background, 24px border radius, 32px internal padding. Use for featured content or high-level dashboard summaries.
- **Border:** Always use a subtle #ECECEC border to define the edge against the off-white background.

### Input Fields
- Background: #FFFFFF.
- Border: 1px solid #ECECEC.
- State: On focus, the border changes to #111111 or the accent color #F59E0B with a subtle outer glow.

### Lists & Navigation
- **Navigation:** Horizontal, using `label-md` typography. Active states should be indicated by a small #111111 dot beneath the label or a bold weight change.
- **Lists:** Clean rows with 16px vertical padding and #ECECEC bottom dividers.

### Icons
- Use **Lucide** icons. Line weight should be set to 1.5px or 2px to match the weight of the typography. Avoid filled icons unless used for active states.