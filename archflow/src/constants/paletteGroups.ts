import type { NodeType } from "@/types/diagram";

export interface PaletteItemConfig {
  type: NodeType;
  label: string;
  description: string;
}

export interface PaletteGroupConfig {
  id: string;
  label: string;
  items: PaletteItemConfig[];
}

export const PALETTE_GROUPS: PaletteGroupConfig[] = [
  {
    id: "core",
    label: "Core",
    items: [
      { type: "service", label: "Service", description: "Microservice or app" },
      { type: "user", label: "User", description: "Actor or client" },
      { type: "group", label: "Group", description: "Boundary container" },
    ],
  },
  {
    id: "data",
    label: "Data",
    items: [
      { type: "database", label: "Database", description: "Persistent storage" },
      { type: "cache", label: "Cache", description: "In-memory cache" },
      { type: "queue", label: "Queue", description: "Message queue" },
    ],
  },
  {
    id: "network",
    label: "Network",
    items: [
      { type: "apiGateway", label: "API Gateway", description: "Entry point" },
      {
        type: "loadBalancer",
        label: "Load Balancer",
        description: "Traffic distribution",
      },
      { type: "cloud", label: "Cloud", description: "Cloud service" },
    ],
  },
];

export const ALL_PALETTE_ITEMS = PALETTE_GROUPS.flatMap((group) => group.items);
