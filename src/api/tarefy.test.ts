import { describe, expect, it } from "bun:test";
import {
  fetchTask,
  fetchInternalComments,
  fetchPublicComments,
} from "./tarefy.js";

const TOKEN = "test-token";

describe("tarefy API", () => {
  it("fetchTask monta URL e headers corretos", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (url: string, init?: RequestInit) => {
      expect(url).toBe("https://app.tarefy.com/nodeapi/v2/tasks/123");
      expect(init?.headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      });
      return Promise.resolve(
        new Response(JSON.stringify({ id: 456, title: "Task" }), {
          status: 200,
        })
      );
    };

    const result = await fetchTask("123", TOKEN);
    expect(result).toEqual({ id: 456, title: "Task" });
    globalThis.fetch = originalFetch;
  });

  it("fetchTask lança em status não-ok", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = () =>
      Promise.resolve(new Response("Unauthorized", { status: 401 }));

    await expect(fetchTask("1", TOKEN)).rejects.toThrow(/401/);
    globalThis.fetch = originalFetch;
  });

  it("fetchInternalComments usa ticketId na query", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (url: string) => {
      expect(url).toContain("/nodeapi/task/comments?id=999");
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 1, text: "comentário" }]), {
          status: 200,
        })
      );
    };

    const result = await fetchInternalComments(999, TOKEN);
    expect(result).toEqual([{ id: 1, text: "comentário" }]);
    globalThis.fetch = originalFetch;
  });

  it("fetchPublicComments usa ticketId na query", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (url: string) => {
      expect(url).toContain("/nodeapi/task/comments/client?id=888");
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 2 }]), { status: 200 })
      );
    };

    const result = await fetchPublicComments(888, TOKEN);
    expect(result).toEqual([{ id: 2 }]);
    globalThis.fetch = originalFetch;
  });
});
