# Pandemus API

Esta API permite criar, listar, buscar e deletar simulações de propagação com dados de infectados, mortos e recuperados.

## Pré-requisitos

- Docker e Docker Compose instalado e configurado corretamente.

## Instruções de execução

Para iniciar a aplicação, execute:

```bash
docker compose up --build -d
npx prisma migrate dev --name init
```


