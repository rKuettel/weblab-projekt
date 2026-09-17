// Track Thing – arc42 Dokumentation
// Template: arc42 Version 9.1-DE, Dezember 2025
// (basiert auf der AsciiDoc Version)
// See https://arc42.org

#import "lib.typ": *

// ============================================================
// Document setup
// ============================================================

#set document(
  title: "Track Thing – Architektur Dokumentation",
  author: "Roman Küttel",
)

#set text(lang: "de", region: "ch", font: "Libertinus Serif", size: 11pt)
#set heading(numbering: "1.1")
#set par(justify: true)

// #show raw.where(lang: "mermaid"): show-mermaid-blocks(width: 100%, presentation-profile: "merman-modern")

// ============================================================
// Title page
// ============================================================

#align(center)[
  #image("images/arc42-logo.png", width: 30%)
  #v(1em)
  #text(size: 24pt, weight: "bold")[Track Thing]
  #v(0.5em)
  #text(size: 14pt)[Tracking-/Statistik-Applikation \
    Architektur Dokumentation \
    Roman Küttel
  ]
]

#v(2em)

// ============================================================
// About arc42
// ============================================================

#text(weight: "bold", size: 14pt)[Über arc42]

#text(size: 12pt)[arc42, das Template zur Dokumentation von Software- und Systemarchitekturen.]

Template Version 9.1-DE (basiert auf der AsciiDoc Version), Dezember 2025.

Created, maintained and (C) by Dr. Peter Hruschka, Dr. Gernot Starke and contributors.
Siehe #link("https://arc42.org").

#line(length: 100%)

// ============================================================
// Table of contents
// ============================================================

#outline(title: "Inhaltsverzeichnis", depth: 3)

// ============================================================
// Chapters
// ============================================================

#pagebreak()
#include "chapters/01_introduction_and_goals.typ"

#pagebreak()
#include "chapters/02_architecture_constraints.typ"

#pagebreak()
#include "chapters/03_context_and_scope.typ"

#pagebreak()
#include "chapters/04_solution_strategy.typ"

#pagebreak()
#include "chapters/05_building_block_view.typ"

#pagebreak()
#include "chapters/06_runtime_view.typ"

#pagebreak()
#include "chapters/07_deployment_view.typ"

#pagebreak()
#include "chapters/08_concepts.typ"

#pagebreak()
#include "chapters/09_architecture_decisions.typ"

#pagebreak()
#include "chapters/10_quality_requirements.typ"

#pagebreak()
#include "chapters/11_technical_risks.typ"

#pagebreak()
#include "chapters/12_glossary.typ"
