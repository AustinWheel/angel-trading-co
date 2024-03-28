import { get } from './api';

export type Collectible = {
    id: number,
    name: string,
    series: string,
    image: string,
    product: string,
}

export type Listing = {
    id: number,
    collectible: Collectible,
    available: boolean,
    price: number,
    description: string,
    images: string,
    verified: boolean,
}

export type SearchData = {
    results: number,
    listings: Listing[],
    series: string[],
}


const searchCollectibles = async (searchTerm: string, token: any) => await get(`search?search=${searchTerm}`, token);


export {
    searchCollectibles,
}