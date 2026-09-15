#import "@preview/merman:0.3.0": show-mermaid-blocks
// Track Thing documentation shared configuration
// Set to true to show arc42 help texts, false to hide them
#let show-arc42-help = false

// arc42help function: renders help blocks conditionally
#let arc42help(content) = {
  if show-arc42-help {
    block(
      width: 100%,
      inset: 12pt,
      stroke: 0.5pt + luma(180),
      fill: luma(245),
      radius: 4pt,
      content,
    )
  }
}

#show raw.where(lang: "mermaid"): show-mermaid-blocks(width: 100%)
