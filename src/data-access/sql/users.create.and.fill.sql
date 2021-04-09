CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    age INTEGER NOT NULL,
    isDeleted BOOLEAN DEFAULT false
   );

INSERT INTO users (login, password, age) VALUES 
('Burger', '1q2w3e', 59),
('Murger', '12345', 49),
('Vurger', 'qwerty', 39),
('Zureh', '1q2w3e', 59),
('Pestr123', '12345', 49),
('Elementsss094', 'qwerty', 39),
('Vividus34', '1q2w3e', 59),
('3892Merin', '12345', 49),
('Zabeyski23', 'qwerty', 39); 

-- DROP TABLE users;