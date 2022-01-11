# Service Enabler Architecture Layer(SEAL) Server

## Features

- Patrial aligned with 3GPP rel-17
- Implemented services
  - Identity management (TS 33.434 V17.0.0, TS 24.547 V16.2.0)
  - Group management (TS 29.549 V17.3.0)

## Installation

1. Please install [Node.js](https://nodejs.org/en/) first
2. Execute the following commands

```bash
cd seal_server
npm install
```

## Usage

```bash
npm start
```

- The SEAL server will serve on port 8080 by default

## Endpoints

- ✔️: Implemented; ❌: Not implemented
- Identity Management
  - ✔️ OpenID Connect 1.0
- Group Management
  - ✔️ `GET {apiRoot}/ss-gm/v1/group-documents`
  - ✔️ `POST {apiRoot}/ss-gm/v1/group-documents`
  - ✔️ `GET {apiRoot}/ss-gm/v1/group-documents/{groupDocId}`
  - ✔️ `PUT {apiRoot}/ss-gm/v1/group-documents/{groupDocId}`
  - ✔️ `DELETE {apiRoot}/ss-gm/v1/group-documents/{groupDocId}`
