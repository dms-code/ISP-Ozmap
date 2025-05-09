
# ISP-OZMAP

Este projeto é uma aplicação para **sincronização de dados** entre o sistema ISP e o serviço Ozmap, utilizando **MongoDB** e **Redis** como bancos de dados, além de serviços simulados via mocks. Ele permite a manutenção e a integração de dados entre essas duas fontes.

## Requisitos

Antes de executar o projeto, você precisará instalar o Docker, MongoDB e Redis.

### Instalar o Docker

1. Se você não tiver o **Docker** instalado, faça o download e instale a partir deste link: [Docker - Download](https://www.docker.com/get-started)

### Iniciar o MongoDB e o Redis via Docker

Após a instalação do Docker, inicie os contêineres do MongoDB e do Redis com os seguintes comandos:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:5.0
docker run -d --name redis -p 6379:6379 redis:latest
```

Isso iniciará os serviços MongoDB e Redis nas portas padrão (27017 para o MongoDB e 6379 para o Redis).

---

## Clonando o Repositório

Para começar, clone o repositório do projeto para sua máquina local:

```bash
git clone https://github.com/dms-code/ISP-Ozmap.git
cd ISP-Ozmap
```

---

## Instalação das Dependências

Após garantir que o MongoDB e o Redis estão em execução, instale as dependências do projeto utilizando o npm:

```bash
npm install
```

---

## Iniciando a Aplicação

Para iniciar a aplicação e os serviços de sincronização, execute o seguinte comando:

```bash
npm start
```

Este comando irá compilar o código, rodar os servidores e iniciar o processo de sincronização com as fontes de dados.

---

## Executando os Testes

Para rodar os testes automatizados, utilize o comando abaixo:

```bash
npm test
```

---

## Scripts Disponíveis

- **start-ozmap**: Inicia o servidor de mock do Ozmap.  
  `npm run start-ozmap`

- **build**: Compila o projeto usando o Webpack.  
  `npm run build`

- **start**: Inicia tanto o servidor de ISP quanto o aplicativo.  
  `npm run start`

- **start-app**: Compila o projeto e inicia o servidor do aplicativo.  
  `npm run start-app`

- **start-isp**: Inicia o servidor de mock do ISP com um arquivo JSON simulado.  
  `npm run start-isp`

- **test**: Executa os testes utilizando o Jest.  
  `npm run test`

---

Caso precise de mais informações ou tenha dúvidas, fique à vontade para abrir uma **issue** ou me contatar diretamente!
