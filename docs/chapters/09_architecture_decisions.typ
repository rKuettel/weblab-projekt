// tag::DE[]
#import "../lib.typ": arc42help
= Architekturentscheidungen <section-design-decisions>


== ADR 1: Backend- und Infrastruktur Ansatz

Grundlegender Ansatz wie das Backend aufgebaut werden soll.

=== Decision

Das Backend wird als Monolith implementiert.
Grund dafür ist, dass damit immer noch alle Qualitätsmerkmale erfüllt werden können und die Applikation relativ klein sein wird worurch ein andere Ansatz wie z.B. SCS nicht nötig ist.


== ADR 2: Client Architekturansatz

Die Entscheidung wie die der Client umgestezt wird.

=== Decision

Der Client wird als SPA umgesetzt.
//TODO: link zu Anforderung sobald in docu
Die Begründung dafür ist die "Could" Anforderung, dass man die Applikation auch ohne Internet Verbindung verwenden können soll.
Dadruch fallen Optionen bei denen Server Side Rendering eingesetzt wird weg.



#arc42help[
  *Inhalt*

  Wichtige, teure, große oder riskante Architektur- oder Entwurfsentscheidungen inklusive der jeweiligen Begründungen.
  Mit "Entscheidungen" meinen wir hier die Auswahl einer von mehreren Alternativen unter vorgegebenen Kriterien.

  Wägen Sie ab, inwiefern Sie Entscheidungen hier zentral beschreiben, oder wo eine lokale Beschreibung (z.B. in der Whitebox-Sicht von Bausteinen) sinnvoller ist.
  Vermeiden Sie Redundanz.
  Verweisen Sie evtl. auf Abschnitt 4, wo schon grundlegende strategische Entscheidungen beschrieben wurden.

  *Motivation*

  Stakeholder des Systems sollten wichtige Entscheidungen verstehen und nachvollziehen können.

  *Form*

  Verschiedene Möglichkeiten:

  - ADR (#link("https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions")[Documenting Architecture Decisions]) für jede wichtige Entscheidung
  - Liste oder Tabelle, nach Wichtigkeit und Tragweite der Entscheidungen geordnet
  - ausführlicher in Form einzelner Unterkapitel je Entscheidung

  _Weiterführende Informationen:_ Siehe #link("https://docs.arc42.org/section-9/")[Architekturentscheidungen] in der arc42 Dokumentation (auf Englisch!).
  Dort finden Sie Links und Beispiele zum Thema ADR.
]
// end::DE[]
