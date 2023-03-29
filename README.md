# DCC064 - Sistemas Distribuídos

## Arquitetura

```mermaid
flowchart LR
    A((P))
    B((X))
    C1[/Queue/]
    C2[/Queue/]
    D((C1))
    E((C2))

    A --> B
    B --> C1
    C1 --> D
    B --> C2
    C2 --> E
```

## Passo 1: Rodar o RabbitMQ com a imagem do Docker

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
```
