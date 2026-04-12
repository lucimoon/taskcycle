# TaskCycle Architecture

Updated each milestone. See `docs/taskcycle-plan.md` for the full roadmap.

## Layer Model

```mermaid
graph TD
  subgraph Browser
    subgraph React["React App"]
      Views["Views (src/views/)"]
      Components["Components (src/components/)"]
      Hooks["Hooks (src/hooks/)"]
      Stores["Stores (src/store/)"]
      Services["Services (src/services/)"]
      Types["Types (src/types/)"]
      Utils["Utils (src/utils/)"]
    end
    Views --> Components
    Views --> Stores
    Components --> Hooks
    Hooks --> Services
    Stores --> Services
    Services --> IDB[(IndexedDB / Dexie)]
    Services -.->|M10| FS[(File System API)]
  end
```

## Import Rules

- Services must not import React or hooks
- Components must not import services directly — go through hooks or stores
- Views own routing and layout; minimal logic beyond wiring

## Data Flow (M2+)

```mermaid
sequenceDiagram
  participant View
  participant Store
  participant Service
  participant Dexie
  View->>Store: addTask(draft)
  Store->>Service: createTask(draft)
  Service->>Dexie: db.tasks.add(task)
  Service-->>Store: Task
  Store-->>View: tasks[] updated
```
