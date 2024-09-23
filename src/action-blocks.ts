export interface SuccessResult<Data> {
  success: true;
  data: Data;
}

export interface FailureResult<Error> {
  success: false;
  error: Error;
}

export type Result<Data, Error = never> = SuccessResult<Data> | FailureResult<Error>;

export type PromisedResult<Data, Error = never> = Promise<Result<Data, Error>>;

export class Block {
  static async succeed<Data>(result: Data): PromisedResult<Data, never> {
    return { success: true, data: result };
  }

  static async fail<Error>(error: Error): PromisedResult<never, Error> {
    return { success: false, error };
  }

  static async convert<Data, Error>(pair: {
    try: () => Promise<Data>;
    catch: (e: unknown) => Error;
  }): PromisedResult<Data, Error> {
    try {
      const result = await pair.try();
      return Block.succeed(result);
    } catch (e) {
      const result = await pair.catch(e);
      return Block.fail(result);
    }
  }
}

export class Node<Data, Error = never, Context = never> {
  constructor(
    private readonly node: PromisedResult<Data, Error>,
    private readonly context: Context
  ) {}

  public add<DataB, ErrorB>(
    node: (result: Result<Data, Error>, context: Context) => PromisedResult<DataB, ErrorB>
  ): Node<DataB, Error | ErrorB, Context> {
    return new Node(
      this.node.then((r) => node(r, this.context)),
      this.context
    );
  }

  public onSuccess<DataB, ErrorB>(
    callback: (data: Data, context: Context) => PromisedResult<DataB, ErrorB>
  ): Node<DataB, Error | ErrorB, Context> {
    return this.add(
      (r) => (r.success ? callback(r.data, this.context) : Block.fail(r.error)) as PromisedResult<DataB, Error | ErrorB>
    );
  }

  public addData<DataB, ErrorB>(
    callback: (data: Data, context: Context) => PromisedResult<DataB, ErrorB>
  ): Node<Data & DataB, Error | ErrorB, Context> {
    return this.add((r) => {
      if (r.success) {
        return callback(r.data, this.context).then(
          (s) =>
            (s.success ? Block.succeed({ ...r.data, ...s.data }) : Block.fail(s.error)) as PromisedResult<
              Data & DataB,
              Error | ErrorB
            >
        );
      } else {
        return Block.fail(r.error);
      }
    });
  }

  public addContext<ContextB, ErrorB>(extra: ContextB): Node<Data, Error | ErrorB, Context & ContextB> {
    return new Node(this.node, { ...this.context, ...extra });
  }

  public runAsync(): PromisedResult<Data, Error> {
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
