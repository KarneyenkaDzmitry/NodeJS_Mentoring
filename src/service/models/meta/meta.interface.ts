export interface UserSearchMetadata {
    meta: {
        chunk: number;
        total: {
            chunks: number;
            matches: number;
        };
        searchQuery: {
            loginSubstring: string;
        };
    };
}
