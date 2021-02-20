-- create an office database
create database office_db;
 use office_db;
-- create an department table
create table department(
id int not null auto_increment,
name varchar(30) not null,
primary key(id)
);
-- create table role
create table role(
id int not null auto_increment,
title varchar(30) not null,
salary decimal(10,5) not null,
department_id int,
primary key(id),
foreign key(department_id) references department(id)  
);
-- create table employee
create table employee(
id int not null auto_increment,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id int,
manager_id int,
primary key(id),
foreign key(role_id) references role(id),
foreign key(manager_id) references employee(id) 
);
-- insert records into department table
insert into department(name)values('sales');
insert into department(name)values('productions');

-- insert records into role table
insert into role(title,salary,department_id)values('Sales Lead',10000.10,1);
insert into role(title,salary,department_id)values('Production Lead',9000.10,2);
-- insert records into employee table
insert into employee(first_name,last_name,role_id)values('Jhon','Doe',3);
insert into employee(first_name,last_name,role_id,manager_id)values('Mike','Chan',3,1);
