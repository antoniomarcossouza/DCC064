# DCC064 - Sistemas Distribuídos

## Arquitetura

```mermaid
flowchart LR
    A((P))
    B[/Queue/]
    C((C))

    A --> B
    B --> C
```

## Passo 1: Rodar o RabbitMQ com a imagem do Docker

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
```
