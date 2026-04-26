-- Seed sample dishes
INSERT INTO public.dishes (name, description, price, category, available) VALUES
('Bandeja Paisa', 'Plato típico colombiano con frijoles, arroz, carne molida, huevo y arepas', 45000, 'Platos Principales', true),
('Ajiaco Santafereño', 'Sopa tradicional con papas, pollo y crema colombiana', 28000, 'Sopas', true),
('Picadillo de Carne', 'Carne molida con papa y yuca frita', 35000, 'Platos Principales', true),
('Tamales', 'Tamales envueltos en hojas de maíz con carne de cerdo y verduras', 15000, 'Entradas', true),
('Empanadas', 'Empanadas de carne molida o papa y queso', 8000, 'Entradas', true),
('Patacones', 'Plátano frito acompañado con salsa guacamol', 20000, 'Acompañamientos', true),
('Aroz con Pollo', 'Arroz amarillo con pollo deshilachado y verduras', 32000, 'Platos Principales', true),
('Ceviche Colombiano', 'Pescado fresco marinado en limón con vegetales frescos', 38000, 'Platos Principales', true),
('Flan de Caramelo', 'Postre tradicional de flan con caramelo derretido', 12000, 'Postres', true),
('Gelatina', 'Gelatina de frutas naturales', 8000, 'Postres', true),
('Sopa de Mondongo', 'Sopa tradicional de mondongo con papas y maíz', 30000, 'Sopas', true),
('Camarones al Ajillo', 'Camarones frescos salteados al ajillo', 42000, 'Platos Principales', true)
ON CONFLICT DO NOTHING;

-- Seed sample beverages
INSERT INTO public.beverages (name, description, price, category, volume, available) VALUES
('Cerveza Aguila', 'Cerveza lager colombiana', 5000, 'Cervezas', '350ml', true),
('Cerveza Poker', 'Cerveza local preferida', 4500, 'Cervezas', '350ml', true),
('Cerveza Heineken', 'Cerveza importada premium', 8000, 'Cervezas', '350ml', true),
('Ron Viejo de Caldas', 'Ron colombiano de alta calidad', 65000, 'Licores', '750ml', true),
('Vodka Cristal', 'Vodka claro y suave', 45000, 'Licores', '750ml', true),
('Vino Tinto Carmenere', 'Vino tinto chileno', 35000, 'Vinos', '750ml', true),
('Vino Blanco Sauvignon', 'Vino blanco refrescante', 32000, 'Vinos', '750ml', true),
('Agua Mineral', 'Agua mineral sin gas', 2000, 'Bebidas no Alcohólicas', '500ml', true),
('Agua Mineral con Gas', 'Agua mineral con gas', 2000, 'Bebidas no Alcohólicas', '500ml', true),
('Jugo Natural de Naranja', 'Jugo fresco de naranja', 8000, 'Jugos', '1L', true),
('Jugo Natural de Lulo', 'Jugo fresco de lulo colombiano', 9000, 'Jugos', '1L', true),
('Refresco de Guanabana', 'Bebida refrescante de guanábana', 10000, 'Bebidas no Alcohólicas', '1L', true),
('Gaseosa Coca Cola', 'Refresco cola', 3000, 'Bebidas no Alcohólicas', '350ml', true),
('Gaseosa Sprite', 'Refresco de limón', 3000, 'Bebidas no Alcohólicas', '350ml', true),
('Café Colombiano', 'Café molido tradicional colombiano', 6000, 'Bebidas Calientes', '250ml', true),
('Chocolate Caliente', 'Chocolate hecho con leche y cacao', 7000, 'Bebidas Calientes', '250ml', true)
ON CONFLICT DO NOTHING;
