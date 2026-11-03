# 💰 FinControl — Expense Wise Buddy

<div align="center">

![FinControl Banner](https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d47d1561-2a3d-4ced-b5d9-661c83a3c05f/id-preview-fac5682a--a3c74eca-6968-4011-bb54-4a0fb21d42a1.lovable.app-1779206916474.png)

**Plataforma moderna, intuitiva e responsiva para gestão financeira pessoal e empresarial.**  
Controle suas despesas, receitas, orçamentos mensais e investimentos com gráficos dinâmicos e sincronização em tempo real.

[![Vercel](https://img.shields.io/badge/Vercel-Produção%20Ativa-black?style=for-the-badge&logo=vercel)](https://expense-wise-buddy-18.vercel.app)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/router)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

[Acessar Plataforma](https://expense-wise-buddy-18.vercel.app) • [Funcionalidades](#-funcionalidades) • [Como Executar](#-como-executar-localmente) • [Arquitetura](#-arquitetura-e-tecnologias) • [Estrutura](#-estrutura-do-projeto)

</div>

---

## 🚀 Sobre o Projeto

O **FinControl (Expense Wise Buddy)** foi projetado para simplificar e transformar a maneira como você lida com as suas finanças. Combinando uma interface limpa e minimalista com uma arquitetura técnica robusta, a aplicação oferece visibilidade total sobre o fluxo de caixa, permitindo planejar orçamentos por categoria, monitorar rendimentos de investimentos e manter o controle orçamentário diário na palma da sua mão.

A aplicação foi construída com foco em **Mobile-First**, garantindo excelente usabilidade tanto em smartphones quanto em telas ultra-wide.

---

## ✨ Funcionalidades

### 📊 1. Dashboard Financeiro Completo
- **Indicadores Rápidos (KPIs)**: Total de receitas, total de despesas, saldo líquido atual e taxa de poupança/investimento.
- **Gráficos Interativos**: Distribuição visual de gastos por categoria e comparativos mensais com a biblioteca [Recharts](https://recharts.org).
- **Linha do Tempo Recente**: Extrato das últimas transações com badges coloridos e valores formatados em padrão BRL (`R$ 0.000,00`).

### 💸 2. Controle de Despesas e Receitas
- **Lançamentos Detalhados**: Cadastro com título, valor, categoria, data e observações.
- **Datas sem Erro de Fuso**: Algoritmo seguro de parsing de datas locais (eliminando o clássico bug de D-1 gerado por fuso UTC).
- **Filtros e Ações Rápidas**: Exclusão e listagem cronológica com confirmação visual instantânea via toasts (`Sonner`).

### 🎯 3. Orçamento Mensal Inteligente
- **Metas por Categoria**: Definição de limites financeiros para Alimentação, Moradia, Transporte, Lazer, Saúde e outras categorias.
- **Barras de Progresso Dinâmicas**: Mudança de coloração (verde, amarelo e vermelho) à medida que o limite estipulado se aproxima do teto.

### 📈 4. Painel de Investimentos
- **Acompanhamento Patrimonial**: Cadastro de aportes em Renda Fixa, Ações, Fundos Imobiliários e Criptomoedas.
- **Cálculo de Evolução**: Comparativo do crescimento patrimonial mês a mês com indicação percentual de valorização.

### 📱 5. Experiência Mobile-First (UI/UX)
- **Barra de Navegação Inferior (Bottom Bar)**: Acesso rápido às seções principais sem ocupar espaço útil da tela.
- **Header Inteligente com Dropdown**: Acesso ágil ao perfil do usuário e atalho para logout.
- **Skeletons de Carregamento**: Transições suaves entre páginas sem travamentos ou saltos de layout.

---

## 🛠️ Arquitetura e Tecnologias

O projeto utiliza o que há de mais moderno no ecossistema JavaScript/TypeScript:

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estática rigorosa e segurança contra bugs |
| **Framework Base** | [React 19](https://react.dev/) | Componentização reativa com hooks modernos |
| **Roteamento & App Engine** | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) | Roteamento baseado em arquivos com tipagem ponta a ponta |
| **Gerenciamento de Estado** | [@tanstack/react-query](https://tanstack.com/query) v5 | Cache inteligente, mutações reativas e invalidação automática |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com/) | Estilização utilitária de alta performance e dark/light tokens |
| **Componentes de UI** | [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/) | Primitivas acessíveis (WAI-ARIA) e ícones modernos |
| **Gráficos** | [Recharts](https://recharts.org/) | Renderização SVG responsiva de gráficos de pizza e barras |
| **Feedback ao Usuário** | [Sonner](https://sonner.emilkowal.ski/) | Notificações toast animadas e informativas |
| **Backend & Autenticação** | [Supabase](https://supabase.com/) | Auth de usuários, sessões e persistência de dados |
| **Build & Deploy** | [Nitro](https://nitro.unjs.io/) + [Vercel](https://vercel.com/) | Preset de build automatizado e deploy contínuo em Edge CDN |

---

## 📂 Estrutura do Projeto

```text
expense-wise-buddy-18/
├── public/                 # Arquivos públicos e robots.txt
├── src/
│   ├── components/         # Componentes compartilhados
│   │   ├── ui/             # Primitivas Radix/Tailwind (button, card, dialog, input...)
│   │   └── AppShell.tsx    # Layout base com sidebar desktop e bottom bar mobile
│   ├── hooks/              # Hooks auxiliares
│   ├── integrations/       # Conexão com serviços externos
│   │   └── supabase/       # Cliente e tipagens do Supabase
│   ├── lib/                # Funções de negócio e utilitários
│   │   ├── auth.tsx        # Contexto de autenticação
│   │   ├── finance.ts      # Regras de cálculo, formatação monetária e datas locais
│   │   └── storage.ts      # Hooks reativos do React Query (useExpenses, useIncomes...)
│   ├── routes/             # Rotas do sistema (File-based Routing)
│   │   ├── __root.tsx      # Shell principal e configuração de providers
│   │   ├── index.tsx       # Dashboard principal (/)
│   │   ├── auth.tsx        # Tela de login e cadastro (/auth)
│   │   ├── despesas.tsx    # Módulo de despesas (/despesas)
│   │   ├── receitas.tsx    # Módulo de receitas (/receitas)
│   │   ├── orcamento.tsx   # Gestão de orçamentos (/orcamento)
│   │   ├── investimentos.tsx # Painel de investimentos (/investimentos)
│   │   └── perfil.tsx      # Dados do usuário (/perfil)
│   ├── client.tsx          # Ponto de entrada de hidratação no cliente
│   ├── router.tsx          # Instanciação do roteador do TanStack
│   ├── server.ts           # Configuração de requisições SSR
│   └── styles.css          # Estilos globais e tokens Tailwind
├── package.json            # Dependências e scripts
├── vite.config.ts          # Configuração Vite + Nitro Vercel
└── vercel.json             # Redirecionamentos e regras de roteamento Vercel
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 20+ ou [Bun](https://bun.sh/) (recomendado).
- [Git](https://git-scm.com/) instalado.

### 1. Clonar o repositório
```bash
git clone https://github.com/karla08C/expense-wise-buddy-18.git
cd expense-wise-buddy-18
```

### 2. Instalar as dependências
Com o **Bun**:
```bash
bun install
```
Ou com o **npm**:
```bash
npm install --legacy-peer-deps
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as credenciais do seu projeto Supabase:
```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sua-anon-publishable-key"
```

### 4. Iniciar o servidor de desenvolvimento
```bash
bun dev
# ou
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu navegador para visualizar a aplicação.

### 5. Compilar para produção
```bash
bun run build
# ou
npm run build
```

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Sinta-se livre para utilizar, contribuir e aprimorar!
