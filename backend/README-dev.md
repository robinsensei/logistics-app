Local development setup

This project uses PostgreSQL. The application already has the following defaults in `src/main/resources/application.properties`:

- spring.datasource.url=jdbc:postgresql://localhost:5432/logistics_db
- spring.datasource.username=postgres
- spring.datasource.password=akolangnakakaalam

Start PostgreSQL with Docker Compose:

```powershell
# From the project root in PowerShell or cmd (if you have Docker Desktop):
docker compose up -d
```

Verify the container is running:

```powershell
docker ps
# or check logs
docker logs logistics-pg
```

Run the Spring Boot app:

```cmd
mvnw.cmd spring-boot:run
```

Test endpoints with Postman:
- POST /api/auth/signup
- POST /api/auth/signin

Notes:
- If Docker isn't installed, install Docker Desktop for Windows and enable "Use the WSL 2 based engine" (recommended).
- After starting Postgres, Hibernate will create/update schema automatically (spring.jpa.hibernate.ddl-auto=update).
- For production, do NOT keep credentials in `application.properties` — use environment variables or a secret manager.
