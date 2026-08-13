# Nexus Backend

Express + MongoDB + Redis + Kafka + Socket.IO + BullMQ service.

```bash
cp .env.example .env
docker compose up --build
```

- API: http://localhost:5000/api/v1
- Docs: http://localhost:5000/docs
- Health: http://localhost:5000/health

Layering: `routes → middlewares/validations → controllers → services → repositories → models`.