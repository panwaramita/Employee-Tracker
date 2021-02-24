 use office_db;
-- insert records into department table
insert into department(name)values('Sales');
insert into department(name)values('Engineering');
insert into department(name)values('Finance');

-- insert records into role table
insert into role(title,salary,department_id)values('Sales Lead',10000,1);
insert into role(title,salary,department_id)values('Lawyer',80000,2);
insert into role(title,salary,department_id)values('SalesPerson',90000,2);
-- insert records into employee table
insert into employee(first_name,last_name,role_id,manager_id)values('Jhon','Doe',3,2);
insert into employee(first_name,last_name,role_id,manager_id)values('Mike','Chan',1,1);
insert into employee(first_name,last_name,role_id,manager_id)values('Kevin','Tupik',2,2);
