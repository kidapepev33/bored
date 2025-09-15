-- Script para actualizar la estructura de la tabla 'usuarios'
-- Añadir columnas para lastname, phone y gender

-- Primero añadimos las nuevas columnas
ALTER TABLE `usuarios`
    ADD COLUMN `lastname` varchar(100) NOT NULL AFTER `name`,
    ADD COLUMN `phone` varchar(20) NOT NULL AFTER `email`,
    ADD COLUMN `gender` varchar(20) NOT NULL AFTER `phone`;

-- Actualizar registros existentes con valores por defecto
UPDATE `usuarios` 
    SET `lastname` = 'No especificado',
        `phone` = 'No especificado',
        `gender` = 'no-especificado'
    WHERE 1;

-- Añadir un índice para búsqueda rápida por teléfono (opcional)
ALTER TABLE `usuarios`
    ADD INDEX `idx_phone` (`phone`);
