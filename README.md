# 🎓 DevStart Academy

> Protótipo de uma plataforma educacional com conteúdo de programação, geração de certificados em PDF e validação de autenticidade utilizando MongoDB.

**DevStart Academy** é um projeto desenvolvido para demonstrar a integração entre frontend, backend, banco de dados NoSQL e geração dinâmica de documentos.

O sistema simula uma plataforma de cursos online na qual o aluno pode estudar um módulo de MongoDB, responder a um questionário e gerar um certificado demonstrativo com código autenticador e QR Code para consulta.

⚠️ **Aviso:** este projeto é exclusivamente demonstrativo. Os certificados gerados não possuem validade oficial ou reconhecimento profissional.

---

## 📸 Sobre o projeto

A plataforma apresenta uma interface web com tema escuro, conteúdo didático e um fluxo de emissão e consulta de certificados.

### Funcionalidades

- [x] Página inicial da plataforma.
- [x] Módulo educacional sobre comandos essenciais do MongoDB.
- [x] Questionário interativo de conclusão.
- [x] Geração dinâmica de certificados em PDF.
- [x] Identificador único e código autenticador por certificado.
- [x] QR Code direcionado à página de validação.
- [x] Persistência dos dados dos certificados no MongoDB.
- [x] API para consultar certificados pelo código autenticador.
- [x] Interface de validação com tratamento de códigos inexistentes.
- [x] Marca-d'água indicando que os certificados são demonstrativos.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e layout responsivo |
| JavaScript | Interatividade no frontend |
| Node.js | Execução do backend |
| Express | Servidor HTTP e API REST |
| MongoDB | Armazenamento dos certificados |
| MongoDB Node.js Driver | Comunicação com o banco de dados |
| PDFKit | Geração de documentos PDF |
| QRCode | Geração dos QR Codes |
| Docker | Execução do MongoDB em contêiner |
| Nodemon | Reinicialização automática do servidor durante o desenvolvimento |

---

## 🧩 Arquitetura do projeto

```text
devstart-academy/
├── public/
│   ├── index.html
│   ├── curso.html
│   ├── certificado.html
│   ├── validar.html
│   ├── css/
│   └── js/
├── src/
│   ├── routes/
│   │   ├── certificados.js
│   │   └── validacao.js
│   ├── services/
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Organização

- **`public/`**: páginas e recursos da interface.
- **`src/server.js`**: inicialização do servidor e conexão com o MongoDB.
- **`src/routes/certificados.js`**: endpoint de emissão dos certificados.
- **`src/routes/validacao.js`**: endpoint de consulta dos certificados.
- **`.env`**: variáveis de ambiente e credenciais locais.

---

## ⚙️ Pré-requisitos

Para executar o projeto, você precisará de:

- [Node.js](https://nodejs.org/)
- npm, instalado com o Node.js.
- [Docker](https://www.docker.com/)
- Uma instância do MongoDB acessível pela aplicação.

O projeto foi desenvolvido em Windows 11 utilizando WSL e Docker.

---

## 🚀 Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/guilhermetm5/devstart-academy.git
cd devstart-academy
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o MongoDB

Se você já possui um contêiner MongoDB em execução, confirme que ele está acessível na porta `27017`.

Caso precise criar uma instância para desenvolvimento:

```bash
docker run -d \
  --name mongodb \
  -p 127.0.0.1:27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD='SUA_SENHA' \
  -v mongodb_data:/data/db \
  mongo:8
```

Se já existir um contêiner chamado `mongodb`, não execute esse comando novamente. Utilize o contêiner existente ou ajuste a configuração conforme necessário.

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```dotenv
PORT=3000
MONGODB_URI=mongodb://admin:SUA_SENHA@127.0.0.1:27017/?authSource=admin
MONGODB_DB=devstart_academy
```

Substitua `SUA_SENHA` pela senha configurada no MongoDB.

**Importante:** não compartilhe o arquivo `.env` nem envie credenciais ao GitHub.

Se a senha contiver caracteres especiais, codifique-os adequadamente na URI de conexão.

### 5. Inicie a aplicação

Para desenvolvimento:

```bash
npm run dev
```

Para execução sem o Nodemon:

```bash
npm start
```

### 6. Acesse a plataforma

Com o servidor em execução, abra:

| Página | Endereço |
|---|---|
| Página inicial | http://localhost:3000 |
| Módulo MongoDB | http://localhost:3000/curso.html |
| Emissão de certificado | http://localhost:3000/certificado.html |
| Validação de certificado | http://localhost:3000/validar.html |
| Verificação da API | http://localhost:3000/api/health |

---

## 🔄 Fluxo de funcionamento

1. O usuário acessa a plataforma.
2. Estuda o módulo sobre comandos essenciais do MongoDB.
3. Responde ao questionário de conclusão.
4. Preenche o nome para gerar o certificado.
5. O backend gera o PDF com código autenticador e QR Code.
6. Os dados do certificado são persistidos no MongoDB.
7. O usuário consulta a autenticidade por meio do código ou QR Code.
8. A API consulta o registro armazenado e retorna as informações disponíveis.

---

## 🔌 API

### Emitir certificado

**Endpoint:** `POST /api/certificados`

Exemplo de requisição:

```json
{
  "nome": "João Guilherme"
}
```

A API gera o documento PDF e registra os metadados do certificado no MongoDB.

### Consultar certificado

**Endpoint:** `GET /api/validacao/:codigo`

Exemplo:

```text
GET /api/validacao/C29B637F6D04
```

Quando o código existe, a API retorna informações como titular, curso, data de emissão e situação do registro.

Quando o código não é encontrado, retorna uma resposta HTTP `404`.

### Verificar a conexão

**Endpoint:** `GET /api/health`

Retorna informações sobre o estado da aplicação e a conectividade com o MongoDB.

---

## 🔒 Considerações de segurança

Este projeto é um protótipo para fins de aprendizado e demonstração.

- A validação consulta os registros armazenados no MongoDB.
- Os códigos autenticadores são gerados no backend.
- O arquivo `.env` não deve ser versionado.
- A emissão ainda precisa de controles adicionais para garantir que somente alunos que realmente concluíram o curso possam receber certificados.
- A aplicação precisa de medidas adicionais de segurança antes de ser disponibilizada publicamente.

A conclusão do questionário é validada no navegador nesta versão, portanto não deve ser considerada uma comprovação segura de conclusão do curso.

---

## 🗺️ Próximas melhorias

- [ ] Refinar o layout e a legibilidade dos certificados.
- [ ] Ajustar o posicionamento do QR Code e da marca-d'água.
- [ ] Implementar autenticação de usuários.
- [ ] Validar a conclusão do curso no backend.
- [ ] Implementar revogação de certificados.
- [ ] Adicionar testes automatizados para as rotas.
- [ ] Configurar Docker Compose para facilitar a inicialização do ambiente.
- [ ] Melhorar o gerenciamento de erros e os registros da aplicação.
- [ ] Criar uma interface administrativa para consultar certificados.

---

## 📚 Objetivo do projeto

Demonstrar, de maneira prática, como integrar tecnologias web com MongoDB para construir uma aplicação capaz de gerar documentos digitais e disponibilizar mecanismos de consulta dos registros.

O projeto também serve como exercício de desenvolvimento backend, integração com banco de dados NoSQL e geração de documentos programaticamente.

---

## 📄 Licença

Este projeto ainda não possui uma licença de distribuição definida.

---

**DevStart Academy** — Aprenda tecnologia. Construa o futuro. 🚀
