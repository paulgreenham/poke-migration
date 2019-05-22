USE sql_intro;

DROP TABLE IF EXISTS pokemon_trainer;
DROP TABLE IF EXISTS trainer;
DROP TABLE IF EXISTS town;
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS pokemon_type;

CREATE TABLE pokemon_type(
    id TINYINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(10)
);

CREATE TABLE pokemon(
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(20),
    type TINYINT,
    height SMALLINT,
    weight SMALLINT,

    FOREIGN KEY(type) REFERENCES pokemon_type(id)
);

CREATE TABLE town(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    town VARCHAR(20)
);

CREATE TABLE trainer(
    id TINYINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    town INT,

    FOREIGN KEY(town) REFERENCES town(id)
);

CREATE TABLE pokemon_trainer(
    p_id INT,
    t_id TINYINT,
    FOREIGN KEY(p_id) REFERENCES pokemon(id),
    FOREIGN KEY(t_id) REFERENCES trainer(id)
);