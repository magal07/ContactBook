require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env para process.env.

const express = require('express'); // Importa o framework Express para criação de aplicativos web.
const app = express(); // Cria uma instância do aplicativo Express.

const mongoose = require('mongoose'); // Importa o Mongoose para interagir com o MongoDB.
mongoose.connect(process.env.CONNECTIONSTRING) // Conecta ao banco de dados MongoDB usando a string de conexão armazenada em variáveis de ambiente.
  .then(() => {
    app.emit('Pronto'); // Emite um evento 'Pronto' após a conexão bem-sucedida.
  })
  .catch(e => console.log(e)); // Exibe erros de conexão no console.

const session = require('express-session'); // Importa o express-session para gerenciar sessões de usuário.
const MongoStore = require('connect-mongo'); // Importa connect-mongo para armazenar sessões no MongoDB.
const flash = require('connect-flash'); // Importa connect-flash para enviar mensagens temporárias entre requisições.

const routes = require('./routes'); // Importa o arquivo de rotas.
const path = require('path'); // Importa o módulo path para trabalhar com caminhos de arquivos e diretórios.
const helmet = require('helmet'); // Importa o Helmet para configurar cabeçalhos de segurança.
const csrf = require('csurf'); // Importa csurf para proteção contra ataques CSRF (Cross-Site Request Forgery).

const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // Importa middlewares personalizados para lógica adicional.
// const { json } = require('stream/consumers');

// Configurações de segurança e middlewares
app.use(helmet()); // Adiciona cabeçalhos de segurança ao aplicativo.
// app.use(json()); // Import JSONS
app.use(express.urlencoded({ extended: true })); // Habilita o parsing de dados enviados pelo formulário (application/x-www-form-urlencoded).
app.use(express.static(path.resolve(__dirname, 'public'))); // Define o caminho absoluto para arquivos estáticos (ex. imagens, CSS, JS).

const sessionOptions = session({
  secret: 'sdasdsdsadsadsadsadsadasdsadsa', // Define uma chave secreta usada para assinar cookies.
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }), // Configura o armazenamento de sessões no MongoDB.
  resave: false, // Impede que sessões sejam salvas novamente, a menos que sejam modificadas.
  saveUninitialized: false, // Evita salvar sessões não inicializadas.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // Define que os cookies da sessão expiram após 7 dias.
    httpOnly: true // Torna os cookies acessíveis apenas pelo servidor, não pelo JavaScript no navegador.
  }
});

app.use(sessionOptions); // Ativa o middleware de sessões.
app.use(flash()); // Ativa mensagens temporárias via middleware.

app.set('views', path.resolve(__dirname, './src', 'views')); // Define o caminho absoluto para a pasta de views.
app.set('view engine', 'ejs'); // Define o EJS como mecanismo de visualização para renderizar HTML com código JavaScript.

// Configuração de middlewares
app.use(csrf()); // Habilita a proteção contra ataques CSRF.
app.use(middlewareGlobal); // Middleware global para lógica adicional (personalizado).
app.use(checkCsrfError); // Middleware para tratar erros relacionados ao CSRF.
app.use(csrfMiddleware); // Middleware para configurar tokens CSRF.
app.use(routes); // Ativa as rotas definidas em './routes'.

// Inicialização do servidor
app.on('Pronto', () => { // Escuta o evento 'Pronto' emitido anteriormente para iniciar o servidor.
  app.listen(3000, () => { // Inicia o servidor na porta 3000.
    console.log('Acessar http://localhost:3000'); // Mensagem para acessar o servidor.
    console.log('Server executando na porta 3000'); // Confirmação de que o servidor está ativo.
  });
});