DROP TABLE IF EXISTS Commande;
DROP TABLE IF EXISTS AssociationTrajet;
DROP TABLE IF EXISTS Trajet;
DROP TABLE IF EXISTS Particulier;
DROP TABLE IF EXISTS Vehicule;
DROP TABLE IF EXISTS Commercant;
DROP TABLE IF EXISTS Producteur;

CREATE TABLE Producteur (
	IdProducteur serial NOT NULL,
	Nom VARCHAR(250) NOT NULL,
	Prenom VARCHAR(250) NOT NULL,
	Societe VARCHAR(100) UNIQUE,
	AdresseSource VARCHAR(250) NOT NULL,
	Mail VARCHAR(250) NOT NULL,
	MotDePasse VARCHAR(250) NOT NULL,
	Tel VARCHAR(255) NOT NULL,
	Lat FLOAT,
	Long FLOAT,
	CONSTRAINT Producteur_pk PRIMARY KEY (IdProducteur)
);



CREATE TABLE Commande (
	IdCommande serial NOT NULL,
	LeProducteur integer NOT NULL,
	LeParticulier integer,
	LeCommercant integer NOT NULL,
	LaDate DATE NOT NULL,
	VolumeCommande integer NOT NULL,
	QRCode integer UNIQUE,
	Etat VARCHAR(255) NOT NULL,
	CONSTRAINT Commande_pk PRIMARY KEY (IdCommande)
);



CREATE TABLE Trajet (
	IdTrajet serial NOT NULL,
	Jours DATE NOT NULL,
	Heure TIME NOT NULL,
	LieuDep VARCHAR(250) NOT NULL,
	LieuArr VARCHAR(250) NOT NULL,
	CONSTRAINT Trajet_pk PRIMARY KEY (IdTrajet)
);



CREATE TABLE Particulier (
	IdParticulier serial NOT NULL,
	Nom VARCHAR(250) NOT NULL,
	Prenom VARCHAR(250) NOT NULL,
	Rayon integer NOT NULL,
	Mail VARCHAR(250) NOT NULL,
	MotDePasse VARCHAR(250) NOT NULL,
	Points integer NOT NULL,
	TypeVehicule integer NOT NULL,
	Tel VARCHAR(255) NOT NULL,
	Disponible BOOLEAN NOT NULL DEFAULT 'true',
	CONSTRAINT Particulier_pk PRIMARY KEY (IdParticulier)
);



CREATE TABLE Vehicule (
	IdTransport serial NOT NULL,
	Nom VARCHAR(255) NOT NULL,
	Volume integer NOT NULL,
	CONSTRAINT Vehicule_pk PRIMARY KEY (IdTransport)
);



CREATE TABLE Commercant (
	IdCommercant serial NOT NULL,
	Nom VARCHAR(250) NOT NULL,
	Prenom VARCHAR(250) NOT NULL,
	AdresseDest VARCHAR(250) NOT NULL,
	MotDePasse VARCHAR(250) NOT NULL,
	Mail VARCHAR(250) NOT NULL,
	Tel VARCHAR(255) NOT NULL,
	Lat FLOAT,
	Long FLOAT,
	Societe VARCHAR(255) UNIQUE,
	CONSTRAINT Commercant_pk PRIMARY KEY (IdCommercant)
);



CREATE TABLE AssociationTrajet (
	CleParticulier serial NOT NULL,
	CleTrajet serial NOT NULL,
	CONSTRAINT AssociationTrajet_pk PRIMARY KEY (CleParticulier,CleTrajet)
);




ALTER TABLE Commande ADD CONSTRAINT Commande_fk0 FOREIGN KEY (LeProducteur) REFERENCES Producteur(IdProducteur);
ALTER TABLE Commande ADD CONSTRAINT Commande_fk1 FOREIGN KEY (LeParticulier) REFERENCES Particulier(IdParticulier);
ALTER TABLE Commande ADD CONSTRAINT Commande_fk2 FOREIGN KEY (LeCommercant) REFERENCES Commercant(IdCommercant);


ALTER TABLE Particulier ADD CONSTRAINT Particulier_fk0 FOREIGN KEY (TypeVehicule) REFERENCES Vehicule(IdTransport);



ALTER TABLE AssociationTrajet ADD CONSTRAINT AssociationTrajet_fk0 FOREIGN KEY (CleParticulier) REFERENCES Particulier(IdParticulier);
ALTER TABLE AssociationTrajet ADD CONSTRAINT AssociationTrajet_fk1 FOREIGN KEY (CleTrajet) REFERENCES Trajet(IdTrajet);


INSERT INTO vehicule VALUES (1,'Velo',25);
INSERT INTO vehicule VALUES (2,'Moto',35);
INSERT INTO vehicule VALUES (3,'Voiture',500);
INSERT INTO vehicule VALUES (4,'Camion',3000);

CREATE OR REPLACE FUNCTION nb_commandes (compte integer) RETURNS INTEGER AS $$
DECLARE nb INTEGER;
BEGIN
    SELECT COUNT(*) INTO nb
    FROM Commande, Particulier
    WHERE LeParticulier = IdParticulier
    AND LeParticulier = compte;
    RETURN nb;
END;
$$ LANGUAGE plpgsql;

