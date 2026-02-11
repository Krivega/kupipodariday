/**
 * Reference to User entity by id only.
 * Use for ManyToOne relations when only the foreign key is needed
 * (e.g. creating entities without loading full User).
 */
export type UserIdRef = { id: number };
