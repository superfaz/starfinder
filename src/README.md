## `src` folder

### Content

| folder  | purpose                      |
| ------- | ---------------------------- |
| `app`   | next.js application          |
| `data`  | data source management layer |
| `logic` | business logic layer         |
| `model` | data model elements          |
| `ui`    | ui components                |
| `view`  | model view layer             |

### Relationships

```mermaid
block-beta
columns 1
  app
  space
  block
    logic
    space
    ui
    space
    view
  end
  space
  block
    data
    space
    model
  end
  app --> logic
  app --> ui
  app --> view
  logic --> data
  logic --> model
  data --> model
  view --> model
```
