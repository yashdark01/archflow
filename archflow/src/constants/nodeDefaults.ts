import type { NodeType } from "@/types/diagram";

export interface NodeDefaultConfig {
  label: string;
  color: string;
  description: string;
}

export const NODE_DEFAULTS: Record<NodeType, NodeDefaultConfig> = {
  service: {
    label: "Service",
    color: "#2563eb",
    description: "Microservice or application",
  },
  database: {
    label: "Database",
    color: "#059669",
    description: "SQL or NoSQL database",
  },
  cache: {
    label: "Cache",
    color: "#d97706",
    description: "Redis or Memcached",
  },
  queue: {
    label: "Queue",
    color: "#7c3aed",
    description: "Message queue or event bus",
  },
  apiGateway: {
    label: "API Gateway",
    color: "#0891b2",
    description: "API gateway or reverse proxy",
  },
  loadBalancer: {
    label: "Load Balancer",
    color: "#db2777",
    description: "Load balancer",
  },
  user: {
    label: "User",
    color: "#475569",
    description: "End user or client",
  },
  group: {
    label: "Group",
    color: "#64748b",
    description: "Boundary container (VPC, cluster)",
  },
  cloud: {
    label: "Cloud Service",
    color: "#0284c7",
    description: "AWS / GCP / Azure service",
  },
  text: {
    label: "",
    color: "#334155",
    description: "Free text label on canvas",
  },
};

export const COLOR_PRESETS = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#475569",
  "#ef4444",
];
