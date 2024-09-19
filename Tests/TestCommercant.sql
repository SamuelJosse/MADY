DELETE FROM Commande;
DELETE FROM AssociationTrajet;
DELETE FROM Trajet;
DELETE FROM Particulier;
DELETE FROM Vehicule;
DELETE FROM Commercant;
DELETE FROM Producteur;
INSERT INTO vehicule VALUES (1,'Velo',25);
INSERT INTO vehicule VALUES (2,'Moto',35);
INSERT INTO vehicule VALUES (3,'Voiture',500);
INSERT INTO vehicule VALUES (4,'Camion',3000);
-----------------------------------
-----Test de la table Commercant---
-----------------------------------

--Insertion normale sans erreur--
INSERT INTO Commercant VALUES (1,'RAOULT','Didier','10 rue de la Forge, PARIS','lemotdepasse','dider.martin@gmail.com','0625453212',3.45216,-2.56321,'LaFermeDes5Sens');
SELECT * FROM Commercant;

--Modification d'un commercant
UPDATE Commercant SET lat = 45, long = -7.0, adressedest = '45 rue Montaigne' WHERE idcommercant = 1;
SELECT * FROM Commercant;

--Test de l'unicite du nom de la societe  ERREUR--
--INSERT INTO Commercant VALUES (2,'KLOPP','Jürgen','8 alle de l île de Méaban, VANNES','azerty','Jürgen.klopp@gmail.com','0785623149',1.5896,-2.64528,'LaFermeDes5Sens');

--Suppression d'un compte normale (Sans commande en cours)--
DELETE FROM Commercant WHERE idcommercant = 1;
SELECT * FROM Commercant;

--Suppression d'un compte avec erreur (Avec commande en cours) ERREUR --
--INSERT INTO Producteur VALUES (1,'RAOULT','Didier','LaFermeDes5Sens','10 rue de la Forge, PARIS','dider.martin@gmail.com','lemotdepasse','0625453212',3.45216,-2.56321);
--INSERT INTO Commercant VALUES (1,'JEAN','Quentin','5 rue de la vie, LAVAL','mdp56','quentin.jean@gmail.com','0625453212',1.586,-1.89645,'Pizza Del Arte');
--INSERT INTO Particulier VALUES (1,'PETIT','Francois',15,'francois.petit@gmail.com','admin1234',1,2,'0299345654','true');
--INSERT INTO Commande VALUES (1,1,1,1,'30/03/2021',40,10245,'existe');
--DELETE FROM Commercant WHERE idcommercant = 1;