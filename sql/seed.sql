INSERT INTO authors (name, email, bio)
VALUES
('Ana Torres', 'ana@example.com', 'Autora de tecnología y educación'),
('Luis Pérez', 'luis@example.com', 'Escribe sobre backend y bases de datos');

INSERT INTO posts (title, content, author_id)
VALUES
('Primer post', 'Contenido del primer post del miniblog', 1),
('Node.js con PostgreSQL', 'Guía básica para conectar Express con PostgreSQL', 2),
('Buenas prácticas REST', 'Consejos para diseñar una API limpia y consistente', 1);