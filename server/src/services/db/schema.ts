import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password").default("").notNull(),
  rsaPublicKey: text("rsa_public_key"),
  eddsaPublicKey: text("eddsa_public_key"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessionTable = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const documentTable = pgTable("documents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id),
  hash: text("hash").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const signatureTable = pgTable("signatures", {
  id: varchar("id", { length: 255 }).primaryKey(),
  documentId: varchar("document_id", { length: 255 })
    .notNull()
    .references(() => documentTable.id),
  rsaSignature: text("rsa_signature").notNull(),
  eddsaSignature: text("eddsa_signature").notNull(),
  signedAt: timestamp("signed_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const keyTable = pgTable("keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id),
  keyName: varchar("key_name", { length: 255 }).notNull(),
  publicKeyRsa: text("public_key_rsa").notNull(),
  publicKeyEddsa: text("public_key_eddsa").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  revokedAt: timestamp("revoked_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const userTableRelation = relations(userTable, ({ many }) => ({
  documents: many(documentTable),
}));

export const documentTableRelation = relations(documentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [documentTable.userId],
    references: [userTable.id],
  }),
}));

export const signatureTableRelation = relations(signatureTable, ({ one }) => ({
  document: one(documentTable, {
    fields: [signatureTable.documentId],
    references: [documentTable.id],
  }),
}));

export type DocumentTable = typeof documentTable.$inferSelect;
export type SignatureTable = typeof signatureTable.$inferSelect;
export type KeyTable = typeof keyTable.$inferSelect;
