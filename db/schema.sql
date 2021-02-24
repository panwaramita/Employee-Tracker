-- drop the database if already exist
drop database if exists office_db;
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