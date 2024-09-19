CREATE OR REPLACE FUNCTION nb_Commandes(compte integer) RETURNS INTEGER AS 
DECLARE nb INTEGER;
BEGIN
    SELECT COUNT(*) INTO nb
    FROM Commande, Particulier
    WHERE LeParticulier = IdParticulier
    AND LeParticulier = compte;
    RETURN nb;
END;