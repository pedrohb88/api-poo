-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 01-Dez-2019 às 22:02
-- Versão do servidor: 10.1.35-MariaDB
-- versão do PHP: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `poo_api`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `number` varchar(10) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `cep` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `customerSince` date DEFAULT NULL,
  `address` int(11) NOT NULL,
  `document` int(11) NOT NULL,
  `paymentMethodId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `number` varchar(50) DEFAULT NULL,
  `issuingBody` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `salary` float NOT NULL,
  `hiringDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `employee_tokens`
--

CREATE TABLE `employee_tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `price` float NOT NULL,
  `itemsQuant` int(11) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `orders_products`
--

CREATE TABLE `orders_products` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `cardNumber` varchar(255) NOT NULL,
  `cardName` varchar(255) NOT NULL,
  `validUntil` date NOT NULL,
  `securityCode` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `expirationDate` date NOT NULL,
  `price` float NOT NULL,
  `manufacturer` varchar(255) NOT NULL,
  `description` text,
  `composicao` text,
  `category` varchar(255) DEFAULT NULL,
  `contraIndicativos` text,
  `efeitosColaterais` text,
  `genericoDe` varchar(255) DEFAULT NULL,
  `desconto` float DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `cpf` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_userId_fk` (`userId`),
  ADD KEY `customers_fk_address` (`address`),
  ADD KEY `customers_fk_document` (`document`),
  ADD KEY `customers_fk_paymentMethod` (`paymentMethodId`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employees_userId_fk` (`userId`);

--
-- Indexes for table `employee_tokens`
--
ALTER TABLE `employee_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_userId_fk` (`userId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_fk_customers` (`customerId`);

--
-- Indexes for table `orders_products`
--
ALTER TABLE `orders_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_products_fk_orders` (`orderId`),
  ADD KEY `orders_products_fk_products` (`productId`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tokens_userId_fk` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_tokens`
--
ALTER TABLE `employee_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders_products`
--
ALTER TABLE `orders_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_fk_address` FOREIGN KEY (`address`) REFERENCES `addresses` (`id`),
  ADD CONSTRAINT `customers_fk_document` FOREIGN KEY (`document`) REFERENCES `documents` (`id`),
  ADD CONSTRAINT `customers_fk_paymentMethod` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `customers_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `employee_tokens`
--
ALTER TABLE `employee_tokens`
  ADD CONSTRAINT `employee_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_fk_customers` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`);

--
-- Limitadores para a tabela `orders_products`
--
ALTER TABLE `orders_products`
  ADD CONSTRAINT `orders_products_fk_orders` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orders_products_fk_products` FOREIGN KEY (`productId`) REFERENCES `products` (`id`);

--
-- Limitadores para a tabela `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
