#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER braggingrights;
    CREATE DATABASE braggingrights;
    GRANT ALL PRIVILEGES ON DATABASE braggingrights TO braggingrights;

    CREATE TABLE users (
        id serial PRIMARY KEY,
        display_name VARCHAR ( 50 ) UNIQUE NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        prestige_address VARCHAR ( 50 ),
        mainnet_address VARCHAR ( 50 )
    );

    CREATE TABLE groups (
        id serial PRIMARY KEY,
        name VARCHAR ( 50 ) UNIQUE NOT NULL
    );

    CREATE TABLE user_group_bridge (
        user_id int NOT NULL,
        group_id int NOT NULL,
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES groups (id)
    );

    CREATE TABLE propositions (
        id serial PRIMARY KEY,
        group_id int NOT NULL,
        title VARCHAR (255) NOT NULL,
        description TEXT,
        address VARCHAR(50),
        result BOOLEAN,
        CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES groups (id)
    );

    CREATE TABLE votes (
        id serial PRIMARY KEY,
        user_id int NOT NULL,
        proposition_id int NOT NULL,
        vote BOOLEAN,
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_proposition_id FOREIGN KEY (proposition_id) REFERENCES propositions (id)
    )
EOSQL