# Styling

> Source: https://docs.eraser.io/styling

Eraser's diagram-as-code offers basic styling options which can be applied at the diagram-level or the node or group level.

| Property | Values | Default | Syntax example |
| --- | --- | --- | --- |
| `colorMode` | `pastel`, `bold`, `outline` | `pastel` | `colorMode bold` |
| `styleMode` | `shadow`, `plain`, `watercolor` | `shadow` | `styleMode shadow` |
| `typeface` | `rough`, `clean`, `mono` | `rough` | `typeface clean` |

## colorMode

Controls fill color lightness:

- `pastel` — lighter fill (default)
- `bold` — darker fill
- `outline` — transparent fill

```eraser
// diagram level
colorMode bold

// node level
Server [color: green, colorMode: bold]
```

## styleMode

Embellishments on nodes and groups:

- `shadow` — shadow behind nodes (default)
- `plain` — no shadow or watercolor
- `watercolor` — watercolor look

```eraser
styleMode plain

Server [color: green, styleMode: plain]
```

## typeface

Text typeface styles:

- `rough` — handwriting font (default)
- `clean` — clean sans serif
- `mono` — monospaced

```eraser
typeface clean

Server [color: green, typeface: clean]
```
