export interface SuccessResult<Data> {
  success: true;
  data: Data;
}

export interface FailureResult<Err extends Error> {
  success: false;
  error: Err;
}

export type Result<Data, Err extends Error = never> = SuccessResult<Data> | FailureResult<Err>;

export type PromisedResult<Data, Err extends Error = never> = Promise<Result<Data, Err>>;

export class Block {
  static async succeed<Data>(result: Data): PromisedResult<Data, never> {
    return { success: true, data: result };
  }

  static async fail<Err extends Error>(error: Err): PromisedResult<never, Err> {
    return { success: false, error };
  }

  static async convert<Data, Err extends Error>(pair: {
    try: () => Promise<Data>;
    catch: (e: unknown) => Err;
  }): PromisedResult<Data, Err> {
    try {
      const result = await pair.try();
      return Block.succeed(result);
    } catch (e) {
      const result = await pair.catch(e);
      return Block.fail(result);
    }
  }
}

export class Node<Data, Err extends Error = never, Context = never> {
  constructor(
    private readonly node: PromisedResult<Data, Err>,
    private readonly context: Context
  ) {}

  public add<DataB, ErrB extends Error>(
    node: (result: Result<Data, Err>, context: Context) => PromisedResult<DataB, ErrB>
  ): Node<DataB, Err | ErrB, Context> {
    return new Node(
      this.node.then((r) => node(r, this.context)),
      this.context
    );
  }

  public onSuccess<DataB, ErrB extends Error>(
    callback: (data: Data, context: Context) => PromisedResult<DataB, ErrB>
  ): Node<DataB, Err | ErrB, Context> {
    return this.add(
      (r) => (r.success ? callback(r.data, this.context) : Block.fail(r.error)) as PromisedResult<DataB, Err | ErrB>
    );
  }

  public onError<DataB, ErrB extends Error>(
    callback: (error: Err, context: Context) => PromisedResult<DataB, ErrB>
  ): Node<DataB, Err | ErrB, Context> {
    return this.add(
      (r) => (r.success ? Block.succeed(r.data) : callback(r.error, this.context)) as PromisedResult<DataB, Err | ErrB>
    );
  }

  public addData<DataB, ErrB extends Error>(
    callback: (data: Data, context: Context) => PromisedResult<DataB, ErrB>
  ): Node<Data & DataB, Err | ErrB, Context> {
    return this.add((r) => {
      if (r.success) {
        return callback(r.data, this.context).then(
          (s) =>
            (s.success ? Block.succeed({ ...r.data, ...s.data }) : Block.fail(s.error)) as PromisedResult<
              Data & DataB,
              Err | ErrB
            >
        );
      } else {
        return Block.fail(r.error);
      }
    });
  }

  public addContext<ContextB>(
    extra: ContextB
  ): Node<Data, Err, [Context] extends [never] ? ContextB : Context & ContextB> {
    return new Node(this.node, { ...this.context, ...extra });
  }

  public runAsync(): PromisedResult<Data, Err> {
    return this.node;
  }
}

export class Chain {
  static start(): Node<undefined, never, never>;
  static start<Data>(initial: Data): Node<Data, never, never>;
  static start<Data, Context>(initial: Data, context: Context): Node<Data, never, Context>;
  static start<Data, Context>(initial?: Data, context?: Context): Node<Data | undefined, never, Context | undefined> {
    return new Node(Block.succeed(initial), context);
  }
}
