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
------------------------------------
-----Test de la table Commande------
------------------------------------

--Insertion normale sans erreur--
INSERT INTO Producteur VALUES (1,'RAOULT','Didier','LaFermeDes5Sens','10 rue de la Forge, PARIS','dider.martin@gmail.com','lemotdepasse','0625453212',3.45216,-2.56321);
SELECT * FROM Producteur;
INSERT INTO Commercant VALUES (1,'JEAN','Quentin','5 rue de la vie, LAVAL','mdp56','quentin.jean@gmail.com','0625453212',1.586,-1.89645,'Pizza Del Arte');
SELECT * FROM Commercant;
INSERT INTO Particulier VALUES (1,'PETIT','Francois',15,'francois.petit@gmail.com','admin1234',1,2,'0299345654','true');
SELECT * FROM Particulier;
INSERT INTO Commande VALUES (1,1,1,1,'30/03/2021',40,10245,'existe');
SELECT * FROM Commande;

--Insertion normale sans Particulier--
INSERT INTO Commande VALUES (2,1,null,1,'30/03/2021',10,256397,'existe');
SELECT * FROM Commande;


--Test de l'unicite du numero de QRCODE ERREUR
--INSERT INTO Commande VALUES (3,1,1,1,'30/03/2021',80,10245,'existe');

--Modification de l'état d'une commande--
UPDATE Commande SET etat = 'prise' WHERE idcommande = 1;
SELECT * FROM Commande;

--Modification de la date  d'une commande--
UPDATE Commande SET ladate = '2021-03-25' WHERE idcommande = 1;
SELECT * FROM Commande;

--Modification de du producteur qui existe pas d'une commande ERREUR --
--UPDATE Commande SET leproducteur = 2 WHERE idcommande = 1;
--SELECT * FROM Commande;

--Modification de du commercant qui existe pas d'une commande ERREUR --
--UPDATE Commande SET lecommercant = 45 WHERE idcommande = 1;
--SELECT * FROM Commande;

