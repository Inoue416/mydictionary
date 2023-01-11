CREATE TABLE dictionary(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT,
    mean TEXT,
    sample_sentence TEXT,
    word_level int,
    img_url TEXT,
    vc_url TEXT,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TABLE mydictionary(
    word_id int,
    memory int,
    nextdate datetime,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TABLE study_record(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score int NOT NULL,
    mode int,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TABLE study_times(
    word_id int,
    answer_num int,
    miss_num int,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
