# 🎬 Cinema Web Client

Frontend do sistema de venda de ingressos para cinema, desenvolvido com arquitetura de microsserviços. Este projeto consome as APIs de **Catálogo** e **Usuários** para prover a experiência de compra ao cliente final.

## 🚀 Tecnologias

- **React** (Vite)
- **TypeScript**
- **Axios** (Integração com APIs REST)
- **React Router DOM** (Navegação)
- **Lucide React** (Ícones)
- **Docker** (Containerização)

## ✨ Funcionalidades

### 1. Autenticação
- **Login:** Integração com o `user-service`.
- **Gestão de Sessão:** Armazenamento de Token JWT e dados do usuário no LocalStorage.

### 2. Catálogo e Sessões
- **Home:** Listagem de filmes em cartaz (consome `catalog-service`).
- **Detalhes do Filme:** Exibição de sinopse, duração, gênero e lista de sessões disponíveis.

### 3. Fluxo de Compra
- **Mapa de Assentos:** Seleção visual interativa de assentos. O layout da sala (quantidade de fileiras e cadeiras) é gerado dinamicamente baseado nos dados do backend.
- **Seleção de Ingressos:** Escolha entre ingresso **Inteira** ou **Meia-entrada** para cada assento selecionado, com cálculo automático do valor total.
- **Pagamento:** Interface visual para seleção de método de pagamento (Pix ou Cartão).

---

## 📦 Pré-requisitos

Antes de começar, verifique se você possui instalado:

- **Node.js** (Versão 20 ou superior)
- **NPM** (Gerenciador de pacotes)
- **Docker & Docker Compose** (Opcional, para rodar containerizado)

> **Importante:** Para que o Frontend funcione corretamente, os microsserviços de backend (`user-service` e `catalog-service`) e seus respectivos bancos de dados devem estar rodando.

---

## 🛠️ Execução Via Docker

Se preferir rodar toda a stack (Frontend + Backends + Bancos) via Docker, utilize o arquivo docker-compose.yaml na raiz do repositório principal:

1. **Na raiz do projeto (cinema-microsservices):**
   docker-compose up -d --build

## 🛠️ Instalação e Execução (Local)

Siga os passos abaixo para rodar o projeto em ambiente de desenvolvimento local:

1. **Acesse a pasta do projeto:**
   ```bash
   cd web-client

2. **Instale as dependências:**
   npm install

3. **Execute o projeto:**
   npm run dev

4. **Execute o projeto:**
  http://localhost:5173