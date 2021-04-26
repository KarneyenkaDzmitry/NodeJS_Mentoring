CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    age INTEGER NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false
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
  
-- ALTER TABLE groups
--   RENAME TO old_groups;
 
-- ALTER TABLE gps
--   RENAME TO groups;
 
 CREATE TABLE groups (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR NOT NULL,
    permissions VARCHAR[]
   );
  
insert into groups (name, permissions) values 
	('admin', '{"READ", "WRITE", "SHARE", "UPLOAD_FILES"}'),
	('user1', '{"READ", "WRITE", "SHARE"}');


CREATE TABLE user_groups(
  user_id uuid NOT NULL,
  group_id uuid NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREATE TABLE groups (
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
--     name VARCHAR NOT NULL
--    );

-- CREATE TABLE permissions (
--     id CHAR NOT NULL PRIMARY KEY,
--     name VARCHAR NOT NULL
--    );

-- INSERT INTO permissions (id, name) VALUES
-- 	('r', 'READ'),
-- 	('w', 'WRITE'),
-- 	('d', 'DELETE'),
-- 	('s', 'SHARE'),
-- 	('u', 'UPLOAD_FILES');

-- CREATE TABLE groups_permissions (
--   group_id uuid NOT NULL,
--   permission_id CHAR NOT NULL,
--   PRIMARY KEY (group_id, permission_id),
--   FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
--   FOREIGN KEY (permission_id) REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE
-- );

-- INSERT INTO groups (id, name) VALUES 
-- 	('8d176e15-2db6-4f89-b1a9-79dd4bfc9f64', 'admin') RETURNING id;
	
-- INSERT INTO groups_permissions (group_id, permission_id) VALUES
-- 	('8d176e15-2db6-4f89-b1a9-79dd4bfc9f64', 'r'),
-- 	('8d176e15-2db6-4f89-b1a9-79dd4bfc9f64', 'w'),
-- 	('8d176e15-2db6-4f89-b1a9-79dd4bfc9f64', 'd'),
-- 	('8d176e15-2db6-4f89-b1a9-79dd4bfc9f64', 's'),
-- 	('8d176e15-2db6-4f89-b1a9-79dd4bfc9f64', 'u');
	