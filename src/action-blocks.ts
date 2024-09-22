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

export class Chain {
  static async start<A, B, Error>(a: Promise<A>, ab: (result: A) => PromisedResult<B, Error>): PromisedResult<B, Error>;
  static async start<A, B, C, Error>(
    a: Promise<A>,
    ab: (result: A) => Promise<B>,
    bc: (result: B) => PromisedResult<C, Error>
  ): PromisedResult<C, Error>;
  static async start<A, B, C, D, Error>(
    a: Promise<A>,
    ab: (result: A) => Promise<B>,
    bc: (result: B) => Promise<C>,
    cd: (result: C) => PromisedResult<D, Error>
  ): PromisedResult<C, Error>;
  static async start<A, Data, Error>(
    a: Promise<A>,
    ...args: ((result: unknown) => Promise<unknown>)[]
  ): PromisedResult<Data, Error> {
    let result: unknown = await a;
    for (let i = 0, len = args.length; i < len; i++) {
      result = await args[i](result);
    }
    return result as PromisedResult<Data, Error>;
  }

  static withSuccess<Data1, Error1, Data2, Error2>(
    callback: (result: Data1) => PromisedResult<Data2, Error2>
  ): (result: Result<Data1, Error1>) => PromisedResult<Data2, Error1 | Error2> {
    return async (result) => {
      if (result.success) {
        return callback(result.data);
      } else {
        return result;
      }
    };
  }

  static addData<Data1, Error1, Data2, Error2>(
    callback: (result: Data1) => PromisedResult<Data2, Error2>
  ): (result: Result<Data1, Error1>) => PromisedResult<Data1 & Data2, Error1 | Error2> {
    return Chain.withSuccess(async (data1) => {
      const result2 = await callback(data1);
      if (result2.success) {
        return Block.succeed({ ...data1, ...result2.data });
      } else {
        return result2;
      }
    });
  }
}
