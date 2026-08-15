# Architecture diagram examples

> Source: https://docs.eraser.io/architecture-diagram-examples

See runnable copies in [../examples/](../examples/).

## AWS Diagram

```eraser
// Define groups and nodes
API gateway [icon: aws-api-gateway]
Lambda [icon: aws-lambda]
S3 [icon: aws-simple-storage-service]
VPC Subnet {
  Main Server {
    Server [icon: aws-ec2]
    Data [icon: aws-rds]
  }
  Queue [icon: aws-auto-scaling]
  Compute Nodes {
    Worker1 [icon: aws-ec2]
    Worker2 [icon: aws-ec2]
    Worker3 [icon: aws-ec2]
  }
}
Analytics [icon: aws-redshift]

// Define connections
API gateway > Lambda > Server > Data
Server > Queue
Queue > Worker1, Worker2, Worker3
S3 < Data
Compute Nodes > Analytics
```

## Google Cloud Diagram

```eraser
// Define groups and nodes
Stream [icon: kafka, color: grey]
Ingest {
  Pub/Sub [icon: gcp-pubsub]
  Logging [icon: gcp-cloud-logging]
}
Pipelines {
  Dataflow [icon: gcp-dataflow]
}
Storage [icon: gcp-cloud-storage] {
  Datastore [icon: gcp-datastore]
  Bigtable [icon: gcp-bigtable]
}
Analytics {
  BigQuery [icon: gcp-bigquery]
}
Application [icon: gcp-app-engine] {
  App Engine [icon: gcp-app-engine]
  Container Engine [icon: gcp-container-registry]
  Compute Engine [icon: gcp-compute-engine]
}

// Define connections
Stream > Ingest
Logging > Analytics > Application
Pub/Sub > Pipelines > Storage > Application
```

## Azure Diagram

```eraser
// Define groups and nodes
AD tenant [icon: azure-active-directory]
Load Balancers [icon: azure-load-balancers]
Virtual Network [icon: azure-virtual-networks] {
  Web Tier [icon: azure-network-security-groups] {
    vm1 [icon: azure-virtual-machine]
    vm2 [icon: azure-virtual-machine]
    vm3 [icon: azure-virtual-machine]
  }
  Business Tier [icon: azure-network-security-groups] {
    lb2 [icon: azure-load-balancers]
    vm4 [icon: azure-virtual-machine]
    vm5 [icon: azure-virtual-machine]
    vm6 [icon: azure-virtual-machine]
  }
}

// Define connections
AD tenant > Load Balancers
Load Balancers > vm1, vm2, vm3
vm1, vm2, vm3 > lb2 > vm4, vm5, vm6
```

## Kubernetes Diagram

```eraser
// Define groups and nodes
Cloud Provider API [icon: settings]
AWS [icon: aws]
GCP [icon: google-cloud]
Azure [icon: azure]
Control Plane [icon: k8s-control-plane]{
  api [icon: k8s-api]
  sched [icon: k8s-sched]
  ccm [icon: k8s-c-c-m]
  cm [icon: k8s-c-m]
  etcd [icon: k8s-etcd]
}
Node1 [icon: k8s-node] {
  kubelet1 [icon: k8s-kubelet]
  kproxy1 [icon: k8s-k-proxy]
}
Node2 [icon: k8s-node] {
  kubelet2 [icon: k8s-kubelet]
  kproxy2 [icon: k8s-k-proxy]
}
Node3 [icon: k8s-node] {
  kubelet3 [icon: k8s-kubelet]
  kproxy3 [icon: k8s-k-proxy]
}

// Define connections
ccm > Cloud Provider API
Cloud Provider API > AWS, Azure, GCP
api > ccm, sched, etcd, cm
kubelet1, kproxy1, kubelet2, kproxy2, kubelet3, kproxy3 > api
```

## Data ETL Pipeline

```eraser
// Define groups and nodes
Input data sources {
  Oracle [icon: oracle]
  Twitter [icon: twitter]
  Facebook [icon: facebook]
}
ETL pipeline [color: silver]{
  User survey data [icon: kafka]
  Data load [icon: aws-s3]
  Data transformation [icon: databricks]
  Data store [icon: snowflake]
}
Data destinations {
  Notification [icon: slack]
  Experimentation [icon: tensorflow]
  BI dashboard [icon: tableau]
}

// Define connections
Oracle, Twitter, Facebook > User survey data
User survey data > Data load > Data transformation > Data store
Data store > Notification, Experimentation, BI dashboard
```
