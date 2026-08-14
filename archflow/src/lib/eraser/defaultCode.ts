export const DEFAULT_ERASER_CODE = `direction right

VPC Subnet [icon: aws-vpc] {
  Main Server [color: blue] {
    Server [icon: aws-ec2]
    Data [icon: aws-rds]
  }
  Compute Nodes [color: red] {
    Worker1 [icon: aws-ec2]
    Worker2 [icon: aws-ec2]
    Worker3 [icon: aws-ec2]
  }
}

API gateway [icon: aws-api-gateway]
Lambda [icon: aws-lambda]
Server [icon: aws-ec2]
Database [icon: aws-rds]
Queue [icon: aws-simple-queue-service]
Cache [icon: redis]

API gateway > Lambda > Server
Server > Database
Server > Queue
Server > Cache
`;
