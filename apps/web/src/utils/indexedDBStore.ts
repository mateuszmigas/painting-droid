type IndexedDBSchema<TStores extends Record<string, string>> = {
  name: string;
  version: number;
  stores: TStores;
};

type EventWithDb = { target: { result: IDBDatabase } };
type EventWithCursor = { target: { result: IDBCursorWithValue } };

export class IndexedDBStore<
  TStores extends Record<string, string>,
  TStoresKey = keyof TStores
> {
  private db!: IDBDatabase;

  constructor(private schema: IndexedDBSchema<TStores>) {}

  async putValuesWithKeys<T>(
    tableName: TStoresKey,
    entries: { key: string; value: T }[]
  ) {
    await this.lazyInit();
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction(
        [tableName as string],
        "readwrite"
      );
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event);

      entries.forEach((entry) => {
        transaction
          .objectStore(tableName as string)
          .put(entry.value, entry.key);
      });
    });
  }

  async getValuesByKey<T>(tableName: TStoresKey) {
    await this.lazyInit();
    return new Promise<Map<string, T>>((resolve, reject) => {
      const request = this.db
        .transaction([tableName as string], "readonly")
        .objectStore(tableName as string)
        .openCursor();

      const result = new Map<string, T>();
      request.onsuccess = (e) => {
        const event = e as never as EventWithCursor;
        const cursor = event.target.result;
        if (cursor) {
          result.set(cursor.key as string, cursor.value as T);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (event) => reject(event);
    });
  }

  async deleteAll(tableName: TStoresKey) {
    await this.lazyInit();
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction(
        [tableName as string],
        "readwrite"
      );
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event);
      transaction.objectStore(tableName as string).clear();
    });
  }

  private async lazyInit() {
    if (this.db) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open(
        this.schema.name,
        this.schema.version
      );
      request.onerror = () => {
        reject();
      };
      request.onsuccess = (e) => {
        const event = e as never as EventWithDb;
        this.db = event.target?.result as IDBDatabase;
        resolve();
      };
      request.onupgradeneeded = (e) => {
        const event = e as never as EventWithDb;
        const db = event.target.result as IDBDatabase;
        Object.keys(this.schema.stores).forEach((name) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name);
          }
        });
      };
    });
  }
}
