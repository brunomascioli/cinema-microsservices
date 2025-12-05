# Sistema de Cinema - Arquitetura de Microserviços

Sistema distribuído para gerenciamento de cinema baseado em microserviços, desenvolvido com NestJS, React e PostgreSQL.

## Contexto do Sistema

O sistema permite que usuários naveguem pelo catálogo de filmes, visualizem sessões disponíveis, selecionem assentos e comprem ingressos. Colaboradores podem validar ingressos através de QR codes na entrada das sessões.

### Atores

- **Cliente**: Usuário que navega no catálogo, consulta sessões e compra ingressos
- **Colaborador**: Valida ingressos na entrada através de aplicativo móvel/web

### Sistemas Externos

- **Gateway de Pagamento**: Processamento de transações financeiras (não implementado)
- **Gateway de Notificação**: Envio de e-mails e notificações (não implementado)

## Arquitetura

O projeto segue o modelo C4 e implementa uma arquitetura baseada em microserviços. A decisão arquitetural está documentada em `documents/adr/adr001.md`.

### Estrutura de Microserviços

#### 1. User Service
**Responsabilidade**: Gerenciamento de usuários e autenticação

- Tecnologias: NestJS, Prisma, PostgreSQL, JWT, Passport
- Porta: 3001
- Banco de Dados: PostgreSQL (porta 5434)
- Features:
  - Cadastro e login de usuários
  - Autenticação JWT
  - Controle de acesso baseado em roles (ADMIN, USER)
  - Estratégias de autenticação com Passport

#### 2. Catalog Service
**Responsabilidade**: Gestão de filmes, salas, assentos e sessões

- Tecnologias: NestJS, Prisma, PostgreSQL, RabbitMQ
- Porta: 3002
- Banco de Dados: PostgreSQL (porta 5433)
- Features:
  - CRUD de filmes (título, descrição, duração, gênero, data de lançamento)
  - Gerenciamento de salas e capacidade
  - Controle de assentos por sala
  - Sessões (relacionamento filme-sala-horário)
  - Disponibilidade de assentos por sessão

#### 3. Session Service
**Responsabilidade**: Gerenciamento de reservas de assentos

- Tecnologias: NestJS, Prisma, PostgreSQL, RabbitMQ
- Porta: 3003
- Banco de Dados: PostgreSQL (porta 5435)
- Features:
  - Sistema de reserva temporária com TTL
  - Controle de estado (LOCKED, SOLD, CANCELED)
  - Constraint de unicidade (sessionId + seatId)
  - Expiração automática de reservas não confirmadas
  - Comunicação assíncrona via mensageria

#### 4. Ticket Service
**Responsabilidade**: Emissão e validação de ingressos

- Tecnologias: NestJS
- Features:
  - Geração de ingressos após confirmação de pagamento
  - Validação de QR codes
  - Consulta de ingressos por usuário

#### 5. Web Client
**Responsabilidade**: Interface web para usuários

- Tecnologias: React, TypeScript, Vite, TanStack Query, Axios, React Router
- Features:
  - Navegação de filmes
  - Visualização de detalhes e sessões
  - Sistema de login
  - Seleção de assentos
  - Checkout de ingressos

## Comunicação entre Serviços

### Síncrona
- HTTP/REST para operações de leitura e comandos diretos
- JSON como formato de troca de dados

### Assíncrona
- RabbitMQ para eventos de domínio
- Porta: 5672 (aplicação), 15672 (management UI)
- Padrões: Event-driven, publish/subscribe

## Requisitos

- Node.js 18+
- PostgreSQL 15+
- RabbitMQ 3+
- pnpm
- Docker e Docker Compose

## Configuração e Execução

### 1. Iniciar Infraestrutura

```bash
docker-compose up -d
```

Serviços iniciados:
- PostgreSQL (user-db: 5434, catalog-db: 5433, session-db: 5435)
- RabbitMQ (5672, management: 15672)

### 2. Configurar Variáveis de Ambiente

Cada serviço possui um arquivo `.env` ou `.env.example`. Configure conforme necessário:

**user-service/.env**
```env
DATABASE_URL="postgresql://user:password@localhost:5434/userdb"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

**catalog-service/.env**
```env
DATABASE_URL="postgresql://admin:password@localhost:5433/catalog_db"
RABBITMQ_URL="amqp://localhost:5672"
```

**session-service/.env**
```env
DATABASE_URL="postgresql://admin:password@localhost:5435/session_db"
RABBITMQ_URL="amqp://localhost:5672"
```

### 3. Instalar Dependências

```bash
# User Service
cd user-service
pnpm install
pnpm prisma generate
pnpm prisma migrate dev

# Catalog Service
cd ../catalog-service
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed

# Session Service
cd ../session-service
pnpm install
pnpm prisma generate
pnpm prisma migrate dev

# Ticket Service
cd ../ticket-service
pnpm install

# Web Client
cd ../web-client
pnpm install
```

### 4. Executar Serviços

Em terminais separados:

```bash
# User Service (porta 3001)
cd user-service && pnpm start:dev

# Catalog Service (porta 3002)
cd catalog-service && pnpm start:dev

# Session Service (porta 3003)
cd session-service && pnpm start:dev

# Ticket Service
cd ticket-service && pnpm start:dev

# Web Client
cd web-client && pnpm dev
```

## Estrutura de Banco de Dados

### User Service
- **User**: id, email, password, role (ADMIN|USER), timestamps

### Catalog Service
- **Movie**: id, title, description, durationMin, genre, releaseDate, posterUrl, timestamps
- **Room**: id, name, capacity
- **Seat**: id, row, number, roomId
- **Session**: id, movieId, roomId, startTime, endTime, price, timestamps

### Session Service
- **SeatReservation**: id, sessionId, seatId, userId, status (LOCKED|SOLD|CANCELED), createdAt, expiresAt
- Unique constraint: (sessionId, seatId)

## Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Cobertura
pnpm test:cov
```

## Documentação Adicional

- **ADR**: `documents/adr/adr001.md` - Decisão arquitetural de microserviços
- **Diagramas C4**: `documents/diagrams/`
  - Context.puml - Diagrama de contexto
  - Container.puml - Diagrama de contêineres
  - CatalogService.puml - Componentes do catálogo
  - SessionService.puml - Componentes de sessão
  - TicketService.puml - Componentes de ingresso
  - UserService.puml - Componentes de usuário

## Stack Tecnológica

### Backend
- NestJS 11.x
- TypeScript 5.x
- Prisma ORM 7.x
- PostgreSQL 15
- RabbitMQ 3.x
- JWT/Passport para autenticação

### Frontend
- React 18.x
- TypeScript 5.x
- Vite 5.x
- TanStack Query
- React Router 7.x

### Infraestrutura
- Docker & Docker Compose
- PostgreSQL (múltiplas instâncias)
- RabbitMQ Management

## Padrões e Práticas

- Domain-Driven Design (DDD)
- Event-Driven Architecture
- Database per Service
- API Gateway pattern (implícito)
- Repository pattern via Prisma
- DTO pattern com class-validator
- Guard pattern para autorização
- Estratégia de autenticação JWT
