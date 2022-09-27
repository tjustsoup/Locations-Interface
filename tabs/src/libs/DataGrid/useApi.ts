import { useData } from "@microsoft/teamsfx-react";
import { GridRowId, GridSelectionModel } from "@mui/x-data-grid";
import { ApiClient, QueryArg } from "jsonapi-react";
import { relative } from "path";
import columns from "./DynamicColumns";

export type ApiGenerator = {
  delete: ReturnType<typeof useData>;
  fetch: ReturnType<typeof useData>;
  mutate: ReturnType<typeof useData>;
};

export default function useApi(
  client: ApiClient,
  dataType: string,
  apiParams: QueryArg<any>,
  dgPage: number,
  dgPageSize: number,
  handleMoreInfo: Function,
  mutateData: [
    {
      field?: string;
      value?: string;
      id?: string;
      smartystreets?: any;
    }
  ],
  schema: any,
  selectionModel: GridSelectionModel,
  setMutateData: Function,
  setColumnData: Function,
  setRowCount: Function,
  setRowData: Function,
  additionalColumns?: any
): ApiGenerator {
  return {
    // DELETE
    delete: useData(
      async () => {
        return await Promise.all(
          selectionModel.map( async (id: GridRowId) => {
            return client.delete([dataType, id])
          })
        )

      },
      { autoLoad: false }
    ),

    // MUTATE
    mutate: useData(
      async () => {
        const result = await Promise.all(
          mutateData.map(async (entry: any) => {
            // If it contains "id", this will make it a Patch request
            let prefix: QueryArg<any> = [dataType];
            if (entry.id) {
              prefix.push(entry.id);
              delete entry.id;
            }
            // Array of relationships of the dataType
            const relatives = Object.keys(schema[dataType].relationships);
            return client
              .mutate(prefix, entry)
              .then(async (res: any) => {
                console.log("Initial Mutate", res);
                // Per each Relationship of the dataType, if the entry is submitting data for that relationship, mutate call
                relatives.forEach(async (rel: string) => {
                  if (entry[rel]) {
                    let params = { ...entry[rel] };
                    let relKey = Object.keys(schema[rel].relationships).filter((key: string) => {
                      return schema[rel].relationships[key].type === dataType
                    })
                    if (relKey.length > 0) {
                      params[relKey[0]] = { id: res.data.id }
                    }
                    console.log(params);
                    return await client
                      .mutate([rel], params)
                      .then((e: any) => console.log("Extra Mutate", e));
                  }
                });
              })
          })
        );
        setMutateData([{}]);
        console.log(result);
        return result;
      },
      { autoLoad: false }
    ),

    // FETCH
    fetch: useData(
      async () => {
        if ((apiParams as Array<any>).at(0)) {
          setRowData([]);
          let newParams = apiParams;
          let page = {
            number: dgPage + 1,
            size: dgPageSize,
          };
          if (Array.isArray(newParams)) {
            if (typeof newParams.at(-1) !== "string") {
              newParams.at(-1)["page"] = page;
            } else {
              newParams.push({
                page: page,
              });
            }
          }
          console.log(newParams);
          const { data, meta, error } = await client.fetch(newParams);
          if (data !== undefined) {
            console.log(data);
            let newData = data;
            if (!Array.isArray(data)) {
              newData = [data];
            }
            setColumnData(columns(newData as any, apiParams, handleMoreInfo, additionalColumns));
            setRowCount(meta?.total);
            setRowData(newData as any);
          } else if (error) {
            console.log("error handling go!");
          }
        }
      },
      { autoLoad: false }
    ),
  };
}
