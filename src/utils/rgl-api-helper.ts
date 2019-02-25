import got from "got";

export type RglApiResponse = {
    SteamId: string,
    CurrentAlias: string,
    PlayerHistory: Array<{
        SteamId: string,
        CurrentAlias: string,
        TeamId: number,
        TeamName: string,
        DivisionId: number,
        DivisionName: string,
        GroupId: number,
        GroupName: string,
        SeasonId: number,
        SeasonName: string,
        RegionId: number,
        RegionName: string,
        RegionURL: string,
        RegionFormat: string,
        StartDate: string,
        EndDate?: string,
        Wins: number,
        Loses: number,
        AmtWon?: number,
        EndRank?: number
    }>
};

export async function getPlayerData(id64: string): Promise<RglApiResponse> {
    let res = await got("http://rgl.gg/Public/API/v1/PlayerHistory.aspx?s=" + id64, { json: true });

    let data: RglApiResponse = res.body;

    return data;
}