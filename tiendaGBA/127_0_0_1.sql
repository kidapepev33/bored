-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-11-2025 a las 19:55:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tiendagba`
--
CREATE DATABASE IF NOT EXISTS `tiendagba` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tiendagba`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_envio`
--

CREATE TABLE `metodo_envio` (
  `env_id` int(100) NOT NULL,
  `name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_envio`
--

INSERT INTO `metodo_envio` (`env_id`, `name`) VALUES
(1, 'Correo'),
(2, 'DHL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` varchar(255) NOT NULL,
  `plataform` varchar(255) NOT NULL,
  `stock` int(250) NOT NULL,
  `precio` int(255) NOT NULL,
  `img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `category`, `plataform`, `stock`, `precio`, `img`) VALUES
(1, 'Elden Ring', 'Juego RPG de accion donde puedes ser lo que quieras ser', 'RPG', 'Pc', 270, 8000, 'assets/images/products/Elden_ring.jpg'),
(2, 'Slime Rancher', 'Juego donde tienes slimes y eres feliz en la granja, tu vida ideal donde tu esposa no te dejo y te quito la casa junto a los niños', 'Sandbox', 'Pc', 16, 2900, 'assets/images/products/Slime_Rancher_2.jpg'),
(3, 'Silksong', 'Barato por fuera caro por dentro, bichos te estafan, mueres y pateas a tu hijo por no traer la cerveza', 'Metroidvania', 'Nintendo', 3, 2000, 'assets/images/products/Silksong.png'),
(4, 'Terraria', 'Juego conocido como minecraft 2D, diferencias ninguna, bosses muchos, vale la pena? te dire lo siguiente, hay una furra zoologista, con eso he dicho suficiente no?', 'Sandbox', 'Multi', 350, 8500, 'assets/images/products/Terraria_1759369950.jpg'),
(5, 'Doki Doki Literature Club', 'I WANTED FOR CHRISTMASS, daselos a los niños y seran felices viendo monas chinas, ignora todo lo que dicen acerca de este hermoso juego y velo', 'Terror', 'Multi', 200, 12000, 'assets/images/products/Doki_Doki_Literature_Club_1759370446.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifa_env`
--

CREATE TABLE `tarifa_env` (
  `tar_id` int(100) NOT NULL,
  `env_id` int(250) NOT NULL,
  `Provincia` varchar(250) NOT NULL,
  `Canton` varchar(250) NOT NULL,
  `Distrito` varchar(250) NOT NULL,
  `tarifa` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarifa_env`
--

INSERT INTO `tarifa_env` (`tar_id`, `env_id`, `Provincia`, `Canton`, `Distrito`, `tarifa`) VALUES
(1, 1, 'Alajuela', 'San Carlos', 'Aguas Zarcas', '2000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `name`, `lastname`, `email`, `phone`, `gender`, `password`, `rol`) VALUES
(1, 'admin', 'No especificado', 'admin123@gmail.com', 'No especificado', 'no-especificado', '123', 'admin'),
(3, 'Daniel Barrantes Chaves', 'No especificado', 'danibarrantesv33@gmail.com', 'No especificado', 'no-especificado', '$2y$10$bifnbnhReGdGUq899n4Ah.r/YcBRj3yHlLQlNnwnDa3aO3y/aKdeO', 'admin'),
(4, 'Alfredito.com', 'No especificado', 'Alfredito@gmail.com', 'No especificado', 'no-especificado', '$2y$10$yX6le4ia60hbeQvWdCwILub1CwI3.ZPLEIxitw1rfobwnFFPA1ZK.', 'client'),
(5, 'Daniel', 'Barrantes Chaves', 'test@gmail.com', '83123773', 'masculino', '123456', 'client'),
(6, 'paki', 'dermo', 'paki@gmail.com', '78958545', 'femenino', '$2y$10$T7U4E.d0CSMYMPt6d7yjFOv1yyEp1UheouUd.3Lp9cHmzy/5vqD5O', 'client'),
(7, 'sasa', 'sasa', 'sasa@gmail.com', '21212121', 'femenino', '$2y$10$eQJmtsmyczXpLn92n96XtOL4PTTun5dWmKiuQuVmR529dkIGLMnYC', 'admin'),
(8, 'wqwq', 'wqwq', 'wqwq@gmail.com', '21212121', 'masculino', '$2y$10$B6hjDIHVaxSzMXrra6jkUuwWv3BtVYheQvlirEnW1JYO9v/cqQUJq', 'client'),
(9, 'Client', 'Test', 'client@gmail.com', '0000-0000', 'otro', '$2y$10$E5G3rEt1.o4taXha2x8oUuq7QVUaQXTN1IF/Jq6DA3P1KgRAR8faS', 'client');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `metodo_envio`
--
ALTER TABLE `metodo_envio`
  ADD PRIMARY KEY (`env_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `tarifa_env`
--
ALTER TABLE `tarifa_env`
  ADD PRIMARY KEY (`tar_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `idx_phone` (`phone`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tarifa_env`
--
ALTER TABLE `tarifa_env`
  MODIFY `tar_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
