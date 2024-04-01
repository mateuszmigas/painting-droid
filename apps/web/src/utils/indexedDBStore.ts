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

  init(schema: IndexedDBSchema<TStores>) {
    return new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open(schema.name, schema.version);
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
        this.db = event.target?.result as IDBDatabase;

        Object.keys(schema.stores).forEach((name) => {
          if (!this.db.objectStoreNames.contains(name)) {
            this.db.createObjectStore(name);
          }
        });
      };
    });
  }

  putValuesWithKeys<T>(
    tableName: TStoresKey,
    entries: { key: string; value: T }[]
  ) {
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

  getValuesWithKeys<T>(tableName: TStoresKey) {
    return new Promise<{ key: string; value: T }[]>((resolve, reject) => {
      const request = this.db
        .transaction([tableName as string], "readonly")
        .objectStore(tableName as string)
        .openCursor();

      const result: { key: string; value: T }[] = [];
      request.onsuccess = (e) => {
        const event = e as never as EventWithCursor;
        const cursor = event.target.result;
        if (cursor) {
          result.push({ key: cursor.key as string, value: cursor.value as T });
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (event) => reject(event);
    });
  }

  deleteKeys(tableName: TStoresKey, keys: string[]) {
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction(
        [tableName as string],
        "readwrite"
      );
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event);

      keys.forEach((key) => {
        transaction.objectStore(tableName as string).delete(key);
      });
    });
  }
}

