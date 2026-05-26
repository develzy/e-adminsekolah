-- Core Tables
CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    npsn TEXT UNIQUE,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    level TEXT DEFAULT 'SMA', -- TK, SD, MI, SMP, MTS, SMA, SMK, MA, PONDOK PESANTREN
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    school_id TEXT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL, -- super_admin, admin_sekolah, operator, guru, dll
    status TEXT DEFAULT 'active',
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    user_id TEXT,
    nip TEXT,
    nuptk TEXT,
    name TEXT NOT NULL,
    gender TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    nis TEXT,
    nisn TEXT,
    name TEXT NOT NULL,
    gender TEXT,
    birth_place TEXT,
    birth_date DATE,
    address TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    status TEXT DEFAULT 'aktif', -- aktif, pindah, alumni
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE IF NOT EXISTS academic_years (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    name TEXT NOT NULL, -- e.g., 2026/2027
    semester TEXT NOT NULL, -- Ganjil / Genap
    is_active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    academic_year_id TEXT NOT NULL,
    teacher_id TEXT, -- Wali Kelas
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS class_students (
    class_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    school_id TEXT,
    user_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Grades / Assessments
CREATE TABLE IF NOT EXISTS grades (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    academic_year_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    subject TEXT NOT NULL, -- e.g., Matematika, Bahasa Indonesia
    type TEXT NOT NULL, -- e.g., formatif, sumatif, pts, pas
    score REAL NOT NULL,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- CBT Exams
CREATE TABLE IF NOT EXISTS cbt_exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    class_id TEXT NOT NULL,
    duration TEXT,
    date TEXT,
    token TEXT,
    status TEXT DEFAULT 'Aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Student Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    status TEXT NOT NULL, -- Sakit, Izin, Alfa, Hadir
    info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Student Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Student Violations
CREATE TABLE IF NOT EXISTS violations (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    type TEXT NOT NULL,
    point INTEGER DEFAULT 0,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pesantren Hafalan
CREATE TABLE IF NOT EXISTS hafalan (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    kitab TEXT NOT NULL,
    juz TEXT,
    surah TEXT,
    status TEXT DEFAULT 'Lancar',
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pesantren Sorogan
CREATE TABLE IF NOT EXISTS sorogan (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    kitab TEXT NOT NULL,
    bab TEXT,
    catatan TEXT,
    ustadz TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SMK PKL
CREATE TABLE IF NOT EXISTS smk_pkl (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    duration TEXT,
    grade TEXT,
    status TEXT DEFAULT 'Aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SMK Certifications
CREATE TABLE IF NOT EXISTS smk_certifications (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    cert_name TEXT NOT NULL,
    examiner TEXT,
    date TEXT,
    grade TEXT,
    status TEXT DEFAULT 'Lulus',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- School Finance (SPP & Tagihan)
CREATE TABLE IF NOT EXISTS school_finance (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    type TEXT NOT NULL, -- SPP, Uang Pembangunan, Seragam, dll
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'Belum Lunas', -- Lunas, Belum Lunas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Library Books
CREATE TABLE IF NOT EXISTS library_books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT,
    stock INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- WA Broadcast Logs
CREATE TABLE IF NOT EXISTS wa_broadcasts (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status TEXT DEFAULT 'Sent',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
