DELIMITER $$
CREATE FUNCTION newID()
RETURNS varchar(12)
BEGIN
	DECLARE numStu DEC(10,0) DEFAULT 0;
    SELECT COUNT(*) INTO numStu FROM student;
    
    RETURN CONCAT('STUDENT', CAST(numStu + 1 AS CHAR));
END $$
DELIMITER ;