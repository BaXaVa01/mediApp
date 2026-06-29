# Graph Report - .  (2026-06-23)

## Corpus Check
- 17 files · ~70,482 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 26 nodes · 13 edges · 13 communities (7 shown, 6 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_MediFind SpringV Test suite|MediFind SpringV Test suite]]
- [[_COMMUNITY_MediFind SpringV Main Application|MediFind SpringV Main Application]]
- [[_COMMUNITY_Tienda Web Express Main Application|Tienda Web Express Main Application]]
- [[_COMMUNITY_Semantic Application Classes|Semantic Application Classes]]
- [[_COMMUNITY_T-Shirt Product Image|T-Shirt Product Image]]
- [[_COMMUNITY_Mouse Product Image|Mouse Product Image]]
- [[_COMMUNITY_Backpack Product Image|Backpack Product Image]]

## God Nodes (most connected - your core abstractions)
1. `MediFindSpringVApplicationTests` - 2 edges
2. `MediFindSpringVApplication` - 2 edges
3. `TiendaWebExpressApplication` - 2 edges
4. `MediFindSpringVApplication` - 2 edges
5. `TiendaWebExpressApplication` - 1 edges
6. `MediFindSpringVApplicationTests` - 1 edges
7. `White Cotton T-Shirt Product Image` - 0 edges
8. `Logitech MX Master Mouse` - 0 edges
9. `Aegis Backpack Image` - 0 edges

## Surprising Connections (you probably didn't know these)
- `MediFindSpringVApplication` --semantically_similar_to--> `TiendaWebExpressApplication`  [INFERRED] [semantically similar]
  src/main/java/com/example/medifind_springv/MediFindSpringVApplication.java → src/main/java/com/example/tienda_web_express/TiendaWebExpressApplication.java
- `MediFindSpringVApplicationTests` --references--> `MediFindSpringVApplication`  [INFERRED]
  src/test/java/com/example/medifind_springv/MediFindSpringVApplicationTests.java → src/main/java/com/example/medifind_springv/MediFindSpringVApplication.java

## Hyperedges (group relationships)
- **Thymeleaf HTML Templates** — index_indexhtml, catalogo_catalogohtml, detalle_detallehtml, pedido_pedidohtml, pedidoexitoso_pedidoexitosohtml [EXTRACTED 1.00]

## Communities (13 total, 6 thin omitted)

### Community 4 - "Semantic Application Classes"
Cohesion: 0.67
Nodes (3): MediFindSpringVApplication, MediFindSpringVApplicationTests, TiendaWebExpressApplication

## Knowledge Gaps
- **5 isolated node(s):** `TiendaWebExpressApplication`, `MediFindSpringVApplicationTests`, `White Cotton T-Shirt Product Image`, `Logitech MX Master Mouse`, `Aegis Backpack Image`
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `MediFindSpringVApplication` (e.g. with `MediFindSpringVApplicationTests` and `TiendaWebExpressApplication`) actually correct?**
  _`MediFindSpringVApplication` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `TiendaWebExpressApplication`, `MediFindSpringVApplicationTests`, `White Cotton T-Shirt Product Image` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._