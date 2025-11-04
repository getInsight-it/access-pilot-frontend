<p align="center" style="width: 100%; padding: 16pt 8pt 4pt 8pt;">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/img/accesspilot-w.svg" />
      <source media="(prefers-color-scheme: light)" srcset="public/img/accesspilot-logo.svg" />
      <img alt="logotipo Access Pilot" src="public/img/accesspilot-logo.svg" style="max-width: 90%; height: auto;" />
    </picture>
</p>

# Access Pilot - Frontend


![react](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![typescript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite)
![yarn](https://img.shields.io/badge/Yarn-1.22.22-2C8EBB?style=for-the-badge&logo=yarn)


> "Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering." — Yoda

---

Olá! Este é o frontend do [Access Pilot](https://github.com/getInsight-it/access-pilot). Um produto [getInsight](https://resolva.getinsight.it).

## 🚀 Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **React 18.3.1**
- **TypeScript 5.5.3**
- **Vite 5.4.1**
- **Radix UI**
- **Tailwind CSS**

## 📋 Pré-requisitos

Para continuar, atente aos pré-requisitos:

- **Node.js 18+ ou 20+**
  - Como instalar?
    - Via [NVM](https://github.com/nvm-sh/nvm): `nvm install 20` (**recomendado**)
    - Instalação manual: [baixar](https://nodejs.org/)
- **Yarn 1.22.22**
  - Como instalar?
    - Via npm: `npm install -g yarn@1.22.22` (**recomendado**)
    - Instalação manual: [baixar](https://classic.yarnpkg.com/en/docs/install)

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/getInsight-it/accesspilot-frontend.git
cd accesspilot-frontend
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Edite o arquivo `public/assets/env/env.js` com as configurações do seu ambiente:

```javascript
window.env = {
  API_URL: 'https://api.accesspilot.dev.getinsight.tech',
  FRONTEND_URL: 'http://localhost:5173',
  KEYCLOAK_URL: 'https://keycloak.cloud.getinsight.tech',
  KEYCLOAK_REALM: 'access-pilot',
  KEYCLOAK_CLIENT_ID: 'accesspilot-frontend',
  KEYCLOAK_REFRESH_TOKEN_TIME: 30,
  DASHBOARD_REFRESH_INTERVAL: 5000000000
}
```

### 4. Execute o projeto

```bash
# Modo desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview da build de produção
yarn preview
```

O projeto estará disponível em `http://localhost:5173`

## 🧪 Linting

```bash
# Executar ESLint
yarn lint
```

## 🤝 Como contribuir?

Para contribuir com o projeto, começe lendo as orientações do [CONTRIBUTING.md](CONTRIBUTING.md). Além disso, esperamos que todos os participantes da comunidade cumpram nosso [Código de Conduta](CODE_OF_CONDUCT.md). Por favor, leia-o e siga-o.
