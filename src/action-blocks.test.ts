import { Block, Chain, Result } from "./action-blocks";
import { describe, expect, test } from "vitest";

describe("Block", () => {
  test("succeed()", async () => {
    const actual = Block.succeed("result");
    expect(await actual).toEqual({ success: true, data: "result" });
  });

  test("fail()", async () => {
    const actual = Block.fail("error");
    expect(await actual).toEqual({ success: false, error: "error" });
  });

  test("convert() success", async () => {
    const actual = Block.convert({
      try: () => Promise.resolve("result"),
      catch: (e) => e,
    });

    expect(await actual).toEqual({ success: true, data: "result" });
  });

  test("convert() fail", async () => {
    const actual = Block.convert({
      try: async () => {
        throw "error";
      },
      catch: (e) => e,
    });

    expect(await actual).toEqual({ success: false, error: "error" });
  });
});

describe("Chain", () => {
  test("start(a,b) success", async () => {
    const start = Block.succeed(2);
    const converting = (previous: Result<number, string>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.fail(previous.error);

    const actual = Chain.start(start, converting);

    expect(await actual).toEqual({ success: true, data: 4 });
  });

  test("start(a,b) a fail", async () => {
    const start = Block.fail("error");
    const converting = (previous: Result<number, string>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.fail(previous.error);

    const actual = Chain.start(start, converting);

    expect(await actual).toEqual({ success: false, error: "error" });
  });

  test("start(a,b) b fail", async () => {
    const start = Block.succeed(2);
    const converting = () => Block.fail("error");

    const actual = Chain.start(start, converting);

    expect(await actual).toEqual({ success: false, error: "error" });
  });

  test("start(a,b) b fix", async () => {
    const start = Block.fail("error");
    const converting = (previous: Result<number, string>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.succeed(-2);

    const actual = Chain.start(start, converting);

    expect(await actual).toEqual({ success: true, data: -2 });
  });

  test("start3(a,b,c) success", async () => {
    const start = Block.succeed(2);
    const converting = (previous: Result<number, string>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.fail(previous.error);

    const actual = Chain.start(start, converting, converting);

    expect(await actual).toEqual({ success: true, data: 6 });
  });

  test("start3(a,b,c) a fail", async () => {
    const start = Block.fail("error");
    const converting = (previous: Result<number, string>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.fail(previous.error);

    const actual = Chain.start(start, converting);

    expect(await actual).toEqual({ success: false, error: "error" });
  });

  test("withSuccess(a,b) success", async () => {
    const start = Block.succeed(2);
    const converting = (previous: number) => Block.succeed(previous + 2);

    const actual = Chain.withSuccess(converting)(await start);

    expect(await actual).toEqual({ success: true, data: 4 });
  });

  test("withSuccess(a,b) a fail", async () => {
    const start = Block.fail("error");
    const converting = (previous: number) => Block.succeed(previous + 2);

    const actual = Chain.withSuccess(converting)(await start);

    expect(await actual).toEqual({ success: false, error: "error" });
  });

  test("withSuccess(a,b) b fail", async () => {
    const start = Block.succeed(2);
    const converting = (previous: number) => Block.fail("error");

    const actual = Chain.withSuccess(converting)(await start);

    expect(await actual).toEqual({ success: false, error: "error" });
  });

  test("addData(a,b) success", async () => {
    const start = Block.succeed({ first: "first value" });
    const converting = () => Block.succeed({ second: "second value" });

    const actual = Chain.addData(converting)(await start);

    expect(await actual).toEqual({ success: true, data: { first: "first value", second: "second value" } });
  });
});

describe("Usage", () => {
  test("Prepare 2 services and executes 2 actions", async () => {
    const service1 = Block.succeed({ a: 2 });
    const service2 = Block.succeed({ b: 3 });
    const action1 = (data: { a: number; b: number }) =>
      data.b > 0 ? Block.succeed(data.a + data.b) : Block.fail("b is negative");
    const action2 = (data: number) => Block.succeed(data * 2);

    const services = Chain.start(
      service1,
      Chain.addData(() => service2)
    );
    expect(await services).toEqual({ success: true, data: { a: 2, b: 3 } });

    const actual = Chain.start(services, Chain.withSuccess(action1), Chain.withSuccess(action2));

    expect(await actual).toEqual({ success: true, data: 10 });
  });
});
