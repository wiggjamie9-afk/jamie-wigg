-- Runs once, on first Postgres init, before any app connects.
-- Creates one database per DB-backed app. All apps connect as the
-- `postgres` superuser (single POSTGRES_PASSWORD) to their own database.

CREATE DATABASE miniflux;
CREATE DATABASE gitea;
CREATE DATABASE umami;

-- Miniflux requires the hstore extension in its database.
\connect miniflux
CREATE EXTENSION IF NOT EXISTS hstore;
