export const up = (pgm) => {
  pgm.createTable("schools", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(160)", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createTable("students", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    school_id: {
      type: "uuid",
      notNull: true,
      references: "schools",
      onDelete: "restrict",
    },
    first_name: { type: "varchar(100)", notNull: true },
    last_name: { type: "varchar(100)", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "students",
    "students_school_id_id_unique",
    "UNIQUE (school_id, id)",
  );
  pgm.createIndex("students", "school_id", { name: "students_school_id_idx" });
  pgm.createIndex("students", ["school_id", "last_name"], {
    name: "students_school_last_name_idx",
  });
};

export const down = (pgm) => {
  pgm.dropTable("students");
  pgm.dropTable("schools");
};
