-- create an office database
-- create database office_db;
 use office_db;
-- -- create an department table
-- create table department(
-- id int not null auto_increment,
-- name varchar(30) not null,
-- primary key(id)
-- );
-- create table role
 use office_db;
-- create table role(
-- id int not null auto_increment,
-- title varchar(30) not null,
-- salary decimal(10,5) not null,
-- department_id int,
-- primary key(id),
-- foreign key(department_id) references department(id)  
-- );
alter table role
modify column salary decimal(10,5);
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
-- insert into department(name)values('sales');
-- insert records into role table
insert into role(title,salary,department_id)values('Sales Lead',10000.10,1);
-- insert into employee table
insert into employee(first_name,last_name,role_id)values('Jhon','Doe',3);
insert into employee(first_name,last_name,role_id,manager_id)values('Mike','Chan',3,1);
-- query to select all the employee
-- select e.id as id,e.first_name,e.last_name,r.title,d.name as department,r.salary,m.first_name as Manager_firstname,m.last_name as Manager_lastName
-- from employee e right join role r on e.role_id=r.id 
-- inner join department d on r.department_id=d.id
-- inner join employee m on m.manager_id=e.id
-- view employee by depatment
-- select e.id as id,e.first_name,e.last_name,d.name as department
-- from employee e right join role r on e.role_id=r.id 
-- inner join department d on r.department_id=d.id
-- order by e.id asc
-- view all employee by manager
-- query to select all the employee
select e.id as id,e.first_name,e.last_name,m.first_name as Manager_firstname,m.last_name as Manager_lastName
from employee e inner join employee m on m.manager_id=e.id