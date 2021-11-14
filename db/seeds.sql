INSERT INTO department(name)
VALUES 
("IT"),
("Finance & Accounting"),
("Sales & Marketing"),
("Operations"),
("Human Resources");

INSERT INTO role(title, salary, department_id)
VALUES
('Full Stack Developer', 90000, (select id from department where name ='IT')),
('Software Engineer', 120000, 1),
('Accountant', 75000, 2),
('Financial Analyst', 80000, 2),
('Sales Person', 85000, 3),
('Marketing Manager', 180000, 3),
('Project Manager', 120000, 4),
('Operations Manager', 70000, 4),
('HR Director', 90000, 5),
('Recruitment Officer', 80000, 5);

-- employee seeds
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Mabel', 'Miller', 1 , null),
 ('John', 'Gomez', (select id from role where title ='Software Engineer'), 1),-- (select id from employee where first_name ='Mabel'));
 ('William', 'Toz', 3, null),
('Ana', 'West', 4, 2),
('Katherine', 'Jacobs', 6, null),
('Fay', 'Beneventi', 8, 4),
('David', 'Dhawan', 5, null),
('Varun', 'Dhawan', 7, null),
('Kerri', 'Allen', 9, 5),
('Samiksha', 'Green', 10, null);