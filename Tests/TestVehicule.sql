DELETE FROM Commande;
DELETE FROM AssociationTrajet;
DELETE FROM Trajet;
DELETE FROM Particulier;
DELETE FROM Vehicule;
DELETE FROM Commercant;
DELETE FROM Producteur;
------------------------------------
-----Test de la table Vehicule------
------------------------------------

--Insertion normale sans erreur--
INSERT INTO Vehicule VALUES (1,'Voiture',40);
SELECT * FROM Vehicule;

--Insertion avec erreur--
--INSERT INTO Vehicule VALUES (1,'Velo',10);

--Update avec le même vehicule mais pas la même quantité OK--
INSERT INTO Vehicule VALUES (2,'Camion',60);
SELECT * FROM Vehicule;
UPDATE Vehicule SET nom = 'Voiture', volume= 456456 WHERE idtransport = 1;
SELECT * FROM Vehicule;

