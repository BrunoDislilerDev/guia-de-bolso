import assert from "node:assert/strict";
import test from "node:test";
import { deleteUserAccount } from "./deleteUserAccount.js";

test("deleteUserAccount remove dados e usuário auth", async () => {
  const userId = "11111111-1111-1111-1111-111111111111";
  const deleted = { tables: [], storage: [], auth: false };

  const admin = {
    from(table) {
      return {
        delete() {
          return {
            eq(_col, id) {
              deleted.tables.push({ table, id });
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
    storage: {
      from() {
        return {
          list() {
            return Promise.resolve({ data: [{ name: "avatar.jpg" }], error: null });
          },
          remove(paths) {
            deleted.storage.push(paths);
            return Promise.resolve({ error: null });
          },
        };
      },
    },
    auth: {
      admin: {
        deleteUser(id) {
          deleted.auth = id;
          return Promise.resolve({ error: null });
        },
      },
    },
  };

  const result = await deleteUserAccount(admin, userId);

  assert.equal(result.ok, true);
  assert.equal(deleted.auth, userId);
  assert.ok(deleted.tables.some((row) => row.table === "perfis"));
  assert.ok(deleted.storage[0]?.includes(`avatars/${userId}/avatar.jpg`));
});
