-- this script is for setting uo the wbsite database and filled with needed credentials
CREATE USER IF NOT EXISTS websiteuser IDENTIFIED BY 'websitepassword';
GRANT INSERT, SELECT, UPDATE, DELETE ON ticket_system_user_login.* TO websiteuser;

CREATE TABLE IF NOT EXISTS website_accounts (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(25) NOT NULL,
  pass VARCHAR(70) NOT NULL,
  role VARCHAR(25) NOT NULL,
  balance INT NOT NULL
);


INSERT INTO website_accounts(user, pass, role, balance)
	VALUES("admin", "$2a$10$0fLT.7awKegrzBiiuLIeDeydRmA1nWTc6Ug1smG27nJMIrql13W7y", "admin", 1000);
