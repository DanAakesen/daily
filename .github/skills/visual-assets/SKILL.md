---
name: visual-assets
description: Use for hero imagery, generated images, product visuals, screenshots, illustrations, textures, icons-as-assets, social/marketing visuals, and any UI needing real visual material instead of fake div screenshots. Guides image-generation prompts, asset placement, licensing, fallbacks, alt text, and responsive optimization.
---

# Visual Assets

Visual assets are product material, not decoration. Use them when an image, generated object, screenshot, texture, or illustration makes the interface clearer, more memorable, or more trustworthy.

## Asset decision order

1. **Existing real assets**: product screenshots, brand images, uploaded files, design files, public assets in the repo.
2. **Available image generation**: use native image generation or an approved image-generation tool when available.
3. **Verified open-license/stock imagery**: only if allowed and URLs are verified.
4. **Explicit asset slots**: if no real asset path exists, leave a clearly labeled placement and state what image is needed.

Never fake a product screenshot with styled `<div>` rectangles. Never guess Unsplash image IDs. Never use emoji as visual assets.

## When to generate images

Generate images for:

- Hero sections that need a distinctive visual world
- Product, concept, or object imagery that does not exist yet
- Editorial or campaign visuals
- Texture/material studies
- Abstract scene-setting visuals
- Social/preview imagery
- Empty-state illustrations when they clarify the action

Do not generate images for:

- UI icons that should come from an icon library
- Product screenshots that need to reflect real UI state
- Logos unless explicitly requested
- Regulated, factual, medical, legal, or customer-specific imagery where accuracy matters
- Anything that could imply a real customer, employee, or proprietary asset

## Image-generation prompt structure

Use this structure internally:

```text
Subject:
Audience:
Purpose in UI:
Composition:
Style/material:
Lighting/color:
Aspect ratio:
Negative constraints:
Accessibility notes:
```

Good prompts describe the image's job in the interface. Avoid generic phrases like "modern high quality hero image" without subject, composition, and use.

## Hero image requirements

A hero visual must:

- Match the product's actual subject and mood
- Support the headline rather than competing with it
- Have a responsive crop plan
- Preserve contrast for any overlaid text
- Include alt text or decorative `alt=""` intentionally
- Avoid generic AI motifs: floating glass cubes, purple-blue glow, random dashboards, robot hands, fake holograms, abstract blobs

If text is overlaid on an image, use scrims/gradients/tints from the design system and verify contrast.

## Asset storage

For generated or downloaded assets:

```text
public/assets/
src/assets/
```

Use meaningful filenames:

```text
hero-research-workspace.webp
empty-state-source-review.svg
report-cover-evidence-map.webp
```

Do not commit temporary generation prompts, unused variants, or huge originals unless explicitly needed.

## Optimization

- Prefer `webp` or optimized `png/jpg` for raster assets.
- Use correct intrinsic dimensions.
- Avoid layout shift with fixed aspect-ratio containers.
- Lazy-load non-critical images.
- Preload or prioritize only critical hero imagery.
- Provide dark/light variants only when necessary.

## Accessibility and legal hygiene

- Write alt text for informative images.
- Use `alt=""` for purely decorative images.
- Do not invent attribution or licensing claims.
- If using stock/open-license imagery, record source URL and license/terms where practical.
- Do not use copyrighted characters, brand marks, celebrity likenesses, or proprietary screenshots without permission.

## Fallbacks

If image generation is unavailable, say so briefly and choose the best safe fallback:

- use an existing asset
- use a verified stock image
- leave an explicit asset slot
- simplify the design so it does not depend on missing imagery

Never silently replace missing imagery with generic decorative shapes.
