INSERT INTO producto (nombre, precio, existencia, categoria, descripcion, imagen)
VALUES
('Intel Core i7', 399.99, 100, 'cpus', 'Intel® Core™ i7-14700K New Gaming Desktop Processor 20 cores (8 P-cores + 12 E-cores) with Integrated Graphics', '/images/i7.jpg'),
('Intel Core i9', 649.99, 100, 'cpus', 'Intel Core i9-14900 Procesador de escritorio 24 núcleos (8 núcleos P + 16 núcleos E) hasta 5.8 GHz', '/images/i9.jpg'),
('AMD Ryzen 7 5800X 8-core', 449.00, 100, 'cpus', 'AMD Ryzen 7 5800X 8-core, 16-Thread Unlocked Desktop Processor', '/images/ryzen7.jpg'),
('AMD Ryzen 9 5900X 12-core', 649.99, 100, 'cpus', 'AMD Ryzen 9 5900X 12-core, 24-Thread Unlocked Desktop Processor', '/images/ryzen9.jpg'),
('EVGA GeForce RTX 3090', 645.00, 100, 'gpus', 'EVGA GeForce RTX 3090 FTW3 Ultra Gaming, 24GB GDDR6X, tecnología iCX3, ARGB LED, placa trasera de metal, 24G-P5-3987-KR', '/images/3090.jpg'),
('MSI GeForce RTX 4090', 1800.00, 100, 'gpus', 'MSI Tarjeta gráfica GeForce RTX 4090 24GB GDRR6X 384-Bit HDMI/DP Nvlink Tri Frozr 3 Ada Lovelace Architecture (RTX 4090 Gaming Trio 24G)', '/images/4090.jpg'),
('MSI GeForce GTX 1660 Ti', 253.72, 100, 'gpus', 'MSI Gaming GeForce GTX 1660 Ti 192-bit HDMI/DP 6GB GDRR6 HDCP Support DirectX 12 Dual Fan VR Ready OC Graphics Card (GTX 1660 TI GAMING X 6G)', '/images/1660ti.jpg'),
('MSI GeForce RTX 2080 Ti', 520.00, 100, 'gpus', 'MSI Tarjeta gráfica GeForce RTX 2080 Ti GDRR6 de 352 bits HDMI/DP/USB Ray Tracing Turing Architecture (RTX 2080 TI Gaming X Trio)', '/images/2080ti.jpg'),
('Motherboard ROG STRIX B550-F GAMING', 645.00, 100, 'motherboards', 'ROG STRIX B550-F GAMING WIFI II - Tarjeta madre para AMD AM4 (3ra Gen Ryzen) y ATX, PCIe 4.0,WiFi 6E, LAN 2.5Gb, BIOS Flashback, HDMI 2.1, iluminación Aura Sync RGB direccionable de 2nda', '/images/motherboard1.jpg'),
('Motherboard TUF Gaming', 760.00, 100, 'motherboards', 'TUF Gaming Desktop Motherboard - Chipset Intel Z790 - Socke', '/images/motherboard2.jpg'),
('Motherboard ASRock B760M Pro', 840.00, 100, 'motherboards', 'ASRock Placa base B760M Pro RS/D4, compatible con CPU Intel de 12ª y 13ª generación (LGA1700), chipset B760, placa base DDR4 Micro ATX', '/images/motherboard3.jpg'),
('Motherboard Asus Prime B550-PLUS', 580.00, 100, 'motherboards', 'Asus Prime B550-PLUS - Placa base de escritorio - Chipset AMD B550 - Enchufe AM4 - ATX - 128 GB DDR4 SDRAM RAM máxima - DIMM', '/images/motherboard4.jpg'),
('Ram Corsair VENGEANCE RGB PRO', 450.00, 100, 'ram', 'Corsair VENGEANCE RGB PRO SL DDR4 32 GB (2 x 16 GB) 3600 MHz CL18 Intel XMP 2.0 AMD Ryzen iCUE Memoria de computadora compatible - Negro (CMH32GX4M2D3600C18)', '/images/ram1.png'),
('Ram CORSAIR VENGEANCE RGB DDR5', 580.00, 100, 'ram', 'CORSAIR VENGEANCE RGB DDR5 RAM 32 GB (2 x 16 GB) 6400 MHz CL36 Intel XMP iCUE Memoria de computadora compatible - Negro (CMH32GX5M2B6400C36)', '/images/ram2.jpg'),
('Ram CORSAIR VENGEANCE RGB DDR5', 260.00, 100, 'ram', 'Corsair Vengeance LPX 16GB (2 X 8GB) DDR4 3600 MHz (PC4-28800) C18 1.35V Memoria de escritorio - Negro (CMK16GX4M2D3600C18)', '/images/ram3.jpg'),
('Ram G.SKILL Trident Z RGB Series (Intel XMP)', 390.00, 100, 'ram', 'G.SKILL Trident Z RGB Series (Intel XMP) DDR4 RAM 32 GB (2 x 16 GB) 3600MT/s CL18-22-22-42 1.35V Memoria UDIMM (F4-3600C18D-32GTZR)', '/images/ram4.jpg'),
('Unidad de disco duro externo portátil Seagate', 190.00, 100, 'storage', 'Unidad de disco duro externo portátil Seagate de 2 TB con puerto USB 3.0 para PC, Mac, PlayStation y Xbox además de 1 año de Rescue Service', '/images/externo.jpg'),
('Disco duro interno', 100.00, 100, 'storage', 'Seagate BarraCuda - Disco duro interno de 1 TB – 3.5 pulgadas SATA 6 Gb/s 7200 RPM caché de 64 MB para computadora de escritorio (ST1000DM010)', '/images/hdd.jpg'),
('M.1 SAMSUNG Serie 990 PRO', 260.00, 100, 'storage', 'SAMSUNG Serie 990 PRO - 2TB PCIe Gen4. X4 NVMe 2.0c - SSD interno M.2 (MZ-V9P2T0B/AM)', '/images/m2.png'),
('Kingston SSD', 130.00, 100, 'storage', 'Kingston SSD - HDD interno', '/images/ssd.jpg');

select * from producto;