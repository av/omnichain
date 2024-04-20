import type { ResourceIndex } from "../data/types";
import { EnvUtils } from "./EnvUtils";

export const BackendResourceUtils = {
    // Single-file resources

    async getSingle(resource: string) {
        try {
            const res = await fetch(
                `${EnvUtils.baseUrl()}/api/resource/single/${resource}`
            );
            return (await res.json()) as Record<string, any>;
        } catch (error) {
            console.error(error);
            return {} as Record<string, any>;
        }
    },

    async setSingle(resource: string, data: Record<string, any>) {
        try {
            await fetch(
                `${EnvUtils.baseUrl()}/api/resource/single/${resource}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
        } catch (error) {
            console.error(error);
        }
    },

    async deleteSingle(resource: string) {
        try {
            await fetch(
                `${EnvUtils.baseUrl()}/api/resource/single/${resource}`,
                {
                    method: "DELETE",
                }
            );
        } catch (error) {
            console.error(error);
        }
    },

    // Multi-file resources

    async getMultiIndex(resource: string) {
        try {
            const res = await fetch(
                `${EnvUtils.baseUrl()}/api/resource/multi/index/${resource}`
            );
            return (await res.json()) as ResourceIndex;
        } catch (error) {
            console.error(error);
            return {} as ResourceIndex;
        }
    },

    async getMultiAll(resource: string) {
        try {
            const res = await fetch(
                `${EnvUtils.baseUrl()}/api/resource/multi/all/${resource}`
            );
            return (await res.json()) as Record<string, any>;
        } catch (error) {
            console.error(error);
            return {} as Record<string, any>;
        }
    },

    async getMultiSingle(resource: string, id: string) {
        try {
            const res = await fetch(
                `${EnvUtils.baseUrl()}/api/resource/multi/single/${resource}/${id}`
            );
            return (await res.json()) as Record<string, any>;
        } catch (error) {
            console.error(error);
            return {} as Record<string, any>;
        }
    },

    async setMultiSingle(
        resource: string,
        id: string,
        data: Record<string, any>
    ) {
        try {
            await fetch(
                `${EnvUtils.baseUrl()}/api/resource/multi/single/${resource}/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
        } catch (error) {
            console.error(error);
        }
    },

    async deleteMultiSingle(resource: string, id: string) {
        try {
            await fetch(
                `${EnvUtils.baseUrl()}/api/resource/multi/single/${resource}/${id}`,
                {
                    method: "DELETE",
                }
            );
        } catch (error) {
            console.error(error);
        }
    },
};
