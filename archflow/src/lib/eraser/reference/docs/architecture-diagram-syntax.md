# Architecture diagram syntax

> Source: https://docs.eraser.io/architecture-diagram-syntax

## Nodes

A node is the most basic building block in a cloud architecture diagram.

Node definitions consist of a name followed by an optional set of properties.

```eraser
compute [icon: aws-ec2]
```

Node names are required to be unique.

Nodes support `icon` and `color` properties.

## Groups

A group is a container that can encapsulate nodes and groups.

```eraser
Main Server {
  Server [icon: aws-ec2]
  Data [icon: aws-rds]
}
```

Group names are required to be unique. Groups can be nested.

```eraser
VPC Subnet {
  Main Server {
    Server [icon: aws-ec2]
    Data [icon: aws-rds]
  }
}
```

Groups support `icon` and `color` properties.

## Properties

Properties are key-value pairs enclosed in `[ ]` brackets. Multiple properties are comma-separated.

```eraser
Main Server [icon: aws-ec2, color: blue] {
  Server [icon: aws-ec2]
  Data [icon: aws-rds]
}
```

| Property | Description | Value | Default |
| --- | --- | --- | --- |
| `icon` | Attached icons | Icon names (e.g. `aws-ec2`) | |
| `color` | Stroke and fill color | Color name or hex `"#000000"` | |
| `label` | Text label | Any string; quote if spaces | Node/group name |
| `link` | Internal or external link | URL in quotes | |
| `colorMode` | Fill color lightness | `pastel`, `bold`, `outline` | `pastel` |
| `styleMode` | Embellishments | `shadow`, `plain`, `watercolor` | `shadow` |
| `typeface` | Text typeface | `rough`, `clean`, `mono` | `rough` |

Distinct names with same label:

```eraser
Server_A [label: server]
Server_B [label: server]
```

## Connections

| Connector | Syntax | Description |
| --- | --- | --- |
| Arrow right | `>` | Left-to-right arrow |
| Arrow left | `<` | Right-to-left arrow |
| Bidirectional | `<>` | Bi-directional arrow |
| Line | `-` | Line |
| Dotted line | `--` | Dotted line |
| Dotted arrow | `-->` | Dotted arrow |

Label:

```eraser
Storage > Server: Cache Hit
```

One-to-many:

```eraser
Server > Worker1, Worker2, Worker3
```

Undefined names in a connection create blank nodes.

Connection property:

| Property | Example |
| --- | --- |
| `color` | `Storage > Server: Cache Hit [color: green]` |

## Escape string

Wrap names in quotes when using reserved characters:

```eraser
User > "https://localhost:8080": GET
```

## Direction

`direction down` | `direction up` | `direction right` (default) | `direction left`

## Diagram-level styling

| Property | Values | Default | Example |
| --- | --- | --- | --- |
| `colorMode` | `pastel`, `bold`, `outline` | `pastel` | `colorMode bold` |
| `styleMode` | `shadow`, `plain`, `watercolor` | `shadow` | `styleMode shadow` |
| `typeface` | `rough`, `clean`, `mono` | `rough` | `typeface clean` |

## Legends

```eraser
legend {
  [connection: -->, label: Async]
  [color: red, label: Error]
  [icon: aws-lambda, label: Lambda]
  [shape: diamond, label: Decision]
}
```

Legend position: `top-left`, `top-right` (default), `bottom-left`, `bottom-right`, `top`, `bottom`, `left`, `right`

```eraser
legend [position: bottom-left] {
  [color: red, label: Error]
}
```

Legend item properties: `label` (required), plus one of `connection`, `color`, `icon`, `shape`. `color` can combine with `connection` or `shape`.

```eraser
legend {
  [connection: -->, color: orange, label: Async backup]
  [shape: rectangle, color: blue, label: Active]
}
```
