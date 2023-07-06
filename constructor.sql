/* CREATE DATABASE "db_typescript";
\c "db_typescript" */

CREATE TABLE public.users (
	"id" varchar(36) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
    "name" varchar(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP,
	"deleted_at" TIMESTAMP,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);