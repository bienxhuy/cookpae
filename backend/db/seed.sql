-- AREA
INSERT INTO area (name, "isActive") VALUES
('Vietnam', true),
('France', true);

-- RECIPE
INSERT INTO recipe (name, description, "userId", "areaId") VALUES
('Phở bò', 'Vietnamese beef noodle soup', 1, 1),
('Phở gà', 'Vietnamese chicken noodle soup', 1, 1),
('Bún chả', 'Grilled pork with rice vermicelli', 1, 1),
('Bánh mì thịt', 'Vietnamese baguette sandwich', 1, 1),
('Flemish Carbonade', 'Belgian beef stew cooked with beer', 1, 2);


-- INGREDIENT
INSERT INTO ingredient (name) VALUES
('Rice noodles'),
('Beef'),
('Chicken'),
('Pork'),
('Fish sauce'),
('Sugar'),
('Garlic'),
('Shallot'),
('Bread'),
('Beef chuck'),
('Onion'),
('Butter'),
('Beer');


-- RECIPE_INGREDIENT
INSERT INTO recipe_ingredient ("order", quantity, unit, "recipeId", "ingredientId") VALUES
(1, 200, 'g', 1, 1),
(2, 150, 'g', 1, 2),
(3, 20, 'ml', 1, 5);

INSERT INTO recipe_ingredient ("order", quantity, unit, "recipeId", "ingredientId") VALUES
(1, 200, 'g', 2, 1),
(2, 150, 'g', 2, 3),
(3, 20, 'ml', 2, 5);

INSERT INTO recipe_ingredient ("order", quantity, unit, "recipeId", "ingredientId") VALUES
(1, 200, 'g', 3, 4),
(2, 30, 'ml', 3, 5),
(3, 10, 'g', 3, 6);

INSERT INTO recipe_ingredient ("order", quantity, unit, "recipeId", "ingredientId") VALUES
(1, 1, 'piece', 4, 9),
(2, 100, 'g', 4, 4),
(3, 10, 'g', 4, 7);

INSERT INTO recipe_ingredient ("order", quantity, unit, "recipeId", "ingredientId") VALUES
(1, 300, 'g', 5, 10),
(2, 1, 'piece', 5, 11),
(3, 50, 'g', 5, 12),
(4, 200, 'ml', 5, 13);
