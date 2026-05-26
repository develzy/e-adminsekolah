-- Insert Demo Schools
INSERT OR IGNORE INTO schools (id, name, npsn, address, phone, level, status) VALUES
('school-tk', 'TK Pembina Develzy', '10101011', 'Jl. Pendidikan No. 1', '081234567890', 'TK', 'active'),
('school-sd', 'SDN Kalisalak Develzy', '10101012', 'Jl. Raya Kalisalak No. 42', '081234567891', 'SD', 'active'),
('school-smp', 'SMP Negeri Develzy', '10101013', 'Jl. Pemuda No. 10', '081234567892', 'SMP', 'active'),
('school-pesantren', 'Pondok Pesantren Darussalam', '10101014', 'Jl. Lirboyo No. 9', '081234567893', 'PONDOK PESANTREN', 'active');

-- Insert Academic Years
INSERT OR IGNORE INTO academic_years (id, school_id, name, semester, is_active) VALUES
('ay-tk', 'school-tk', '2026/2027', 'Ganjil', 1),
('ay-sd', 'school-sd', '2026/2027', 'Ganjil', 1),
('ay-smp', 'school-smp', '2026/2027', 'Ganjil', 1),
('ay-pesantren', 'school-pesantren', '2026/2027', 'Ganjil', 1);

-- Insert Classes
INSERT OR IGNORE INTO classes (id, school_id, academic_year_id, teacher_id, name, level) VALUES
('class-tk-a', 'school-tk', 'ay-tk', NULL, 'Kelompok A', 'TK'),
('class-sd-1a', 'school-sd', 'ay-sd', NULL, 'Kelas 1-A', 'SD'),
('class-smp-7a', 'school-smp', 'ay-smp', NULL, 'Kelas VII-A', 'SMP'),
('class-pesantren-ula', 'school-pesantren', 'ay-pesantren', NULL, 'Kelas Ula 1', 'PONDOK PESANTREN');

-- Insert Users
-- Developer/Super Admin: develzy.im (password: 25042023 -> 130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713)
INSERT OR IGNORE INTO users (id, school_id, name, email, password_hash, role, status) VALUES
('user-developer', NULL, 'DEVELZY Developer', 'develzy.im', '130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713', 'super_admin', 'active');

-- TK Demo Admin: tk@develzy.im (password: 25042023 -> 130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713)
INSERT OR IGNORE INTO users (id, school_id, name, email, password_hash, role, status) VALUES
('user-tk', 'school-tk', 'Admin TK Demo', 'tk@develzy.im', '130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713', 'admin_sekolah', 'active');

-- SD Demo Admin: sd@develzy.im (password: 25042023 -> 130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713)
INSERT OR IGNORE INTO users (id, school_id, name, email, password_hash, role, status) VALUES
('user-sd', 'school-sd', 'Admin SD Demo', 'sd@develzy.im', '130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713', 'admin_sekolah', 'active');

-- SMP Demo Admin: smp@develzy.im (password: 25042023 -> 130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713)
INSERT OR IGNORE INTO users (id, school_id, name, email, password_hash, role, status) VALUES
('user-smp', 'school-smp', 'Admin SMP Demo', 'smp@develzy.im', '130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713', 'admin_sekolah', 'active');

-- Pesantren Demo Admin: pesantren@develzy.im (password: 25042023 -> 130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713)
INSERT OR IGNORE INTO users (id, school_id, name, email, password_hash, role, status) VALUES
('user-pesantren', 'school-pesantren', 'Admin Pesantren Demo', 'pesantren@develzy.im', '130d70d83f9cef571ce8cbf838247e207472f1cdda818b592543d4090e027713', 'admin_sekolah', 'active');
