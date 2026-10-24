# PostgreSQL SSL-mode diagnostic — 24 October 2026

The Preview build reports a `pg-connection-string` warning about how the modes `prefer`, `require`, and `verify-ca` are interpreted. This is a compatibility warning from the connection-string parser; it is not enough by itself to prove that the application is currently using an insecure connection or to safely change the production URI.

The `DATABASE_URI` value is a Sensitive Vercel variable and cannot be read back through the available project-environment API. It was not exposed, rewritten, or printed. Do not paste it into chat, logs or a PR.

## Safe verification

1. On a machine that already has the correct private `DATABASE_URI` in `.env.local`, run `npm run check:db-ssl`.
2. The script reports only the sanitized `sslmode`, `uselibpqcompat` and a coarse database-provider classification. It never prints the hostname, username, password, database name or connection string.
3. If the mode is `require` and the warning comes from that same deployment, choose semantics deliberately with the database owner/provider. The parser message offers two distinct directions: add `uselibpqcompat=true` alongside `sslmode=require` to preserve libpq-compatible `require` semantics, or explicitly use `sslmode=verify-full` to keep full certificate/host verification. These are not equivalent security policies.
4. Confirm the provider-supported URI format and run a database connectivity smoke test in Preview before changing Production.

No production SSL mode has been changed. The warning stays documented until the actual private URI and desired TLS semantics can be verified without exposing credentials.