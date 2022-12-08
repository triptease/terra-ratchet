import {randomHash} from "@triptease/terra-ratchet/hash";
import {BigQuery} from "@google-cloud/bigquery";

export const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? 'triptease-terra-ratchet';
export const datasetId = 'temp';
export function tableId() {
  return 'ratchet-' + randomHash();
}

export async function canConnectToBigQuery(): Promise<boolean> {
    try {
        await new BigQuery({projectId}).getDatasets();
        return true;
    } catch (e) {
        return false;
    }
}