## Development

```bash
docker-compose -f docker-compose-dev.yml up --build
```

### Generate New Prisma Migration

```bash
docker-compose -f docker-compose-dev.yml run server yarn run migrate-commit
```

Backend: http://localhost:4000
Backend: http://localhost:4000/graphql
