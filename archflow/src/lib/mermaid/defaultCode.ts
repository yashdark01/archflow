export const DEFAULT_MERMAID_CODE = `graph LR
  API["API Gateway"]
  Service["Service"]
  DB[("Database")]
  Cache{"Cache"}
  User(("User"))

  User --> API
  API --> Service
  Service --> DB
  Service --> Cache
`;
