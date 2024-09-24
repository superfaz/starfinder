import { Block, Chain, Node, Result } from "./action-blocks";
import { describe, expect, test } from "vitest";

class TestError extends Error {
  constructor(message?: string) {
    super(message ?? "error");
  }
}

describe("Block", () => {
  test("succeed()", async () => {
    const actual = Block.succeed("result");
    expect(await actual).toEqual({ success: true, data: "result" });
  });

  test("fail()", async () => {
    const actual = await Block.fail(new TestError());
    expect(actual).toEqual({ success: false, error: new TestError("error") });
  });

  test("convert() success", async () => {
    const actual = Block.convert({
      try: () => Promise.resolve("result"),
      catch: () => new TestError(),
    });

    expect(await actual).toEqual({ success: true, data: "result" });
  });

  test("convert() fail", async () => {
    const actual = Block.convert({
      try: async () => {
        throw new TestError();
      },
      catch: (e) => (e instanceof Error ? e : new TestError()),
    });

    expect(await actual).toEqual({ success: false, error: new TestError("error") });
  });
});

describe("Node", () => {
  test("runAsync() success", async () => {
    const start = Block.succeed(2);
    const actual = new Node(start, undefined);
    expect(await actual.runAsync()).toEqual({ success: true, data: 2 });
  });

  test("runAsync() fail", async () => {
    const start = Block.fail(new TestError());
    const actual = new Node(start, undefined);
    expect(await actual.runAsync()).toEqual({ success: false, error: new TestError("error") });
  });

  test("add() success", async () => {
    const start = Block.succeed(2);
    const converting = (previous: Result<number, TestError>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.fail(previous.error);

    const actual = new Node(start, undefined).add(converting);

    expect(await actual.runAsync()).toEqual({ success: true, data: 4 });
  });

  test("add() fail", async () => {
    const start = Block.fail(new TestError());
    const converting = (previous: Result<number, TestError>) =>
      previous.success ? Block.succeed(previous.data + 2) : Block.fail(previous.error);

    const actual = new Node(start, undefined).add(converting);

    expect(await actual.runAsync()).toEqual({ success: false, error: new TestError("error") });
  });

  test("onSuccess() success", async () => {
    const start = Block.succeed(2);
    const converting = (previous: number) => Block.succeed(previous + 2);

    const actual = new Node(start, undefined).onSuccess(converting);

    expect(await actual.runAsync()).toEqual({ success: true, data: 4 });
  });

  test("onSuccess() fail", async () => {
    const start = Block.fail(new TestError());
    const converting = (previous: number) => Block.succeed(previous + 2);

    const actual = new Node(start, undefined).onSuccess(converting);

    expect(await actual.runAsync()).toEqual({ success: false, error: new TestError("error") });
  });

  test("onError() recover", async () => {
    const start = Block.fail(new TestError());
    const converting = (error: TestError) => Block.succeed(error.message + "2");

    const actual = new Node(start, undefined).onError(converting);

    expect(await actual.runAsync()).toEqual({ success: true, data: "error2" });
  });

  test("onError() fail", async () => {
    const start = Block.fail(new TestError());
    const converting = (error: TestError) => Block.fail(new TestError(error.message + "2"));

    const actual = new Node(start, undefined).onError(converting);

    expect(await actual.runAsync()).toEqual({ success: false, error: new TestError("error2") });
  });

  test("addData() success", async () => {
    const start = Block.succeed({ current: 2 });
    const extra = () => Block.succeed({ extra: 3 });

    const actual = new Node(start, undefined).addData(extra);

    expect(await actual.runAsync()).toEqual({ success: true, data: { extra: 3, current: 2 } });
  });

  test("addContext() success", async () => {
    const start = Block.succeed(2);

    const actual = new Node(start, {})
      .addContext({ extra: 3 })
      .onSuccess((data, context) => Block.succeed(data + context.extra));

    expect(await actual.runAsync()).toEqual({ success: true, data: 5 });
  });
});

describe("Usage", () => {
  test("Build data and executes 2 actions", async () => {
    const data1 = Block.succeed({ a: 2 });
    const data2 = Block.succeed({ b: 3 });
    const action1 = (data: { a: number; b: number }) =>
      data.b > 0 ? Block.succeed(data.a + data.b) : Block.fail(new TestError("b is negative"));
    const action2 = (data: number) => Block.succeed(data * 2);

    const actual = Chain.start()
      .addData(() => data1)
      .addData(() => data2)
      .onSuccess(action1)
      .onSuccess(action2);

    expect(await actual.runAsync()).toEqual({ success: true, data: 10 });
  });

  test("Add 2 services and executes 2 actions", async () => {
    const service1 = { a: 2 };
    const service2 = { b: 3 };
    const action1 = (data: number, context: { a: number; b: number }) =>
      data > 0 ? Block.succeed(data + context.a + context.b) : Block.fail(new TestError("negative"));
    const action2 = (data: number) => Block.succeed(data * 2);

    const actual = Chain.start(2)
      .addContext(service1)
      .addContext(service2)
      .onSuccess(action1)
      .onSuccess(action1)
      .onSuccess(action2);

    expect(await actual.runAsync()).toEqual({ success: true, data: 24 });
  });

  test("Prepare 2 services and executes 2 actions", async () => {
    const service1 = Block.succeed({ a: 2 });
    const service2 = Block.succeed({ b: 3 });
    const action1 = (data: number, context: { a: number; b: number }) =>
      data > 0 ? Block.succeed(data + context.a + context.b) : Block.fail(new TestError("negative"));
    const action2 = (data: number) => Block.succeed(data * 2);

    const services = await Chain.start({})
      .addData(() => service1)
      .addData(() => service2)
      .runAsync();

    if (services.success) {
      const actual = Chain.start(2, services.data).onSuccess(action1).onSuccess(action1).onSuccess(action2);
      expect(await actual.runAsync()).toEqual({ success: true, data: 24 });
    } else {
      expect.fail("services failed");
    }
  });

  test("Add 2 services and recover from an error", async () => {
    const service1 = { a: 2 };
    const service2 = { b: 3 };
    const action1 = (data: number, context: { a: number; b: number }) =>
      data > 0 ? Block.succeed(data + context.a + context.b) : Block.fail(new TestError("negative"));
    const action2 = (data: number) => Block.succeed(data * 2);

    const actual = Chain.start(-2)
      .addContext(service1)
      .addContext(service2)
      .onSuccess(action1)
      .onError(() => Block.succeed(1))
      .onSuccess(action1)
      .onSuccess(action2);

    expect(await actual.runAsync()).toEqual({ success: true, data: 12 });
  });

  test("error handling", async () => {
    const actual = await Chain.start(-2)
      .add(() => Block.fail(new Error("error")))
      .runAsync();

    if (!actual.success) {
      console.log(actual.success, actual.error.message, "|", actual.error.stack);
    }
    expect(actual).toEqual({ success: false, error: new Error("error") });
  });
});
